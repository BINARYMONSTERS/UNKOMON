export type Wallet = {
  publicKey: string;
  secretKey: number[];
  sol: number;
  sonic: number;
};

export type MerkleTree = {
  publicKey: string;
  secretKey: number[];
};

export type Collection = {
  publicKey: string;
  secretKey: number[];
};

export type ChainType = "solana" | "sonic";
