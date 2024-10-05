import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { getConfig } from "./common";
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

  await builder.sendAndConfirm(umi);

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
