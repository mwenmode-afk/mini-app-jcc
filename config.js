import dotenv from 'dotenv';
dotenv.config();

const config = {
  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    adminId: parseInt(process.env.TELEGRAM_ADMIN_ID || '0'),
    supportUsername: process.env.SUPPORT_TELEGRAM_USERNAME || 'TonSupport',
    botUsername: process.env.BOT_USERNAME || 'TonBot'
  },

  // Base de données
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jeremy-cc'
  },

  // Serveur
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Sécurité
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    bcryptRounds: 10
  },

  // URLs
  urls: {
    webhookUrl: process.env.BOT_WEBHOOK_URL || 'http://localhost:3000/webhook',
    miniAppUrl: process.env.MINI_APP_URL || 'http://localhost:3000/app'
  },

  // Paiement
  payment: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY || ''
  }
};

// Validation au démarrage
function validateConfig() {
  const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_ID', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Variables manquantes : ${missing.join(', ')}`);
  }
  
  if (config.security.jwtSecret === 'default_secret_key_change_in_production') {
    console.warn('⚠️  JWT_SECRET n\'est pas défini. Générez une clé sécurisée.');
  }
}

validateConfig();
export default config;
