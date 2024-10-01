"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMasterWallet = exports.getUserWallet = exports.createUserWallet = exports.addFundToWallet = exports.getBalance = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("./common");
const storage_1 = require("./storage");
const WALLET_PUBLIC_KEY = "walletPublicKey";
const WALLET_SECRET_KEY = "walletSecretKey";
// Get balance of the wallet
// @param secretKey: number[]
// @return number
const getBalance = (srcSecretKey) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = (0, common_1.getConnection)();
    const secretKey = new Uint8Array(srcSecretKey);
    const myWallet = yield web3_js_1.Keypair.fromSecretKey(secretKey);
    const walletBalance = yield connection.getBalance(new web3_js_1.PublicKey(myWallet.publicKey));
    return walletBalance / web3_js_1.LAMPORTS_PER_SOL;
});
exports.getBalance = getBalance;
// Add fund to the wallet
// @param secretKey: number[]
const addFundToWallet = (srcSecretKey_1, ...args_1) => __awaiter(void 0, [srcSecretKey_1, ...args_1], void 0, function* (srcSecretKey, numberOfSol = 5) {
    // Airdrop SOL to the wallet
    console.log("Airdrop SOL to the wallet...");
    const secretKey = new Uint8Array(srcSecretKey);
    const connection = (0, common_1.getConnection)();
    const myWallet = yield web3_js_1.Keypair.fromSecretKey(secretKey);
    const fromAirDropSignature = yield connection.requestAirdrop(new web3_js_1.PublicKey(myWallet.publicKey), numberOfSol * web3_js_1.LAMPORTS_PER_SOL);
    yield connection.confirmTransaction(fromAirDropSignature);
    const walletBalance = yield (0, exports.getBalance)(srcSecretKey);
    console.log(`Wallet balance: ${walletBalance}`);
});
exports.addFundToWallet = addFundToWallet;
// Create a new user wallet
// @return {
//   publicKey: string,
//   secretKey: number[],
//   sol: number,
// }
const createUserWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, common_1.getConfig)();
    const keypair = web3_js_1.Keypair.generate();
    const wallet = {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: Array.from(keypair.secretKey),
    };
    // Save wallet to storage
    yield (0, storage_1.saveData)(WALLET_PUBLIC_KEY, wallet.publicKey);
    yield (0, storage_1.saveData)(WALLET_SECRET_KEY, wallet.secretKey);
    if (!config.isDemo) {
        // Add fund to the wallet if it's not a demo
        yield (0, exports.addFundToWallet)(wallet.secretKey);
    }
    // Get balance of the wallet
    const balance = yield (0, exports.getBalance)(wallet.secretKey);
    return Object.assign(Object.assign({}, wallet), { sol: balance / web3_js_1.LAMPORTS_PER_SOL });
});
exports.createUserWallet = createUserWallet;
// Get wallet from storage
// @return {
//   publicKey: string,
//   secretKey: number[],
//   sol: number,
// } | null
const getUserWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the wallet is already created
    const publicKey = yield (0, storage_1.loadData)(WALLET_PUBLIC_KEY);
    let secretKey = yield (0, storage_1.loadData)(WALLET_SECRET_KEY);
    if (!publicKey || !secretKey) {
        return null;
    }
    const wallet = {
        publicKey,
        secretKey,
    };
    // Get balance of the wallet
    const balance = yield (0, exports.getBalance)(wallet.secretKey);
    return Object.assign(Object.assign({}, wallet), { sol: balance });
});
exports.getUserWallet = getUserWallet;
const createMasterWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const keypair = web3_js_1.Keypair.generate();
    const wallet = {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: Array.from(keypair.secretKey),
    };
    yield (0, exports.addFundToWallet)(wallet.secretKey);
    // Get balance of the wallet
    const balance = yield (0, exports.getBalance)(wallet.secretKey);
    return Object.assign(Object.assign({}, wallet), { sol: balance });
});
exports.createMasterWallet = createMasterWallet;
