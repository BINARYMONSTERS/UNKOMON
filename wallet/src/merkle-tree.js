import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { getConfig } from "./common.js";
import { loadData, saveData } from "./storage.js";

const MERKLE_TREE_PUBLIC_KEY = "merkleTreePublicKey";
const MERKLE_TREE_SECRET_KEY = "merkleTreeSecretKey";

// Create a new Merkle tree
// @return {
//   publicKey: string,
//   secretKey: string,
// }
export const getOrCreateMerkleTree = async (wallet) => {
  // Load Merkle tree from storage
  let publicKey = await loadData(MERKLE_TREE_PUBLIC_KEY);
  let secretKey = await loadData(MERKLE_TREE_SECRET_KEY);
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

  // ----------------------------------------------------
  //  Create Merkle Tree
  // ----------------------------------------------------
  // Max Depth / Max Buffer Size Table:
  //  https://developers.metaplex.com/bubblegum/create-trees#creating-a-bubblegum-tree
  const merkleTree = generateSigner(umi);

  const builder = await createTree(umi, {
    merkleTree,
    // maxDepth: 3,
    // maxBufferSize: 8,
    maxDepth: 14,
    maxBufferSize: 64,
  });

  publicKey = merkleTree.publicKey.toString();
  secretKey = Array.from(merkleTree.secretKey);

  await saveData(MERKLE_TREE_PUBLIC_KEY, publicKey);
  await saveData(MERKLE_TREE_SECRET_KEY, secretKey);

  return {
    publicKey,
    secretKey,
  };
};
