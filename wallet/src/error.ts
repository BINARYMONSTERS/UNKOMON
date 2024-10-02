export class BalanceNotEnoughError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BalanceNotEnoughError";
  }
}

export class WalletNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletNotFoundError";
  }
}
