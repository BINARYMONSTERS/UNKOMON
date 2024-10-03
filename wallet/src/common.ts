import { Connection } from "@solana/web3.js";

let _connection: Connection | null = null;

export const getConfig = () => {
  const masterWalletSecretKey = process.env.MASTER_WALLET_SECRET_KEY;
  if (!masterWalletSecretKey) {
    throw new Error("MASTER_WALLET_SECRET_KEY is not set");
  }

  const jsonbinAccessKey = process.env.JSON_BIN_ACCESS_KEY;
  if (!jsonbinAccessKey) {
    throw new Error("JSONBIN_ACCESS_KEY is not set");
  }

  const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;
  if (!nftStorageApiKey) {
    throw new Error("NFT_STORAGE_API_KEY is not set");
  }

  return {
    endpoint: process.env.SOLANA_ENDPOINT || "https://api.devnet.solana.com",
    sonicEndpoint:
      process.env.SONIC_ENDPOINT || "https://rpc.testnet.soniclabs.com/",
    isDemo: true,
    nftStorageApiKey: nftStorageApiKey,
    jsonbinAccessKey: jsonbinAccessKey,
    masterWallet: {
      publicKey: "ARAUZUHBikSY8dNGEVhRPS6u6pyykvbgyvQK2Vy285Td",
      secretKey: JSON.parse(masterWalletSecretKey),
      sol: 5,
    },
    monsterCollection: {
      tokenAddress: "8hmmwAjMC1hiePf3T4P9z4ETEcgaNsCB4WEVbuE1N8ra",
    },
    stoolCollection: {
      tokenAddress: "58cXHKskKBDLneAtM38cs8baA52MPL3ZqdvMS4wG7sqd",
    },
  };
};

export const getConnection = () => {
  if (_connection) {
    return _connection;
  }
  const config = getConfig();
  _connection = new Connection(config.endpoint, "confirmed");
  return _connection;
};

export const isBrowser = () => {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
};
