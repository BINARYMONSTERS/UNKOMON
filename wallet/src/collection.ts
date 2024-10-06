import bs58 from "bs58";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { saveData, loadData } from "./storage";
import { getConfig, getConnection, getSonicConnection, wait } from "./common";
import { ChainType, Collection, Wallet } from "./type";

const COLLECTION_PUBLIC_KEY = "collectionPublicKey";
const COLLECTION_SECRET_KEY = "collectionSecretKey";

// Create a new collection
// @param name: string - Collection name
// @return {
//   publicKey: string,
//   secretKey: string,
// }
export const createCollection = async (
  wallet: Wallet,
  name: string
): Promise<Collection> => {
  // Load collection info from storage
  let publicKey = await loadData(COLLECTION_PUBLIC_KEY);
  let secretKey = await loadData(COLLECTION_SECRET_KEY);
  if (publicKey && secretKey) {
    return {
      publicKey,
      secretKey,
    };
  }

  const config = getConfig();
  const umi = createUmi(config.endpoint);

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  umi.use(mplTokenMetadata());
  const collectionUpdateAuthority = createSignerFromKeypair(umi, payerKeypair);

  const collectionMint = generateSigner(umi);
  const result = await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: name,
    uri: "https://example.com/my-collection.json",
    sellerFeeBasisPoints: percentAmount(5), // 5%
    isCollection: true,
  }).sendAndConfirm(umi);

  console.log(bs58.encode(result.signature));

  const collectionPublicKey = collectionMint.publicKey.toString();
  const collectionSecretKey = Array.from(collectionMint.secretKey);

  await saveData(COLLECTION_PUBLIC_KEY, collectionPublicKey);
  await saveData(COLLECTION_SECRET_KEY, collectionSecretKey);

  return {
    publicKey: collectionPublicKey,
    secretKey: collectionSecretKey,
  };
};

export const createCollectionWithoutCaching = async (
  wallet: Wallet,
  name: string,
  chainType: ChainType = "solana"
) => {
  const config = getConfig();
  const connection =
    chainType === "solana" ? getConnection() : getSonicConnection();
  const umi = createUmi(
    chainType === "solana" ? config.endpoint : config.sonicEndpoint
  );

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  umi.use(mplTokenMetadata());
  const collectionUpdateAuthority = createSignerFromKeypair(umi, payerKeypair);

  const collectionMint = generateSigner(umi);
  const transactionBuilder = await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: name,
    uri: "https://example.com/my-collection.json",
    sellerFeeBasisPoints: percentAmount(5), // 5%
    isCollection: true,
  });

  const totalNumberOfRetries = 10;
  let landed = false;

  const result = {
    publicKey: collectionMint.publicKey.toString(),
    secretKey: Array.from(collectionMint.secretKey),
    signature: "",
  };

  for (let i = 0; i < totalNumberOfRetries; i++) {
    // Send the transaction without retry
    const transactionSignature = await transactionBuilder.send(umi, {
      skipPreflight: true,
      maxRetries: 0,
    });

    await wait(5000);

    // Check signature status
    const sigStatus = await connection.getSignatureStatus(
      bs58.encode(transactionSignature)
    );

    console.log(
      "sigStatus",
      sigStatus.value?.confirmationStatus,
      sigStatus.context.slot
    );
    if (sigStatus.value?.confirmationStatus === "confirmed") {
      console.log("landed");
      console.log("Signature", bs58.encode(transactionSignature));
      console.log("status", sigStatus);

      result.signature = bs58.encode(transactionSignature);
      landed = true;
      break;
    }

    await wait(2000);
  }

  return result;
};
