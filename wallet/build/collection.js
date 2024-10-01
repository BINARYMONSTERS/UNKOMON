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
exports.createCollectionWithoutCaching = exports.createCollection = void 0;
const bs58_1 = __importDefault(require("bs58"));
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const mpl_token_metadata_2 = require("@metaplex-foundation/mpl-token-metadata");
const storage_1 = require("./storage");
const common_1 = require("./common");
const COLLECTION_PUBLIC_KEY = "collectionPublicKey";
const COLLECTION_SECRET_KEY = "collectionSecretKey";
// Create a new collection
// @param name: string - Collection name
// @return {
//   publicKey: string,
//   secretKey: string,
// }
const createCollection = (wallet, name) => __awaiter(void 0, void 0, void 0, function* () {
    // Load collection info from storage
    let publicKey = yield (0, storage_1.loadData)(COLLECTION_PUBLIC_KEY);
    let secretKey = yield (0, storage_1.loadData)(COLLECTION_SECRET_KEY);
    if (publicKey && secretKey) {
        return {
            publicKey,
            secretKey,
        };
    }
    const config = (0, common_1.getConfig)();
    const umi = (0, umi_bundle_defaults_1.createUmi)(config.endpoint);
    const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
    const payerKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
    umi.use((0, umi_1.keypairIdentity)(payerKeypair));
    umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
    const collectionUpdateAuthority = (0, umi_1.createSignerFromKeypair)(umi, payerKeypair);
    const collectionMint = (0, umi_1.generateSigner)(umi);
    const result = yield (0, mpl_token_metadata_2.createNft)(umi, {
        mint: collectionMint,
        authority: collectionUpdateAuthority,
        name: name,
        uri: "https://example.com/my-collection.json",
        sellerFeeBasisPoints: (0, umi_1.percentAmount)(5), // 5%
        isCollection: true,
    }).sendAndConfirm(umi);
    console.log(bs58_1.default.encode(result.signature));
    const collectionPublicKey = collectionMint.publicKey.toString();
    const collectionSecretKey = Array.from(collectionMint.secretKey);
    yield (0, storage_1.saveData)(COLLECTION_PUBLIC_KEY, collectionPublicKey);
    yield (0, storage_1.saveData)(COLLECTION_SECRET_KEY, collectionSecretKey);
    return {
        publicKey: collectionPublicKey,
        secretKey: collectionSecretKey,
    };
});
exports.createCollection = createCollection;
const createCollectionWithoutCaching = (wallet, name) => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, common_1.getConfig)();
    const umi = (0, umi_bundle_defaults_1.createUmi)(config.endpoint);
    const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
    const payerKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
    umi.use((0, umi_1.keypairIdentity)(payerKeypair));
    umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
    const collectionUpdateAuthority = (0, umi_1.createSignerFromKeypair)(umi, payerKeypair);
    const collectionMint = (0, umi_1.generateSigner)(umi);
    const result = yield (0, mpl_token_metadata_2.createNft)(umi, {
        mint: collectionMint,
        authority: collectionUpdateAuthority,
        name: name,
        uri: "https://example.com/my-collection.json",
        sellerFeeBasisPoints: (0, umi_1.percentAmount)(5), // 5%
        isCollection: true,
    }).sendAndConfirm(umi);
    console.log(bs58_1.default.encode(result.signature));
    return {
        publicKey: collectionMint.publicKey.toString(),
        secretKey: Array.from(collectionMint.secretKey),
        signature: bs58_1.default.encode(result.signature),
    };
});
exports.createCollectionWithoutCaching = createCollectionWithoutCaching;
