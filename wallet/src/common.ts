import { Connection } from "@solana/web3.js";

export const getConfig = () => {
  const masterWalletSecretKey = process.env.MASTER_WALLET_SECRET_KEY;
  if (!masterWalletSecretKey) {
    throw new Error("MASTER_WALLET_SECRET_KEY is not set");
  }

  const jsonbinAccessKey = process.env.JSON_BIN_ACCESS_KEY;
  if (!jsonbinAccessKey) {
    throw new Error("JSONBIN_ACCESS_KEY is not set");
  }

  const jsonbinMasterKey = process.env.JSON_BIN_MASTER_KEY;
  if (!jsonbinMasterKey) {
    throw new Error("JSONBIN_MASTER_KEY is not set");
  }

  const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;
  if (!nftStorageApiKey) {
    throw new Error("NFT_STORAGE_API_KEY is not set");
  }

  return {
    endpoint: process.env.SOLANA_ENDPOINT || "https://api.devnet.solana.com",
    sonicEndpoint: process.env.SONIC_ENDPOINT || "https://devnet.sonic.game",
    isDemo: true,
    nftStorageApiKey: nftStorageApiKey,
    jsonbinAccessKey: jsonbinAccessKey,
    jsonBinMasterKey: jsonbinMasterKey,
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
    sonicMonsterCollection: {
      tokenAddress: "CC9VnjtQypuKqpZdBxhKjH6snXWYXiDC6NgHrVuYvi18",
    },
    sonicStoolCollection: {
      tokenAddress: "B18WghpuwyQxVAbhXJ8gNyGt7ftiGDMfbodXN5VsxyYq",
    },
  };
};

let _connection: Connection | null = null;
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

let _sonicConnection: Connection | null = null;
export const getSonicConnection = () => {
  if (_sonicConnection) {
    return _sonicConnection;
  }
  const config = getConfig();
  _sonicConnection = new Connection(config.sonicEndpoint, "confirmed");
  return _sonicConnection;
};

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
