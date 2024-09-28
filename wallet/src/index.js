import { getWallet, createUserWallet } from "./wallet.js";
import { isBrowser } from "./common.js";

let wallet = await getWallet();

if (!wallet) {
  console.log("No wallet found, creating a new one...");
  wallet = await createUserWallet();
}

console.log("Current user wallet:");
console.log(wallet);

if (isBrowser()) {
  window.getUserWallet = getWallet;
  window.createUserWallet = createUserWallet;
}
