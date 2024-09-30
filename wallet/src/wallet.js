import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getConfig, getConnection } from "./common.js";
import { saveData, loadData } from "./storage.js";

const WALLET_PUBLIC_KEY = "walletPublicKey";
const WALLET_SECRET_KEY = "walletSecretKey";

// Get balance of the wallet
// @param secretKey: number[]
// @return number
export const getBalance = async (srcSecretKey) => {
  const connection = getConnection();
  const secretKey = new Uint8Array(srcSecretKey);
  const myWallet = await Keypair.fromSecretKey(secretKey);
  const walletBalance = await connection.getBalance(
    new PublicKey(myWallet.publicKey)
  );

  return walletBalance / LAMPORTS_PER_SOL;
};

// Add fund to the wallet
// @param secretKey: number[]
export const addFundToWallet = async (srcSecretKey, numberOfSol = 5) => {
  // Airdrop SOL to the wallet
  console.log("Airdrop SOL to the wallet...");

  const secretKey = new Uint8Array(srcSecretKey);
  const connection = getConnection();
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
export const createUserWallet = async () => {
  const config = getConfig();
  const keypair = Keypair.generate();
  const wallet = {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Array.from(keypair.secretKey),
  };

  // Save wallet to storage
  await saveData(WALLET_PUBLIC_KEY, wallet.publicKey);
  await saveData(WALLET_SECRET_KEY, wallet.secretKey);

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
export const getUserWallet = async () => {
  // Check if the wallet is already created
  const publicKey = await loadData(WALLET_PUBLIC_KEY);
  let secretKey = await loadData(WALLET_SECRET_KEY);
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

export const createMasterWallet = async () => {
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
