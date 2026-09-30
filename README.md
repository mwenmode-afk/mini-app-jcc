# 🎁 Jérémy CC - Bot Telegram pour Vendre des Cartes Cadeaux

Système complet pour vendre des cartes cadeaux via un bot Telegram avec mini-app intégrée.

## 📋 Architecture

```
Bot Telegram → Mini-App (HTML) ← → Backend API (Node.js) ← → MongoDB
                                       ↓
                                  Admin Panel
```

## 🚀 Installation

### 1. Prérequis
- **Node.js** 18+ ([télécharger](https://nodejs.org))
- **MongoDB** (local ou cloud) ([Atlas gratuit](https://www.mongodb.com/cloud/atlas))
- **Un bot Telegram** (créé via [@BotFather](https://t.me/botfather))
- **Un domaine HTTPS** pour le déploiement (ex: Railway, Render, VPS)

### 2. Cloner/Télécharger le projet

```bash
# Créer un dossier
mkdir jcc-bot && cd jcc-bot

# Initialiser Node.js
npm init -y
npm install express mongoose dotenv cors axios jsonwebtoken bcryptjs uuid
```

### 3. Configuration

Copie le fichier `.env.example` en `.env` et remplis-le :

```bash
cp .env.example .env
```

**Édite `.env` :**

```
TELEGRAM_BOT_TOKEN=6789123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
TELEGRAM_ADMIN_ID=123456789
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jeremy-cc
JWT_SECRET=ta-clé-secrète-très-très-longue-minimum-32-caractères
ADMIN_PASSWORD=mots_de_passe_admin_très_sécurisé
BOT_USERNAME=JeremyCC
SUPPORT_TELEGRAM_USERNAME=TonSupport
NODE_ENV=production
PORT=3000
```

**Où trouver ces infos :**
- `TELEGRAM_BOT_TOKEN` : @BotFather → `/newbot`
- `TELEGRAM_ADMIN_ID` : @GetIdsBot → envoie `/start`
- `MONGODB_URI` : MongoDB Atlas → Cluster → Connect → Connection String
- Génère un `JWT_SECRET` sécurisé : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Démarrer en local

```bash
# Mode développement (auto-reload)
npm run dev

# Mode production
npm start
```

Tu devrais voir :
```
✅ MongoDB connecté
📍 Serveur: http://localhost:3000
🏠 Mini-app: http://localhost:3000/app
👤 Panel admin: http://localhost:3000/admin
```

## 🎮 Utilisation

### Admin Panel
Accès : `http://localhost:3000/admin`
- Login avec le mot de passe défini dans `.env`
- Dashboard : statistiques
- Codes : gérer le stock
- Commandes : valider les commandes, envoyer les codes

### Ajouter des codes cadeaux

1. Ouvre le panel admin
2. Onglet "Ajouter codes"
3. Marque, montant, codes (un par ligne)
4. Clique sur "Ajouter au stock"

### Mini-App
- Les utilisateurs ouvrent via le bot : `http://localhost:3000/app`
- Parcourent les cartes, choisissent un montant, commandent
- Les commandes apparaissent en temps réel dans l'admin

## 🤖 Configuration du Bot Telegram

### Via @BotFather

1. Ouvre [@BotFather](https://t.me/botfather)
2. `/newbot` → crée un bot (récupère le TOKEN)
3. Copie le TOKEN dans `.env` (`TELEGRAM_BOT_TOKEN`)
4. `/mybots` → sélectionne ton bot
5. **Bot Settings** → **Menu Button** → `/setmenubutton`
   - Type : "web_app"
   - URL : `https://tondomaine.com/app`
   - Texte : "🛍️ Ouvrir la boutique"

### Commandes du bot (optionnel)

Via BotFather, `/setcommands` :
```
start - Ouvrir la boutique
shop - Accéder à la mini-app
orders - Voir mes commandes
help - Besoin d'aide ?
```

## 🌐 Déploiement

### Option 1 : Railway (recommandé, gratuit au départ)

1. Push ton code sur GitHub
2. Va sur [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Choisis ton repo
5. Ajoute les variables `.env`
6. Deploy

Railway te donne une URL publique → utilise-la dans BotFather et `.env`

### Option 2 : Render

1. [render.com](https://render.com)
2. New → Web Service → Connect GitHub
3. Nom : `jeremy-cc-bot`
4. Environment : Node
5. Build command : `npm install`
6. Start command : `npm start`
7. Ajoute les variables d'environnement
8. Deploy

### Option 3 : VPS (DigitalOcean, Linode, etc.)

```bash
# Sur ton VPS
git clone <ton-repo>
cd jcc-bot
npm install

# Installer PM2 pour garder l'app en ligne
npm install -g pm2
pm2 start server.js --name "jeremy-cc"
pm2 save
pm2 startup
```

## 📊 API Reference

### Pour la mini-app (utilisateurs)

- `GET /api/balance` - Récupère le solde de l'utilisateur
- `POST /api/order` - Crée une commande
- `GET /api/orders` - Récupère l'historique des commandes
- `GET /api/stock` - Liste les cartes disponibles

**Headers requis :**
```
x-telegram-id: (ID Telegram de l'utilisateur)
x-telegram-username: (pseudo Telegram)
x-telegram-first-name: (prénom)
```

### Pour le panel admin

- `POST /admin/login` - Se connecter
- `GET /admin/dashboard` - Statistiques
- `GET /admin/cards` - Liste les codes
- `POST /admin/cards/add` - Ajouter des codes
- `GET /admin/orders` - Commandes en attente
- `POST /admin/orders/:id/status` - Changer le statut
- `POST /admin/orders/:id/send-codes` - Envoyer les codes

## 🔒 Sécurité

- Les mots de passe utilisent bcrypt (hashés)
- JWT pour l'authentification admin
- CORS et validations de données
- MongoDB Atlas avec authentification
- En production : HTTPS obligatoire

**Checklist avant le déploiement :**
- ✅ `.env` complètement rempli
- ✅ `JWT_SECRET` et `ADMIN_PASSWORD` forts (32+ caractères)
- ✅ URL HTTPS configurée
- ✅ MongoDB en ligne et sécurisé
- ✅ NODE_ENV=production
- ✅ Teste la mini-app avec un vrai ID Telegram

## 🐛 Troubleshooting

**MongoDB ne se connecte pas**
```
→ Vérifie la chaîne de connexion dans .env
→ Assure-toi que IP est autorisée dans MongoDB Atlas
→ Teste avec mongodb://localhost:27017/jeremy-cc en local
```

**Le panel admin retourne 401**
```
→ Vérifie le mot de passe (c'est le JWT_SECRET qui chiffre)
→ Réinitialise le token : localStorage.clear() dans DevTools
```

**La mini-app n'appelle pas l'API**
```
→ Ouvre DevTools → Network → vérifie les appels /api/
→ Vérifie que les headers x-telegram-* sont envoyés
→ En local, c'est OK de tester en "démo" sans headers
```

## 📝 Notes

- La mini-app stocke le panier en `localStorage`
- Les commandes deviennent "payées" manuellement via l'admin
- À ajouter plus tard : paiement automatique (Stripe, PayPal)
- Les codes ne sont jamais affichés au client (seulement à l'admin)

## 🆘 Support

En cas de problème :
1. Vérifie la console (`npm start` = dev logs)
2. Regarde les réponses API dans DevTools
3. Teste avec `curl` :
   ```bash
   curl -X POST http://localhost:3000/api/order \
     -H "Content-Type: application/json" \
     -H "x-telegram-id: 123456789" \
     -d '{"items":[{"brand":"Nike","amount":50,"qty":1}],"total":50}'
   ```

## 📄 Licence

MIT

---

**Créé pour Jérémy CC** 🎁

Questions ? Contacte [@TonSupport](https://t.me/TonSupport) sur Telegram.
