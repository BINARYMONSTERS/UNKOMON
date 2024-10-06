"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSonicConnection = exports.isBrowser = exports.getConnection = exports.getConfig = void 0;
const web3_js_1 = require("@solana/web3.js");
const getConfig = () => {
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
        sonicEndpoint: process.env.SONIC_ENDPOINT || "https://devnet.sonic.game",
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
exports.getConfig = getConfig;
let _connection = null;
const getConnection = () => {
    if (_connection) {
        return _connection;
    }
    const config = (0, exports.getConfig)();
    _connection = new web3_js_1.Connection(config.endpoint, "confirmed");
    return _connection;
};
exports.getConnection = getConnection;
const isBrowser = () => {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
};
exports.isBrowser = isBrowser;
let _sonicConnection = null;
const getSonicConnection = () => {
    if (_sonicConnection) {
        return _sonicConnection;
    }
    const config = (0, exports.getConfig)();
    _sonicConnection = new web3_js_1.Connection(config.sonicEndpoint, "confirmed");
    return _sonicConnection;
};
exports.getSonicConnection = getSonicConnection;
