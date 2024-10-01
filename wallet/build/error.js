"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletNotFoundError = exports.BalanceNotEnoughError = void 0;
class BalanceNotEnoughError extends Error {
    constructor(message) {
        super(message);
        this.name = "BalanceNotEnoughError";
    }
}
exports.BalanceNotEnoughError = BalanceNotEnoughError;
class WalletNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "WalletNotFoundError";
    }
}
exports.WalletNotFoundError = WalletNotFoundError;
