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
const index_1 = require("./index");
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield (0, index_1.getUserWallet)();
    if (!wallet) {
        wallet = yield (0, index_1.createUserWallet)();
    }
    console.log("Wallet:", wallet);
    yield (0, index_1.mintMonsterNft)("Monster", "https://monster.com/image.png", {
        power: "100",
        defense: "50",
    });
    // await mintStoolData("Stool", "https://stool.com/image.png", {
    //   color: "brown",
    //   smell: "bad",
    // });
});
test();
