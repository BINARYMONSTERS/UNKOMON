import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { getConfig } from "./common";
import { loadData, saveData } from "./storage";
import { MerkleTree, Wallet } from "./type";

const MERKLE_TREE_PUBLIC_KEY = "merkleTreePublicKey";
const MERKLE_TREE_SECRET_KEY = "merkleTreeSecretKey";

// Get Merkle tree
// @return {
//   publicKey: string,
//   secretKey: number[],
// } | null
export const getMerkeTree = async () => {
  const publicKey = await loadData(MERKLE_TREE_PUBLIC_KEY);
  const secretKey = await loadData(MERKLE_TREE_SECRET_KEY);
  if (!publicKey || !secretKey) {
    return null;
  }
  return {
    publicKey,
    secretKey,
  };
};

// Create a new Merkle tree
// @param wallet: {
//   publicKey: string,
//   secretKey: number[],
// } - Payer wallet information
// @return {
//   publicKey: string,
//   secretKey: string,
// }
export const createMerkleTree = async (wallet: Wallet): Promise<MerkleTree> => {
  const config = getConfig();
  const umi = createUmi(config.endpoint);

  const secretKeyUInt8Array = new Uint8Array(wallet.secretKey);
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  const merkleTree = generateSigner(umi);

  const builder = await createTree(umi, {
    merkleTree,
    // maxDepth: 3,
    // maxBufferSize: 8,
    maxDepth: 14,
    maxBufferSize: 64,
  });

  await builder.sendAndConfirm(umi);

  const publicKey = merkleTree.publicKey.toString();
  const secretKey = Array.from(merkleTree.secretKey);

  await saveData(MERKLE_TREE_PUBLIC_KEY, publicKey);
  await saveData(MERKLE_TREE_SECRET_KEY, secretKey);

  return {
    publicKey,
    secretKey,
  };
};
