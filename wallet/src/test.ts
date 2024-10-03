import {
  getUserWallet,
  createUserWallet,
  mintMonsterNft,
  mintStoolData,
} from "./index";

const test = async () => {
  let wallet = await getUserWallet();
  if (!wallet) {
    wallet = await createUserWallet();
  }
  console.log("Wallet:", wallet);

  await mintMonsterNft("Monster", "https://monster.com/image.png", {
    power: "100",
    defense: "50",
  });

  // await mintStoolData("Stool", "https://stool.com/image.png", {
  //   color: "brown",
  //   smell: "bad",
  // });
};

test();
