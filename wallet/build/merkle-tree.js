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
exports.createMerkleTree = exports.getMerkeTree = void 0;
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_bubblegum_1 = require("@metaplex-foundation/mpl-bubblegum");
const common_1 = require("./common");
const storage_1 = require("./storage");
const MERKLE_TREE_PUBLIC_KEY = "merkleTreePublicKey";
const MERKLE_TREE_SECRET_KEY = "merkleTreeSecretKey";
// Get Merkle tree
// @return {
//   publicKey: string,
//   secretKey: number[],
// } | null
const getMerkeTree = () => __awaiter(void 0, void 0, void 0, function* () {
    const publicKey = yield (0, storage_1.loadData)(MERKLE_TREE_PUBLIC_KEY);
    const secretKey = yield (0, storage_1.loadData)(MERKLE_TREE_SECRET_KEY);
    if (!publicKey || !secretKey) {
        return null;
    }
    return {
        publicKey,
        secretKey,
    };
});
exports.getMerkeTree = getMerkeTree;
// Create a new Merkle tree
// @param wallet: {
//   publicKey: string,
//   secretKey: number[],
// } - Payer wallet information
// @return {
//   publicKey: string,
//   secretKey: string,
// }
const createMerkleTree = (wallet) => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, common_1.getConfig)();
    const umi = (0, umi_bundle_defaults_1.createUmi)(config.endpoint);
    const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
    const payerKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
    umi.use((0, umi_1.keypairIdentity)(payerKeypair));
    const merkleTree = (0, umi_1.generateSigner)(umi);
    const builder = yield (0, mpl_bubblegum_1.createTree)(umi, {
        merkleTree,
        // maxDepth: 3,
        // maxBufferSize: 8,
        maxDepth: 14,
        maxBufferSize: 64,
    });
    yield builder.sendAndConfirm(umi);
    const publicKey = merkleTree.publicKey.toString();
    const secretKey = Array.from(merkleTree.secretKey);
    yield (0, storage_1.saveData)(MERKLE_TREE_PUBLIC_KEY, publicKey);
    yield (0, storage_1.saveData)(MERKLE_TREE_SECRET_KEY, secretKey);
    return {
        publicKey,
        secretKey,
    };
});
exports.createMerkleTree = createMerkleTree;
