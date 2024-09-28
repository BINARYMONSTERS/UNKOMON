import { Connection } from "@solana/web3.js";

let _connection = null;

export const getConfig = () => {
  return {
    endpoint: "https://api.devnet.solana.com", // Replace by test nest when demonstrating
    isDemo: false,
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
