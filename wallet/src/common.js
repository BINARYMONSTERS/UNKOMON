import { publicKey } from "@metaplex-foundation/umi/serializers";
import { Connection } from "@solana/web3.js";

let _connection = null;

export const getConfig = () => {
  return {
    endpoint: "https://api.devnet.solana.com", // Replace by test nest when demonstrating
    isDemo: false,
    nftStorageApiKey: "f3463a4d.5dad3c2efd6b47b08b5b73ad6920aa7c",
    masterWallet: {
      publicKey: "ARAUZUHBikSY8dNGEVhRPS6u6pyykvbgyvQK2Vy285Td",
      secretKey: [
        148, 28, 181, 81, 199, 152, 239, 39, 208, 8, 196, 151, 130, 203, 184,
        93, 224, 155, 84, 198, 99, 191, 131, 19, 29, 170, 93, 45, 192, 251, 198,
        217, 139, 233, 213, 218, 94, 242, 220, 14, 213, 244, 64, 9, 33, 172, 63,
        2, 247, 213, 65, 222, 100, 157, 108, 207, 225, 248, 107, 115, 5, 119,
        191, 64,
      ],
    },
    monsterCollection: {
      publicKey: "8hmmwAjMC1hiePf3T4P9z4ETEcgaNsCB4WEVbuE1N8ra",
      secretKey: [
        22, 5, 1, 4, 158, 7, 118, 117, 201, 51, 210, 135, 142, 94, 169, 49, 222,
        186, 34, 182, 171, 56, 179, 230, 237, 70, 235, 141, 157, 6, 55, 174,
        114, 115, 170, 244, 39, 251, 11, 137, 55, 245, 65, 203, 121, 36, 22,
        214, 1, 161, 246, 31, 56, 60, 169, 45, 85, 212, 130, 162, 208, 78, 105,
        159,
      ],
      tokenAddress: "8hmmwAjMC1hiePf3T4P9z4ETEcgaNsCB4WEVbuE1N8ra",
    },
    stoolCollection: {
      publicKey: "58cXHKskKBDLneAtM38cs8baA52MPL3ZqdvMS4wG7sqd",
      secretKey: [
        100, 157, 90, 104, 226, 82, 42, 124, 152, 214, 57, 118, 150, 244, 237,
        47, 199, 30, 37, 95, 235, 219, 141, 7, 148, 240, 51, 10, 90, 235, 45,
        79, 61, 97, 250, 115, 198, 60, 242, 97, 175, 179, 138, 189, 232, 222,
        26, 59, 244, 43, 177, 57, 120, 211, 17, 181, 6, 142, 244, 95, 41, 116,
        107, 236,
      ],
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
