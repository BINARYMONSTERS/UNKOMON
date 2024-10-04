"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getUserWallet = getUserWallet;
exports.createUserWallet = createUserWallet;
exports.mintMonsterNft = mintMonsterNft;
exports.mintStoolData = mintStoolData;
const dotenv = __importStar(require("dotenv"));
// Read environment variables from .env file
dotenv.config();
const wallet_1 = require("./wallet");
const merkle_tree_1 = require("./merkle-tree");
const nft_1 = require("./nft");
const common_1 = require("./common");
const error_1 = require("./error");
// Get user wallet information
// @return {
//  publicKey: string,
//  secretKey: number[],
//  sol: number, - SOL balance
// }
function getUserWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, wallet_1.getUserWallet)();
    });
}
// Create a new user wallet
// @return {
//  publicKey: string,
//  secretKey: number[],
//  sol: number, - SOL balance
// }
function createUserWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield (0, wallet_1.createUserWallet)();
        if (wallet.sol > 0) {
            yield (0, merkle_tree_1.createMerkleTree)(wallet);
        }
        return wallet;
    });
}
// Mint a new monster as a NFT to a collection
// @param name: string - Name of the monster
// @param imageUrl: string - Image URL of the monster
// @param attributes: { [key: string]: string } - Attributes of the monster
function mintMonsterNft(name, imageUrl, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, common_1.getConfig)();
        const wallet = yield getUserWallet();
        if (!wallet) {
            throw new error_1.WalletNotFoundError("Wallet not found");
        }
        const balance = yield (0, wallet_1.getBalance)(wallet.secretKey);
        if (balance === 0) {
            throw new error_1.BalanceNotEnoughError("Balance is not enough to mint NFT");
        }
        let merkleTree = yield (0, merkle_tree_1.getMerkeTree)();
        if (!merkleTree) {
            merkleTree = yield (0, merkle_tree_1.createMerkleTree)(wallet);
        }
        let retries = 0;
        while (retries < 3) {
            try {
                yield (0, nft_1.mintToCollection)(wallet, merkleTree, config.monsterCollection.tokenAddress, config.masterWallet.secretKey, name, imageUrl, attributes);
                break;
            }
            catch (error) {
                console.error("Error minting NFT:", error);
                retries++;
            }
        }
    });
}
// Mint a new stool data as a NFT to a collection
// @param name: string - Name of the stool data
// @param imageUrl: string - Image URL of the stool data
// @param attributes: { [key: string]: string } - Attributes of the stool data
function mintStoolData(name, imageUrl, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, common_1.getConfig)();
        const wallet = yield getUserWallet();
        if (!wallet) {
            throw new error_1.WalletNotFoundError("Wallet not found");
        }
        const balance = yield (0, wallet_1.getBalance)(wallet.secretKey);
        if (balance === 0) {
            throw new error_1.BalanceNotEnoughError("Balance is not enough to mint NFT");
        }
        let merkleTree = yield (0, merkle_tree_1.getMerkeTree)();
        if (!merkleTree) {
            merkleTree = yield (0, merkle_tree_1.createMerkleTree)(wallet);
        }
        let retries = 0;
        while (retries < 3) {
            try {
                yield (0, nft_1.mintToCollection)(wallet, merkleTree, config.stoolCollection.tokenAddress, config.masterWallet.secretKey, name, imageUrl, attributes);
                break;
            }
            catch (error) {
                console.error("Error minting NFT:", error);
                retries++;
            }
        }
    });
}
