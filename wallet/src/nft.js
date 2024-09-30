import bs58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
  none,
  percentAmount,
} from "@metaplex-foundation/umi";
import { mintToCollectionV1, mintV1 } from "@metaplex-foundation/mpl-bubblegum";

import { getConfig } from "./common.js";

// Mint a new NFT to a collection
// @param wallet: { secretKey: number[] }
// @param merkleTreeInfo: { publicKey: string, secretKey: number[] }
// @param collectionPublicKey: string
// @param collectionOwnerSecretKey: number[]
export const mintToCollection = async (
  wallet,
  merkleTreeInfo,
  collectionPublicKey,
  collectionOwnerSecretKey,
  name,
  assertUrl,
  attributes
) => {
  const config = getConfig();

  const umi = createUmi(config.endpoint);

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
      uri: "https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma",
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
