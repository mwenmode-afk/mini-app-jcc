# ⚡ Quickstart - 5 minutes pour tout mettre en place

## 1️⃣ Crée un bot Telegram (2 minutes)

1. Ouvre [@BotFather](https://t.me/botfather)
2. Envoie `/newbot`
3. Réponds aux questions (nom du bot, etc.)
4. **Copie le TOKEN** : `6789123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh`
5. Trouve ton ID Telegram → [@GetIdsBot](https://t.me/getidsbot) → envoie `/start` → copie l'ID

## 2️⃣ Configure MongoDB (2 minutes)

1. Va sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → crée un compte
2. Crée un cluster gratuit
3. **Database Access** → crée un user `jeremy` / password `securite123`
4. **Network Access** → ajoute `0.0.0.0/0` (ou restreint à ton IP)
5. **Clusters** → clique "Connect" → choisis "Connect your application"
6. **Copie la chaîne de connexion** : `mongodb+srv://jeremy:securite123@cluster.mongodb.net/jeremy-cc`

## 3️⃣ Clone/Configure l'app (1 minute)

```bash
# Copie tous les fichiers du projet dans un dossier
cd /chemin/vers/jcc-bot

# Installe les dépendances
npm install

# Crée le fichier .env
nano .env
```

Colle ceci (remplace les valeurs) :
```
TELEGRAM_BOT_TOKEN=6789123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
TELEGRAM_ADMIN_ID=123456789
MONGODB_URI=mongodb+srv://jeremy:securite123@cluster.mongodb.net/jeremy-cc
JWT_SECRET=superclé123456789123456789123456789
ADMIN_PASSWORD=admin123
BOT_USERNAME=JeremyCC
SUPPORT_TELEGRAM_USERNAME=TonSupport
NODE_ENV=development
PORT=3000
```

## 4️⃣ Démarre l'app (1 minute)

```bash
npm run dev
```

Tu devrais voir :
```
✅ MongoDB connecté
📍 Serveur: http://localhost:3000
🏠 Mini-app: http://localhost:3000/app
👤 Panel admin: http://localhost:3000/admin
```

## ✅ C'est prêt !

### Sur ton téléphone / PC

1. Ouvre Telegram → cherche ton bot → appuie sur "/start"
2. Dois voir un bouton "Ouvrir la boutique" → clique dessus
3. La mini-app s'ouvre → tu vois 14 enseignes (de démo)

### Panel Admin

1. Ouvre http://localhost:3000/admin
2. Login : mot de passe = `admin123`
3. **Ajoute tes codes :**
   - Onglet "Ajouter codes"
   - Marque : Nike
   - Montant : 50
   - Codes : colle tes codes (un par ligne)
   - Clique "Ajouter au stock"

## 🚀 Ensuite : Déploie (5-10 minutes)

### Option simple : Railway (recommandé)

1. Push ton code sur GitHub (avec `.gitignore` qui exclut `.env`)
2. Va sur [railway.app](https://railway.app) → Sign up avec GitHub
3. New Project → Deploy from GitHub
4. Sélectionne ton repo
5. Ajoute les variables d'env
6. Clique "Deploy"
7. Railway te donne une URL : `https://jcc-bot-prod-xyz.railway.app`

### Configuration du bot (après déploiement)

1. Va sur [@BotFather](https://t.me/botfather)
2. Cherche ton bot → **Edit Bot** → **Edit Menu Button**
3. Ajoute :
   - Type : "web_app"
   - URL : `https://jcc-bot-prod-xyz.railway.app/app`
   - Texte : "🛍️ Ouvrir la boutique"
4. Sauvegarde

## 📊 Premier test

1. Ouvre ton bot Telegram
2. Clique "Ouvrir la boutique"
3. Choisis Nike → 50€ → +1 → "Ajouter"
4. Vas à ton admin panel
5. Onglet "Commandes" → tu vois ta commande
6. Onglet "Codes" → marque les codes comme "Vendus" (c'est manuel pour l'instant)

---

**Ça y est ! 🎉 Ton bot est en ligne.**

Les prochaines étapes (optionnelles) :
- [ ] Ajouter des enseignes
- [ ] Ajouter le paiement automatique (Stripe)
- [ ] Ajouter des statistiques avancées
- [ ] Customiser le design de la mini-app
- [ ] Ajouter un bot de support automatique

Questions ? Vérifie le README.md pour plus de détails.
