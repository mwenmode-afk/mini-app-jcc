# 📑 Index du Projet - Jérémy CC Bot

## Structure complète du projet

```
jcc-bot/
├── 📄 package.json           ← Dépendances Node.js
├── 📄 server.js              ← Serveur principal (Express)
├── 📄 config.js              ← Configuration centralisée
├── .env.example              ← Template de variables d'env
├── .gitignore                ← Fichiers à ignorer en git
│
├── 📁 models/                ← Schémas MongoDB
│   ├── User.js               ← Modèle utilisateur
│   ├── Order.js              ← Modèle commande
│   └── GiftCard.js           ← Modèle carte cadeau
│
├── 📁 routes/                ← Endpoints API
│   ├── api.js                ← API pour la mini-app
│   └── admin.js              ← API pour l'admin
│
├── 📁 public/                ← Frontend mini-app
│   └── app.html              ← Boutique Telegram
│
├── 📁 admin/                 ← Panel admin
│   └── panel.html            ← Interface admin
│
└── 📁 docs/                  ← Documentation
    ├── README.md             ← Guide complet
    ├── QUICKSTART.md         ← Démarrage rapide
    ├── SETUP_STEPS.md        ← Instructions détaillées
    ├── SECURITY.md           ← Guide de sécurité
    └── INDEX.md              ← Ce fichier
```

## Fichiers de configuration

### `.env` (À créer)
Variables d'environnement secrètes. Copie `.env.example` et remplis-le.

### `package.json`
Liste des dépendances npm. Exécute `npm install`.

### `config.js`
Configuration centralisée lue depuis `.env`. Valide les variables au démarrage.

## Fichiers de code

### Server (Backend)

**`server.js`**
- Démarre le serveur Express
- Connecte MongoDB
- Sert les fichiers statiques (mini-app, admin panel)
- Enregistre les routes

### Routes (API)

**`routes/api.js`**
- `GET /api/balance` — Solde utilisateur
- `POST /api/order` — Créer une commande
- `GET /api/orders` — Historique commandes
- `GET /api/stock` — Cartes disponibles

**`routes/admin.js`**
- `POST /admin/login` — Authentification
- `GET /admin/dashboard` — Statistiques
- `GET /admin/cards` — Liste codes
- `POST /admin/cards/add` — Ajouter codes
- `GET /admin/orders` — Commandes
- `POST /admin/orders/:id/status` — Changer statut

### Modèles (Base de données)

**`models/User.js`**
- Stores: telegramId, username, balance, orderCount, etc.

**`models/Order.js`**
- Stores: orderId, items, total, status, codes, etc.

**`models/GiftCard.js`**
- Stores: brand, amount, code, status, sellPrice, etc.

## Fichiers Frontend

### Mini-App

**`public/app.html`**
- Page que voient les utilisateurs dans Telegram
- 14 enseignes (Nike, Netflix, Spotify, etc.)
- Recherche, filtres, panier
- Appelle l'API backend

### Panel Admin

**`admin/panel.html`**
- Interface pour gérer les codes et commandes
- Login avec mot de passe
- Dashboard avec statistiques
- Gestion du stock
- Gestion des commandes

## Documentation

### Démarrage

- **QUICKSTART.md** ⚡ — 5 minutes pour tout mettre en place
- **SETUP_STEPS.md** 🎯 — Instructions détaillées étape par étape

### Référence

- **README.md** 📖 — Guide complet avec tous les détails
- **SECURITY.md** 🔒 — Best practices de sécurité

## Flux de données

```
1. Utilisateur Telegram
        ↓
2. Ouvre la mini-app (public/app.html)
        ↓
3. Mini-app appelle l'API (routes/api.js)
        ↓
4. API écrit en MongoDB (models/*)
        ↓
5. Admin consulte le panel (admin/panel.html)
        ↓
6. Admin appelle l'API admin (routes/admin.js)
        ↓
7. Envoie les codes à l'utilisateur (manuel pour l'instant)
```

## Variables d'environnement (.env)

| Variable | Exemple | Rôle |
|----------|---------|------|
| `TELEGRAM_BOT_TOKEN` | `6789123456:ABC...` | Token du bot Telegram |
| `TELEGRAM_ADMIN_ID` | `123456789` | ID Telegram de l'admin |
| `MONGODB_URI` | `mongodb+srv://...` | Chaîne de connexion BD |
| `JWT_SECRET` | `abc123...` | Clé secrète JWT (32+ chars) |
| `ADMIN_PASSWORD` | `admin123` | Mot de passe admin |
| `PORT` | `3000` | Port du serveur |
| `NODE_ENV` | `production` | Mode (development/production) |

## URLs d'accès

| URL | Accès | Rôle |
|-----|-------|------|
| `http://localhost:3000/health` | Public | Status serveur |
| `http://localhost:3000/app` | Public | Mini-app (boutique) |
| `http://localhost:3000/admin` | Admin | Panel admin |
| `http://localhost:3000/api/*` | App | API rest |

## Prochaines étapes

Après la mise en place :

- [ ] Déployer sur Railway / Render
- [ ] Ajouter plus d'enseignes
- [ ] Intégrer Stripe (paiements automatiques)
- [ ] Ajouter un webhook Telegram
- [ ] Ajouter des codes de réduction
- [ ] Améliorer le design mobile

## Support

Questions ?
- 📖 Lis SETUP_STEPS.md
- 🔒 Consulte SECURITY.md pour les problèmes de sécurité
- ✉️ Contact : @TonSupport sur Telegram

---

**Créé pour Jérémy CC** 🎁
