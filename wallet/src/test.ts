import {
  getUserWallet,
  createUserWallet,
  mintMonsterNft,
  mintStoolData,
} from "./index";
import { addFundToWallet, getBalance } from "./wallet";
import base58 from "bs58";

const test = async () => {
  let wallet = await getUserWallet();
  if (!wallet) {
    wallet = await createUserWallet();
  }

  console.log("wallet", wallet);

  console.log("Private key:", base58.encode(new Uint8Array(wallet.secretKey)));

  await mintMonsterNft(
    "Monster sample",
    "https://media.istockphoto.com/id/173557913/ja/%E3%82%B9%E3%83%88%E3%83%83%E3%82%AF%E3%83%95%E3%82%A9%E3%83%88/%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88-11.jpg?s=1024x1024&w=is&k=20&c=dlR69p4Xy6znQvOKGj88W3QHfnIXx--56BVwhdkXE3c=",
    {
      power: "100",
      defense: "50",
    },
    "sonic"
  );

  // await mintStoolData("Stool", "https://stool.com/image.png", {
  //   color: "brown",
  //   smell: "bad",
  // });
};

test();
