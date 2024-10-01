import {
  getUserWallet as getUserWalletInternal,
  createUserWallet as createUserWalletInternal,
  getBalance as getBalanceInternal,
} from "./wallet.js";
import { getMerkeTree, createMerkleTree } from "./merkle-tree.js";
import { mintToCollection } from "./nft.js";
import { getConfig } from "./common.js";

export class BalanceNotEnoughError extends Error {
  constructor(message) {
    super(message);
    this.name = "BalanceNotEnoughError";
  }
}

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
  const wallet = await createUserWalletInternal();
  if (wallet.sol > 0) {
    await createMerkleTree(wallet);
  }
  return wallet;
}

// Mint a new monster as a NFT to a collection
// @param name: string - Name of the monster
// @param imageUrl: string - Image URL of the monster
// @param attributes: { [key: string]: string } - Attributes of the monster
export async function mintMonsterNft(name, imageUrl, attributes) {
  const config = getConfig();
  const wallet = await getUserWallet();

  const balance = await getBalanceInternal(wallet.secretKey);
  if (balance === 0) {
    throw new BalanceNotEnoughError("Balance is not enough to mint NFT");
  }

  let merkleTree = await getMerkeTree(wallet);
  if (!merkleTree) {
    merkleTree = await createMerkleTree(wallet);
  }

  let retries = 0;
  while (retries < 3) {
    try {
      await mintToCollection(
        wallet,
        merkleTree,
        config.monsterCollection.tokenAddress,
        config.masterWallet.secretKey,
        name,
        imageUrl,
        attributes
      );
      break;
    } catch (error) {
      console.error("Error minting NFT:", error);
      retries++;
    }
  }
}

// Mint a new stool data as a NFT to a collection
// @param name: string - Name of the stool data
// @param imageUrl: string - Image URL of the stool data
// @param attributes: { [key: string]: string } - Attributes of the stool data
export async function mintStoolData(name, imageUrl, attributes) {
  const config = getConfig();
  const wallet = await getUserWallet();

  const balance = await getBalanceInternal(wallet.secretKey);
  if (balance === 0) {
    throw new BalanceNotEnoughError("Balance is not enough to mint NFT");
  }

  let merkleTree = await getMerkeTree(wallet);
  if (!merkleTree) {
    merkleTree = await createMerkleTree(wallet);
  }

  let retries = 0;

  while (retries < 3) {
    try {
      await mintToCollection(
        wallet,
        merkleTree,
        config.stoolCollection.tokenAddress,
        config.masterWallet.secretKey,
        name,
        imageUrl,
        attributes
      );
      break;
    } catch (error) {
      console.error("Error minting NFT:", error);
      retries++;
    }
  }
}
