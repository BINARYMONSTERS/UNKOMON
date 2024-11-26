import bs58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import {
  getConfig,
  getConnection,
  getConnectionByChainType,
  getEndpointByChainType,
  getSonicConnection,
  wait,
} from "./common";
import { ChainType, MerkleTree, Wallet } from "./type";
import { uploadJson } from "./jsonbin";

// Mint a new NFT to a collection
// @param wallet: { secretKey: number[] }
// @param merkleTreeInfo: { publicKey: string, secretKey: number[] }
// @param collectionPublicKey: string
// @param collectionOwnerSecretKey: number[]
export const mintToCollection = async (
  wallet: Wallet,
  merkleTreeInfo: MerkleTree,
  collectionPublicKey: string,
  collectionOwnerSecretKey: number[],
  name: string,
  assertUrl: string,
  attributes: Record<string, string> = {},
  chainType: ChainType = "solana"
) => {
  // Generate and upload JSON metadata
  const jsonUrl = await uploadJson(name, name, assertUrl, attributes);
  const config = getConfig();

  const connection = getConnectionByChainType(chainType);

  const umi = createUmi(getEndpointByChainType(config, chainType));

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));
  const merkleTree = publicKey(merkleTreeInfo.publicKey);

  const collectionMint = publicKey(collectionPublicKey);

  const ownerKeyPair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(collectionOwnerSecretKey)
  );
  const collectionUpdateAuthority = createSignerFromKeypair(umi, ownerKeyPair);

  const transactionBuilder = await mintToCollectionV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    collectionMint,
    collectionAuthority: collectionUpdateAuthority,
    metadata: {
      name: name,
      uri: jsonUrl,
      sellerFeeBasisPoints: 500, // 5%
      collection: { key: collectionMint, verified: true },
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 },
      ],
    },
  });

  const totalNumberOfRetries = 10;
  let landed = false;
  for (let i = 0; i < totalNumberOfRetries; i++) {
    // Send the transaction without retry
    const transactionSignature = await transactionBuilder.send(umi, {
      skipPreflight: true,
      maxRetries: 0,
    });

    await wait(5000);

    // Check signature status
    const sigStatus = await connection.getSignatureStatus(
      bs58.encode(transactionSignature)
    );

    console.log(
      "sigStatus and signature",
      sigStatus.value?.confirmationStatus,
      sigStatus.context.slot,
      bs58.encode(transactionSignature)
    );
    if (sigStatus.value?.confirmationStatus === "confirmed") {
      console.log("landed");
      console.log("Signature", bs58.encode(transactionSignature));
      console.log("status", sigStatus);
      landed = true;
      break;
    }

    await wait(2000);
  }

  if (!landed) {
    throw new Error("Transaction not landed, retry again");
  }

  console.log("payer =>", payerKeypair.publicKey.toString());
  console.log("leafOwner =>", payerKeypair.publicKey.toString());
  console.log("merkleTree =>", merkleTree);
  console.log("collectionMint =>", collectionMint.toString());
};
