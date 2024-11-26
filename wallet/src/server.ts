import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import {
  createUserWallet,
  getUserWallet,
  mintMonsterNft,
  mintStoolData,
} from "./index";

const app = express();
const port = 3000;

const corsOptions: CorsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create wallet endpoint
app.post(
  "/api/create-wallet",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const wallet = await createUserWallet();
      res.json(wallet);
    } catch (error: any) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get wallet endpoint
app.get(
  "/api/get-wallet",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const wallet = await getUserWallet();
      if (!wallet) {
        res.status(404).json({ error: "Wallet not found" });
      } else {
        res.json(wallet);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Mint monster NFT endpoint
app.post(
  "/api/mint-monster",
  async (req: Request, res: Response): Promise<void> => {
    const { name, imageUrl, attributes } = req.body;
    try {
      await mintMonsterNft(name, imageUrl, attributes);
      res.json({ status: "Monster NFT minted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.post(
  "/api/mint-sonic-monster",
  async (req: Request, res: Response): Promise<void> => {
    const { name, imageUrl, attributes } = req.body;
    try {
      await mintMonsterNft(name, imageUrl, attributes, "sonic");
      res.json({ status: "Monster NFT minted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.post(
  "/api/mint-soon-monster",
  async (req: Request, res: Response): Promise<void> => {
    const { name, imageUrl, attributes } = req.body;
    try {
      await mintMonsterNft(name, imageUrl, attributes, "soon");
      res.json({ status: "Monster NFT minted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Mint stool data NFT endpoint
app.post(
  "/api/mint-stool",
  async (req: Request, res: Response): Promise<void> => {
    const { name, imageUrl, attributes } = req.body;
    try {
      await mintStoolData(name, imageUrl, attributes);
      res.json({ status: "Stool NFT minted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
