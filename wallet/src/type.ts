export type Wallet = {
  publicKey: string;
  secretKey: number[];
  sol: number;
  sonic: number;
  soon: number;
};

export type MerkleTree = {
  publicKey: string;
  secretKey: number[];
};

export type Collection = {
  publicKey: string;
  secretKey: number[];
};

export type ChainType = "solana" | "sonic" | "soon";

export type CollectionConfig = {
  tokenAddress: string;
};

export type Config = {
  endpoint: string;
  sonicEndpoint: string;
  soonEndpoint: string;
  isDemo: boolean;
  nftStorageApiKey: string;
  jsonbinAccessKey: string;
  jsonBinMasterKey: string;
  masterWallet: {
    publicKey: string;
    secretKey: number[];
    sol: number;
    sonic: number;
    soon: number;
  };
  monsterCollection: CollectionConfig;
  stoolCollection: CollectionConfig;
  sonicMonsterCollection: CollectionConfig;
  sonicStoolCollection: CollectionConfig;
  soonMonsterCollection: CollectionConfig;
  soonStoolCollection: CollectionConfig;
};
