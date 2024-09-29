import { Connection } from "@solana/web3.js";

let _connection = null;

export const getConfig = () => {
  return {
    endpoint: "https://api.devnet.solana.com", // Replace by test nest when demonstrating
    isDemo: false,
    collectionPublicKey: "TBD",
    nftStorageApiKey: "f3463a4d.5dad3c2efd6b47b08b5b73ad6920aa7c",
    masterPayerSecretKey: [
      42, 10, 22, 97, 116, 115, 107, 57, 226, 247, 40, 179, 216, 11, 216, 9,
      110, 233, 110, 240, 85, 78, 144, 173, 253, 79, 75, 12, 175, 216, 43, 214,
      245, 164, 74, 111, 54, 131, 150, 17, 113, 31, 4, 20, 159, 81, 221, 64,
      109, 212, 188, 82, 203, 134, 242, 13, 210, 177, 22, 8, 166, 44, 126, 233,
    ],
    commonCollectionPublicKey: "CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx",
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
