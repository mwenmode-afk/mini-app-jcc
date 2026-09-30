# 🚀 Déploiement Railway - 5 Clics

## Infos à retenir
- **Email Railway**: mikosspro@gmail.com
- **Admin Password**: `SecureAdminPass2024!$`
- **Admin Username**: `admin`

---

## ÉTAPE 1 : Se connecter à Railway

1. Va sur https://railway.app
2. Clique **"Sign Up"** (en haut à droite)
3. Clique **"Continue with GitHub"**
4. Log-toi avec GitHub (crée un compte si tu n'en as pas)
5. Autorise Railway à accéder à GitHub

---

## ÉTAPE 2 : Créer un nouveau projet

1. Une fois connecté, clique **"Create New"**
2. Clique **"Deploy from GitHub Repo"**
3. Si tu dois autoriser, clique **"Authorize Railway"**

---

## ÉTAPE 3 : Importer ton code

**Option A : Depuis GitHub (recommandé)**
1. Va sur https://github.com/new
2. Crée un repo appelé `jeremy-cc-bot`
3. Upload les fichiers du dossier `jcc-bot/`
4. Dans Railway, sélectionne ce repo
5. Clique **"Deploy Now"**

**Option B : Depuis un ZIP (plus facile)**
1. Va dans le dossier `jcc-bot/`
2. Zipe tous les fichiers (clic droit → "Compress")
3. Sur Railway, clique **"Import from GitHub"** → **"Or, connect a template"**
4. Upload le ZIP

---

## ÉTAPE 4 : Configurer les variables d'environnement

Railway va te demander les variables. **COPIE-COLLE** depuis le `.env` :

```
BOT_TOKEN=8785414196:AAFnLDUUGIV_9BGH82-lJITTJBl752ln_U4
TELEGRAM_ID=7690325184
MONGODB_URI=mongodb+srv://mikosspro_db_user:Claude.95@cluster0.d2hinvr.mongodb.net/jeremy-cc
ADMIN_PASSWORD=SecureAdminPass2024!$
ADMIN_USERNAME=admin
JWT_SECRET=gkPr9mX2nL5qVwZbYhJ8RdFvT3CsNqM7WpLjHb2Xw5E9k4D1yFz
PORT=3000
NODE_ENV=production
```

Clique **"Deploy"**

---

## ÉTAPE 5 : Attendre (2-3 minutes)

Laisse Railway builder et déployer. Tu veras :
```
✅ Build successful
✅ Deployment successful
🎉 Your app is live!
```

---

## ÉTAPE 6 : Récupérer l'URL

1. Une fois déployé, Railway va te donner une URL du style :
   ```
   https://jeremy-cc-bot.railway.app
   ```
2. **Copie cette URL**, tu vas l'utiliser après

---

## ÉTAPE 7 : Configurer le Bot Telegram

1. Va sur https://t.me/BotFather
2. Tape `/setmenubutton`
3. Sélectionne ton bot `JeremyCC_Bot`
4. Dans la popup, mets : `https://jeremy-cc-bot.railway.app`
5. Telegram va créer un bouton "Mini App" dans ton bot

---

## 🎉 C'EST BON !

- **Bot Telegram**: Clique sur le bouton "Mini App"
- **Admin Panel**: Va sur `https://jeremy-cc-bot.railway.app/admin`
  - Login: `admin`
  - Password: `SecureAdminPass2024!$`

---

## En cas de problème

Si le deploy échoue :
1. Clique sur **"Logs"** dans Railway
2. Envoie-moi les erreurs rouges

Si le MongoDB ne se connecte pas :
1. Va dans MongoDB Atlas → Security → Network Access
2. Ajoute l'IP de Railway : `0.0.0.0/0` (permet toutes les IP)

---

**Voilà, c'est tout ! 🚀**
