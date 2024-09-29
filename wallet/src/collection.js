import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { saveData, loadData } from "./storage.js";
import { getConfig } from "./common.js";

const COLLECTION_PUBLIC_KEY = "collectionPublicKey";
const COLLECTION_SECRET_KEY = "collectionSecretKey";

// Create a new collection
// @param name: string - Collection name
// @return {
//   publicKey: string,
//   secretKey: string,
// }
export const createCollection = async (wallet, name) => {
  // Load collection info from storage
  let publicKey = await loadData(COLLECTION_PUBLIC_KEY);
  let secretKey = await loadData(COLLECTION_SECRET_KEY);
  if (publicKey && secretKey) {
    return {
      publicKey,
      secretKey,
    };
  }

  const config = getConfig();
  const umi = createUmi(config.endpoint);

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  umi.use(mplTokenMetadata());
  const collectionUpdateAuthority = createSignerFromKeypair(umi, payerKeypair);

  const collectionMint = generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: name,
    uri: "https://example.com/my-collection.json",
    sellerFeeBasisPoints: percentAmount(5), // 5%
    isCollection: true,
  }).sendAndConfirm(umi);

  const collectionPublicKey = collectionMint.publicKey.toString();
  const collectionSecretKey = Array.from(collectionMint.secretKey);

  await saveData(COLLECTION_PUBLIC_KEY, collectionPublicKey);
  await saveData(COLLECTION_SECRET_KEY, collectionSecretKey);

  return {
    publicKey: collectionPublicKey,
    secretKey: collectionSecretKey,
  };
};
