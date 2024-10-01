import express from 'express';
import { createUserWallet, getUserWallet, mintMonsterNft, mintStoolData } from './src/index.js';

const app = express();
const port = 3000;

// JSONリクエストのパース
app.use(express.json());

// ウォレット作成エンドポイント
app.post('/api/create-wallet', async (req, res) => {
    try {
        const wallet = await createUserWallet();
        res.json(wallet);
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: error.message });
    }
});

// ウォレット取得エンドポイント
app.get('/api/get-wallet', async (req, res) => {
    try {
        const wallet = await getUserWallet();
        if (!wallet) {
            res.status(404).json({ error: 'Wallet not found' });
        } else {
            res.json(wallet);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// モンスターNFTミントエンドポイント
app.post('/api/mint-monster', async (req, res) => {
    const { name, imageUrl, attributes } = req.body;
    try {
        await mintMonsterNft(name, imageUrl, attributes);
        res.json({ status: 'Monster NFT minted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// StoolデータNFTミントエンドポイント
app.post('/api/mint-stool', async (req, res) => {
    const { name, imageUrl, attributes } = req.body;
    try {
        await mintStoolData(name, imageUrl, attributes);
        res.json({ status: 'Stool NFT minted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
