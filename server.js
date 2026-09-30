import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// === MIDDLEWARE ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: true,
  credentials: true
}));

// === LOGS ===
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// === STATIC FILES ===
app.use('/app', express.static(path.join(__dirname, 'public')));
app.use('/admin-assets', express.static(path.join(__dirname, 'admin')));

// === ROUTES ===
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// === MINI-APP (HTML) ===
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// === ADMIN PANEL (HTML) ===
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'panel.html'));
});

// === WEBHOOK TELEGRAM (pour le polling, optionnel) ===
app.post('/webhook', express.json(), (req, res) => {
  // À implémenter si tu veux utiliser les webhooks
  // Pour l'instant, on utilise le polling
  res.json({ ok: true });
});

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Erreur serveur',
    message: config.server.nodeEnv === 'development' ? err.message : undefined
  });
});

// === CONNEXION MONGODB & DÉMARRAGE ===
async function start() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(config.database.uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connecté');

    app.listen(config.server.port, config.server.host, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║         🎁 JÉRÉMY CC - BOT TELEGRAM            ║
╚════════════════════════════════════════════════╝

📍 Serveur: http://${config.server.host}:${config.server.port}
🏠 Mini-app: http://${config.server.host}:${config.server.port}/app
👤 Panel admin: http://${config.server.host}:${config.server.port}/admin

🔗 API: http://${config.server.host}:${config.server.port}/api
⚙️  Admin API: http://${config.server.host}:${config.server.port}/admin

MODE: ${config.server.nodeEnv}

📝 Prochaines étapes:
  1. Configure les variables d'environnement (.env)
  2. Va sur BotFather pour créer/configurer le bot
  3. Ouvre http://localhost:${config.server.port}/admin pour gérer les codes
  4. Ajoute ta mini-app dans BotFather

      `);
    });
  } catch (error) {
    console.error('❌ Erreur de démarrage:', error.message);
    process.exit(1);
  }
}

start();
