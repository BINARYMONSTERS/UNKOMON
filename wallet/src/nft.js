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

export const mintToCollection = async (
  wallet,
  merkleTreeInfo,
  collectionInfo,
  collectionOwnerInfo
) => {
  const config = getConfig();

  const umi = createUmi(config.endpoint);

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));
  const merkleTree = publicKey(merkleTreeInfo.publicKey);

  const collectionMint = publicKey(collectionInfo.publicKey);

  const ownerKeyPair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(collectionOwnerInfo.secretKey)
  );
  const collectionUpdateAuthority = createSignerFromKeypair(umi, ownerKeyPair);

  const mintResult = await mintToCollectionV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    collectionMint,
    collectionAuthority: collectionUpdateAuthority,
    metadata: {
      name: "cNFT in a Collection",
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

export const mintWithoutCollection = async (wallet, merkleTreeInfo) => {
  const config = getConfig();

  const umi = createUmi(config.endpoint);

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));
  const merkleTree = publicKey(merkleTreeInfo.publicKey);

  const result = await mintV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    metadata: {
      name: "cNFT w/o Collection #2",
      uri: "https://arweave.net/fuyXdgQul3e-0COSO2XUgTv9JbUIDvF-as86TWHtlgM",
      sellerFeeBasisPoints: 500, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 },
      ],
    },
  }).sendAndConfirm(umi);

  console.log("payer =>", payerKeypair.publicKey.toString());
  console.log("leafOwner =>", payerKeypair.publicKey.toString());
  console.log("merkleTree =>", merkleTree);
  console.log("signature =>", bs58.encode(result.signature));
};
