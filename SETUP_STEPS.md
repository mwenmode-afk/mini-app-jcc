# 🎯 SETUP STEPS - Instructions Pas à Pas pour Jérémy CC Bot

## 📦 Ce que tu as reçu

Un projet Node.js complet avec :
- ✅ Serveur Express (`server.js`)
- ✅ Modèles MongoDB (User, Order, GiftCard)
- ✅ API REST pour la mini-app
- ✅ Panel admin HTML
- ✅ Mini-app HTML (pour la boutique Telegram)
- ✅ Configuration sécurisée

## 🚀 Les 6 étapes

### ÉTAPE 1 : Crée un Bot Telegram (5 min)

1. Ouvre Telegram → cherche **@BotFather**
2. Envoie `/newbot`
3. Réponds aux questions :
   - Nom : `Jérémy CC` (ou ton nom)
   - Username : `jeremycc_bot` (ou autre, doit être unique)
4. **Tu reçois un TOKEN** : `6789123456:ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGH`
5. **Copie ce token, tu en auras besoin**

Pour trouver ton ID Telegram :
- Ouvre Telegram → cherche **@GetIdsBot**
- Envoie `/start`
- Tu vois : `Your user ID: 123456789`
- **Copie ce numéro**

### ÉTAPE 2 : Configure MongoDB (5 min)

1. Va sur **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. Clique "Try Free"
3. Crée un compte (email, nom, mot de passe)
4. Crée un cluster gratuit
5. Dans "Database Access" → "Add New Database User"
   - Username : `jeremy`
   - Password : `MySecurePass123!` (note-le)
6. Dans "Network Access" → "Add IP Address"
   - Clique "Allow Access from Anywhere" (ou restreins à ton IP)
7. Clique "Clusters" → "Connect"
8. Choisis "Connect your application"
9. Copie la chaîne : `mongodb+srv://jeremy:MySecurePass123!@cluster0.xxxxx.mongodb.net/jeremy-cc`

### ÉTAPE 3 : Prépare les fichiers (5 min)

1. **Télécharge tous les fichiers du projet** (ou clone depuis GitHub)
2. Crée un dossier : `mkdir mon-bot` → `cd mon-bot`
3. Mets tous les fichiers du projet dedans
4. **Génère une clé secrète** (sur Windows ou Mac) :
   - Ouvre un terminal / PowerShell
   - Copie-colle ceci :
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Note la sortie : `abc123def456...` (32 caractères)

### ÉTAPE 4 : Configure le fichier `.env` (2 min)

1. Dans le dossier du projet, **copie** `.env.example` → renomme en `.env`
2. **Édite le fichier `.env`** (bloc-notes, VS Code, nano, etc.)
3. Remplis ces lignes (remplace les valeurs) :

```
TELEGRAM_BOT_TOKEN=6789123456:ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGH
TELEGRAM_ADMIN_ID=123456789
MONGODB_URI=mongodb+srv://jeremy:MySecurePass123!@cluster0.xxxxx.mongodb.net/jeremy-cc
JWT_SECRET=abc123def456...xyz (la clé générée à l'étape 3)
ADMIN_PASSWORD=admin123 (change-le !)
BOT_USERNAME=jeremycc_bot
SUPPORT_TELEGRAM_USERNAME=TonSupport
NODE_ENV=development
PORT=3000
```

**Sauvegarde le fichier.**

### ÉTAPE 5 : Installe et démarre (2 min)

```bash
# Terminal / PowerShell dans le dossier du projet

# Installe les dépendances
npm install

# Démarre l'app
npm run dev
```

Tu devrais voir :
```
✅ MongoDB connecté
📍 Serveur: http://localhost:3000
```

### ÉTAPE 6 : Premier test (3 min)

#### Sur Telegram :
1. Ouvre Telegram → cherche **@jeremycc_bot** (ton bot)
2. Clique "/start"
3. Tu vois un bouton "🛍️ Ouvrir la boutique"
4. **Clique dessus** → la mini-app s'ouvre

#### Sur ton ordinateur :
1. Ouvre http://localhost:3000/admin
2. Mot de passe : `admin123` (ou ce que tu as mis dans `.env`)
3. Clique "Ajouter codes"
4. Ajoute tes codes cadeaux

#### Teste une commande :
1. Sur le bot Telegram → clique la mini-app
2. Choisis **Nike** → montant **50€** → quantité **1**
3. Clique "Ajouter au panier"
4. Clique "Commander"
5. Va au panel admin → onglet "Commandes"
6. **Tu vois ta commande ! ✅**

---

## 🌐 Déployer en ligne (après les tests)

Quand tout marche en local, déploie sur un serveur public :

### Railway (recommandé, très facile)

1. Va sur **[railway.app](https://railway.app)**
2. Clique "Sign Up with GitHub"
3. Autorise Railway à accéder à GitHub
4. Clique "New Project" → "Deploy from GitHub"
5. Choisis le repo du projet
6. Railway te demande de confirmer
7. Clique "Deploy"
8. Ajoute les variables d'env :
   - Clique le projet → "Settings" → "Variables"
   - Copie TOUTES les variables de `.env`
9. Railway redémarre → tu vois une URL : `https://mon-bot-xxx.railway.app`
10. **Copie cette URL**

### Configure le bot pour l'URL en ligne

1. Va sur **@BotFather**
2. `/mybots` → choisis ton bot
3. **Bot Settings** → **Menu Button**
4. `/setmenubutton`
5. Type : "web_app"
6. URL : `https://mon-bot-xxx.railway.app/app`
7. Text : "🛍️ Ouvrir la boutique"
8. Sauvegarde

**C'est prêt ! Ton bot est en ligne ! 🚀**

---

## 🆘 Problèmes ?

### "npm command not found"
→ Installe Node.js : [nodejs.org](https://nodejs.org)

### "MongoDB connection failed"
→ Vérifie :
- La chaîne dans `.env` est correcte
- L'IP whitelist dans MongoDB Atlas (ajoute `0.0.0.0/0`)
- Ton mot de passe contient des caractères spéciaux ? Échappe-les en URL

### "La mini-app n'ouvre pas"
→ Vérifie :
- Le bot token est correct dans `.env`
- Le serveur tourne : `npm run dev` affiche "✅ MongoDB connecté"
- Va à http://localhost:3000/app directement

### "Admin panel : mot de passe incorrect"
→ Regarde le mot de passe dans `.env` (pas d'espaces avant/après)

### "Commande crée mais pas visible en admin"
→ Attends 2 secondes et recharge le panel (`F5`)

---

## 📚 Fichiers importants

| Fichier | Rôle |
|---------|------|
| `.env` | **Tes secrets** (token, passwords) |
| `server.js` | Démarre l'app |
| `routes/api.js` | API pour la mini-app |
| `routes/admin.js` | API pour le panel admin |
| `public/app.html` | Mini-app (la boutique) |
| `admin/panel.html` | Panel admin (gérer codes) |
| `models/` | Schémas MongoDB |

---

## ✅ Checklist avant production

- [ ] `.env` complètement rempli
- [ ] MongoDB en ligne et fonctionnel
- [ ] Bot Telegram créé et token copié
- [ ] Première commande de test faite en local
- [ ] Code pushé sur GitHub
- [ ] Déployé sur Railway / Render / VPS
- [ ] URL du bot configurée dans BotFather
- [ ] Mini-app ouvre via le bouton du bot
- [ ] Admin panel fonctionne

---

## 🎉 Après la mise en place

Les prochaines améliorations (optionnelles) :
- Ajouter plus d'enseignes de cartes
- Intégrer Stripe pour les paiements automatiques
- Ajouter des statistiques avancées
- Customiser le design
- Ajouter un système de codes de réduction

**Consultable :** README.md et SECURITY.md pour plus de détails.

---

**Questions ?** Contacte `@TonSupport` sur Telegram (à configurer) 🎁
