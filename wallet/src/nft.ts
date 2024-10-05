import bs58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { mintToCollectionV1 } from "@metaplex-foundation/mpl-bubblegum";
import { getConfig } from "./common";
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

  const umi = createUmi(
    chainType === "solana" ? config.endpoint : config.sonicEndpoint
  );

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

  const mintResult = await mintToCollectionV1(umi, {
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
  }).sendAndConfirm(umi);

  console.log("payer =>", payerKeypair.publicKey.toString());
  console.log("leafOwner =>", payerKeypair.publicKey.toString());
  console.log("merkleTree =>", merkleTree);
  console.log("collectionMint =>", collectionMint.toString());
  console.log("signature =>", bs58.encode(mintResult.signature));
  console.log("result =>", mintResult.result);
};
