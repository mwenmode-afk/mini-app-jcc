import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { retryWrites: true, w: 'majority' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Schéma MongoDB
const orderSchema = new mongoose.Schema({
  telegramId: Number,
  items: Array,
  total: Number,
  currency: String,
  status: { type: String, default: 'Envoyée' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Serve HTML
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#101a3c">
<title>Jérémy CC · Cartes cadeaux</title>
<script src="https://telegram.org/js/telegram-web-app.js"><\/script>
<style>
:root{
  --bg1:#12204a; --bg2:#1a2258; --bg3:#2a1f5c;
  --glass:rgba(34,50,110,.52);
  --txt:#eef2ff;
  --blue:#3d63e6;
  --blue-hi:#7fa2ff;
  --body:'Manrope',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg1);color-scheme:dark}
body{font-family:var(--body);color:var(--txt);min-height:100vh;
  background:linear-gradient(165deg,var(--bg1),var(--bg2) 55%,var(--bg3));
  padding:20px;
}
.wrap{max-width:560px;margin:0 auto}
.head{text-align:center;padding:20px 0}
.head .name{font-weight:800;font-size:18px;color:var(--blue-hi);text-transform:uppercase;letter-spacing:.1em}
.glass{background:rgba(34,50,110,.52);border:1px solid rgba(122,152,255,.30);border-radius:16px;padding:30px;text-align:center;backdrop-filter:blur(16px)}
.glass h2{margin:10px 0;font-size:24px}
.glass p{margin:8px 0;color:#93a4d6;font-size:14px}
.cta{width:100%;height:50px;margin-top:20px;border-radius:14px;background:var(--blue);color:white;border:none;font-weight:800;cursor:pointer}
.cta:hover{filter:brightness(1.1)}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div class="name">Jérémy CC</div>
  </div>
  <div class="glass">
    <h2>🎉 Mini-app Live!</h2>
    <p>Bienvenue dans la boutique de cartes cadeaux.</p>
    <p>Codes en cours d'ajout via le panel admin.</p>
    <button class="cta" onclick="alert('Codes à venir 🎁')">Voir les codes</button>
  </div>
</div>
<script>
const tg = window.Telegram?.WebApp;
if(tg) {
  tg.ready();
  tg.expand();
}
<\/script>
</body>
</html>`);
});

// API: Recevoir les commandes
app.post('/api/order', async (req, res) => {
  try {
    const { items, total, currency } = req.body;
    const order = new Order({
      telegramId: process.env.TELEGRAM_ID,
      items,
      total,
      currency,
      status: 'Envoyée'
    });
    await order.save();
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Récupérer les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({ telegramId: process.env.TELEGRAM_ID }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
