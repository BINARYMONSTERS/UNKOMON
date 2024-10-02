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
// import { createMasterWallet } from "./wallet.js";
const wallet_1 = require("./wallet");
const collection_1 = require("./collection");
const common_1 = require("./common");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = (0, common_1.getConfig)();
    // Create wallet for unkomon
    // const wallet = await createMasterWallet();
    const wallet = config.masterWallet;
    console.log("master wallet", wallet);
    // check balance
    let balance = yield (0, wallet_1.getBalance)(wallet.secretKey);
    console.log("balance", balance);
    if (balance < 1) {
        yield (0, wallet_1.addFundToWallet)(wallet.secretKey, 5);
        balance = yield (0, wallet_1.getBalance)(wallet.secretKey);
        console.log("new balance", balance);
    }
    // Create collection for monsters
    const monsterCollection = yield (0, collection_1.createCollectionWithoutCaching)(wallet, "Monster collection");
    console.log("monster collection", monsterCollection);
    // Create collection for stool
    const stoolCollection = yield (0, collection_1.createCollectionWithoutCaching)(wallet, "Stool collection");
    console.log("stool collection", stoolCollection);
});
main();
