import {
  getUserWallet as getUserWalletInternal,
  createUserWallet as createUserWalletInternal,
} from "./wallet.js";
import { getOrCreateMerkleTree } from "./merkle-tree.js";
import { mintToCollection } from "./nft.js";
import { getConfig } from "./common.js";

// Get user wallet information
// @return {
//  publicKey: string,
//  secretKey: number[],
//  sol: number, - SOL balance
// }
export async function getUserWallet() {
  return getUserWalletInternal();
}

// Create a new user wallet
// @return {
//  publicKey: string,
//  secretKey: number[],
//  sol: number, - SOL balance
// }
export async function createUserWallet() {
  return createUserWalletInternal();
}

// Mint a new monster as a NFT to a collection
// @param name: string - Name of the monster
// @param imageUrl: string - Image URL of the monster
// @param attributes: { [key: string]: string } - Attributes of the monster
export async function mintMonsterNft(name, imageUrl, attributes) {
  const config = getConfig();
  const wallet = await getUserWallet();
  const merkleTree = await getOrCreateMerkleTree(wallet);
  await mintToCollection(
    wallet,
    merkleTree,
    config.monsterCollection.tokenAddress,
    config.masterWallet.secretKey,
    name,
    imageUrl,
    attributes
  );
}

// Mint a new stool data as a NFT to a collection
// @param name: string - Name of the stool data
// @param imageUrl: string - Image URL of the stool data
// @param attributes: { [key: string]: string } - Attributes of the stool data
export async function mintStoolData(name, imageUrl, attributes) {
  const config = getConfig();
  const wallet = await getUserWallet();
  const merkleTree = await getOrCreateMerkleTree(wallet);
  await mintToCollection(
    wallet,
    merkleTree,
    config.stoolCollection.tokenAddress,
    config.masterWallet.secretKey,
    name,
    imageUrl,
    attributes
  );
}

const main = async () => {
  let wallet = await getUserWallet();
  if (!wallet) {
    wallet = await createUserWallet();
  }

  await mintMonsterNft("Monster 1", "https://example.com/monster1.png", {
    type: "Fire",
    level: "1",
  });
};

export function helloWorld() {
  console.log("Hello, World!");
}

console.log("File loaded");

// main();
