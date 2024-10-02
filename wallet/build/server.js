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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./index");
const app = (0, express_1.default)();
const port = 3000;
const corsOptions = {
    origin: "http://localhost:8081",
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Create wallet endpoint
app.post("/api/create-wallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield (0, index_1.createUserWallet)();
        res.json(wallet);
    }
    catch (error) {
        console.error("Error creating wallet:", error);
        res.status(500).json({ error: error.message });
    }
}));
// Get wallet endpoint
app.get("/api/get-wallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield (0, index_1.getUserWallet)();
        if (!wallet) {
            res.status(404).json({ error: "Wallet not found" });
        }
        else {
            res.json(wallet);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Mint monster NFT endpoint
app.post("/api/mint-monster", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl, attributes } = req.body;
    try {
        yield (0, index_1.mintMonsterNft)(name, imageUrl, attributes);
        res.json({ status: "Monster NFT minted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Mint stool data NFT endpoint
app.post("/api/mint-stool", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl, attributes } = req.body;
    try {
        yield (0, index_1.mintStoolData)(name, imageUrl, attributes);
        res.json({ status: "Stool NFT minted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
