import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import bs58 from "bs58";
import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { getConfig, getConnection, getSonicConnection, wait } from "./common";
import { loadData, saveData } from "./storage";
import { ChainType, MerkleTree, Wallet } from "./type";

const SONALA_TREE_KEYS = {
  public: "merkleTreePublicKey",
  secret: "merkleTreeSecretKey",
};

const SONIC_TREE_KEYS = {
  public: "sonicMerkleTreePublicKey",
  secret: "sonicMerkleTreeSecretKey",
};

// Get Merkle tree
// @return {
//   publicKey: string,
//   secretKey: number[],
// } | null
export const getMerkeTree = async (chainType: ChainType = "solana") => {
  const publicKey = await loadData(getCacheKeys(chainType).public);
  const secretKey = await loadData(getCacheKeys(chainType).secret);
  if (!publicKey || !secretKey) {
    return null;
  }
  return {
    publicKey,
    secretKey,
  };
};

// Create a new Merkle tree
// @param wallet: {
//   publicKey: string,
//   secretKey: number[],
// } - Payer wallet information
// @return {
//   publicKey: string,
//   secretKey: string,
// }
export const createMerkleTree = async (
  wallet: Wallet,
  chainType: ChainType = "solana"
): Promise<MerkleTree> => {
  const config = getConfig();
  const connection =
    chainType === "solana" ? getConnection() : getSonicConnection();
  const umi = createUmi(
    chainType === "solana" ? config.endpoint : config.sonicEndpoint
  );

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  const merkleTree = generateSigner(umi);

  const builder = await createTree(umi, {
    merkleTree,
    // maxDepth: 3,
    // maxBufferSize: 8,
    maxDepth: 14,
    maxBufferSize: 64,
  });

  console.log("Start creating Merkle tree...");

  const totalNumberOfRetries = 10;
  let landed = false;
  for (let i = 0; i < totalNumberOfRetries; i++) {
    try {
      const signature = await builder.send(umi, {
        skipPreflight: true,
        maxRetries: 0,
      });

      await wait(5000);

      // Check signature status
      const status = await connection.getSignatureStatus(
        bs58.encode(signature)
      );

      console.log(
        "sigStatus",
        status.value?.confirmationStatus,
        status.context.slot
      );
      console.log("signature", signature);

      if (status.value?.confirmationStatus === "confirmed") {
        console.log("landed");
        console.log("Signature", bs58.encode(signature));
        console.log("status", status);
        landed = true;
        break;
      }

      await wait(2000);
    } catch (err) {
      console.log("Error in createMerkleTree", err);
    }
  }

  const publicKey = merkleTree.publicKey.toString();
  const secretKey = Array.from(merkleTree.secretKey);

  await saveData(getCacheKeys(chainType).public, publicKey);
  await saveData(getCacheKeys(chainType).secret, secretKey);

  return {
    publicKey,
    secretKey,
  };
};

const getCacheKeys = (chainType: ChainType) => {
  if (chainType === "solana") {
    return SONALA_TREE_KEYS;
  }
  return SONIC_TREE_KEYS;
};
