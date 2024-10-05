import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getConfig, getConnection, getSonicConnection } from "./common";
import { saveData, loadData } from "./storage";
import { ChainType, Wallet } from "./type";

const solanaUserWalletCacheKeys = {
  public: "walletPublicKey",
  secret: "walletSecretKey",
};

const sonicUserWalletCacheKeys = {
  public: "sonicWalletPublicKey",
  secret: "sonicWalletSecretKey",
};

// Get balance of the wallet
// @param secretKey: number[]
// @return number
export const getBalance = async (
  srcSecretKey: number[],
  chainType: ChainType = "solana"
) => {
  const connection =
    chainType === "solana" ? getConnection() : getSonicConnection();
  const secretKey = new Uint8Array(srcSecretKey);
  const myWallet = await Keypair.fromSecretKey(secretKey);
  const walletBalance = await connection.getBalance(
    new PublicKey(myWallet.publicKey)
  );

  return walletBalance / LAMPORTS_PER_SOL;
};

// Add fund to the wallet
// @param secretKey: number[]
export const addFundToWallet = async (
  srcSecretKey: number[],
  numberOfSol: number = 5,
  chainType: ChainType = "solana"
) => {
  // Airdrop SOL to the wallet
  console.log("Airdrop SOL to the wallet...");

  const secretKey = new Uint8Array(srcSecretKey);
  const connection =
    chainType === "solana" ? getConnection() : getSonicConnection();
  const myWallet = await Keypair.fromSecretKey(secretKey);

  const fromAirDropSignature = await connection.requestAirdrop(
    new PublicKey(myWallet.publicKey),
    numberOfSol * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(fromAirDropSignature);

  const walletBalance = await getBalance(srcSecretKey);

  console.log(`Wallet balance: ${walletBalance}`);
};

// Create a new user wallet
// @return {
//   publicKey: string,
//   secretKey: number[],
//   sol: number,
// }
export const createUserWallet = async (
  chainType: ChainType = "solana"
): Promise<Wallet> => {
  const config = getConfig();
  const keypair = Keypair.generate();
  const wallet = {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Array.from(keypair.secretKey),
  };

  // Save wallet to storage
  await saveData(getUserWalletCacheKeys(chainType).public, wallet.publicKey);
  await saveData(getUserWalletCacheKeys(chainType).secret, wallet.secretKey);

  if (!config.isDemo) {
    // Add fund to the wallet if it's not a demo
    await addFundToWallet(wallet.secretKey);
  }

  // Get balance of the wallet
  const balance = await getBalance(wallet.secretKey);

  return {
    ...wallet,
    sol: balance / LAMPORTS_PER_SOL,
  };
};

// Get wallet from storage
// @return {
//   publicKey: string,
//   secretKey: number[],
//   sol: number,
// } | null
export const getUserWallet = async (
  chainType: ChainType = "solana"
): Promise<Wallet | null> => {
  // Check if the wallet is already created
  const publicKey = await loadData(getUserWalletCacheKeys(chainType).public);
  let secretKey = await loadData(getUserWalletCacheKeys(chainType).secret);
  if (!publicKey || !secretKey) {
    return null;
  }

  const wallet = {
    publicKey,
    secretKey,
  };

  // Get balance of the wallet
  const balance = await getBalance(wallet.secretKey);

  return {
    ...wallet,
    sol: balance,
  };
};

export const createMasterWallet = async (): Promise<Wallet> => {
  const keypair = Keypair.generate();
  const wallet = {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Array.from(keypair.secretKey),
  };

  await addFundToWallet(wallet.secretKey);

  // Get balance of the wallet
  const balance = await getBalance(wallet.secretKey);

  return {
    ...wallet,
    sol: balance,
  };
};

const getUserWalletCacheKeys = (chainType: ChainType) => {
  return chainType === "solana"
    ? solanaUserWalletCacheKeys
    : sonicUserWalletCacheKeys;
};
