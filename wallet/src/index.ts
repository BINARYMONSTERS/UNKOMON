import * as dotenv from "dotenv";
// Read environment variables from .env file
dotenv.config();

import {
  getUserWallet as getUserWalletInternal,
  createUserWallet as createUserWalletInternal,
  getBalance as getBalanceInternal,
} from "./wallet";
import { getMerkeTree, createMerkleTree } from "./merkle-tree";
import { mintToCollection } from "./nft";
import { getConfig } from "./common";
import { BalanceNotEnoughError, WalletNotFoundError } from "./error";

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
export async function mintMonsterNft(
  name: string,
  imageUrl: string,
  attributes: Record<string, string>
) {
  const config = getConfig();
  const wallet = await getUserWallet();
  if (!wallet) {
    throw new WalletNotFoundError("Wallet not found");
  }

  const balance = await getBalanceInternal(wallet.secretKey);
  if (balance === 0) {
    throw new BalanceNotEnoughError("Balance is not enough to mint NFT");
  }

  let merkleTree = await getMerkeTree();
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
export async function mintStoolData(
  name: string,
  imageUrl: string,
  attributes: Record<string, string>
) {
  const config = getConfig();
  const wallet = await getUserWallet();

  if (!wallet) {
    throw new WalletNotFoundError("Wallet not found");
  }

  const balance = await getBalanceInternal(wallet.secretKey);
  if (balance === 0) {
    throw new BalanceNotEnoughError("Balance is not enough to mint NFT");
  }

  let merkleTree = await getMerkeTree();
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
