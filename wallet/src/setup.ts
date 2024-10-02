// import { createMasterWallet } from "./wallet.js";
import { createMasterWallet, getBalance, addFundToWallet } from "./wallet";
import { createCollectionWithoutCaching } from "./collection";
import { getConfig } from "./common";

const main = async () => {
  const config = getConfig();

  // Create wallet for unkomon
  // const wallet = await createMasterWallet();
  const wallet = config.masterWallet;
  console.log("master wallet", wallet);
  // check balance
  let balance = await getBalance(wallet.secretKey);
  console.log("balance", balance);
  if (balance < 1) {
    await addFundToWallet(wallet.secretKey, 5);
    balance = await getBalance(wallet.secretKey);
    console.log("new balance", balance);
  }

  // Create collection for monsters
  const monsterCollection = await createCollectionWithoutCaching(
    wallet,
    "Monster collection"
  );
  console.log("monster collection", monsterCollection);

  // Create collection for stool
  const stoolCollection = await createCollectionWithoutCaching(
    wallet,
    "Stool collection"
  );

  console.log("stool collection", stoolCollection);
};

main();
