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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintToCollection = void 0;
const bs58_1 = __importDefault(require("bs58"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_bubblegum_1 = require("@metaplex-foundation/mpl-bubblegum");
const common_1 = require("./common");
const jsonbin_1 = require("./jsonbin");
// Mint a new NFT to a collection
// @param wallet: { secretKey: number[] }
// @param merkleTreeInfo: { publicKey: string, secretKey: number[] }
// @param collectionPublicKey: string
// @param collectionOwnerSecretKey: number[]
const mintToCollection = (wallet_1, merkleTreeInfo_1, collectionPublicKey_1, collectionOwnerSecretKey_1, name_1, assertUrl_1, ...args_1) => __awaiter(void 0, [wallet_1, merkleTreeInfo_1, collectionPublicKey_1, collectionOwnerSecretKey_1, name_1, assertUrl_1, ...args_1], void 0, function* (wallet, merkleTreeInfo, collectionPublicKey, collectionOwnerSecretKey, name, assertUrl, attributes = {}) {
    // Generate and upload JSON metadata
    const jsonUrl = yield (0, jsonbin_1.uploadJson)(name, name, assertUrl, attributes);
    const config = (0, common_1.getConfig)();
    const umi = (0, umi_bundle_defaults_1.createUmi)(config.endpoint);
    const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
    const payerKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
    umi.use((0, umi_1.keypairIdentity)(payerKeypair));
    const merkleTree = (0, umi_1.publicKey)(merkleTreeInfo.publicKey);
    const collectionMint = (0, umi_1.publicKey)(collectionPublicKey);
    const ownerKeyPair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(collectionOwnerSecretKey));
    const collectionUpdateAuthority = (0, umi_1.createSignerFromKeypair)(umi, ownerKeyPair);
    const mintResult = yield (0, mpl_bubblegum_1.mintToCollectionV1)(umi, {
        leafOwner: payerKeypair.publicKey,
        merkleTree,
        collectionMint,
        collectionAuthority: collectionUpdateAuthority,
        metadata: {
            name: name,
            uri: jsonUrl,
            sellerFeeBasisPoints: 500, // 5%
            collection: { key: collectionMint, verified: true },
            creators: [
                { address: umi.identity.publicKey, verified: true, share: 100 },
            ],
        },
    }).sendAndConfirm(umi);
    console.log("payer =>", payerKeypair.publicKey.toString());
    console.log("leafOwner =>", payerKeypair.publicKey.toString());
    console.log("merkleTree =>", merkleTree);
    console.log("collectionMint =>", collectionMint.toString());
    console.log("signature =>", bs58_1.default.encode(mintResult.signature));
    console.log("result =>", mintResult.result);
});
exports.mintToCollection = mintToCollection;
