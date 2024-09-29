import { getUserWallet, createUserWallet } from "./wallet.js";
import { getOrCreateMerkleTree } from "./merkle-tree.js";
import { createCollection } from "./collection.js";
import { mintToCollection } from "./nft.js";
import { getConfig } from "./common.js";

let wallet = await getUserWallet();
const config = getConfig();

if (!wallet) {
  console.log("No wallet found, creating a new one...");
  wallet = await createUserWallet();
}
const merkleTree = await getOrCreateMerkleTree(wallet);

const collectionOwnerInfo = {
  secretKey: config.masterPayerSecretKey,
  publicKey: "",
};

// Create collection
const collection = await createCollection(
  collectionOwnerInfo,
  "Monster collection"
);
console.log(collection);

// await mintWithoutCollection(wallet, merkleTree);
await mintToCollection(wallet, merkleTree, collection, collectionOwnerInfo);
