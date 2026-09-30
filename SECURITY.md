# 🔒 Guide de Sécurité - Jérémy CC Bot

Ce guide couvre les meilleures pratiques de sécurité pour l'application.

## 1. Variables d'Environnement

**JAMAIS ne mets tes secrets en dur dans le code.**

✅ **Bon** :
```javascript
const token = process.env.TELEGRAM_BOT_TOKEN;
```

❌ **Mauvais** :
```javascript
const token = '6789123456:ABCDEFGH...'; // NE PAS FAIRE ÇA
```

### Variables sensibles à protéger

- `TELEGRAM_BOT_TOKEN` - Token du bot (accès complet au bot)
- `MONGODB_URI` - Chaîne de connexion BD
- `JWT_SECRET` - Clé de signature JWT
- `ADMIN_PASSWORD` - Mot de passe admin

**Comment générer une clé sécurisée :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 2. Authentification

### Admin Panel

- Login avec mot de passe → JWT token (7 jours)
- Token stocké en `localStorage` (risque XSS si CDN externe)
- Token validé sur chaque requête

**À améliorer :**
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting sur /admin/login
- [ ] Logs d'accès admin

### Mini-App (Utilisateurs)

- Pas de login classique
- Validation via `x-telegram-id` header
- **En production : valider la signature initData avec le bot token**

```javascript
// Exemple validation (à implémenter)
function validateTelegramData(initData, botToken) {
  // Implémente la validation selon la doc Telegram
  // https://core.telegram.org/bots/webapps#validating-data-received-from-the-web-app
}
```

## 3. Base de Données

### MongoDB

✅ **Pratiques sécurisées :**
- Authentification username/password
- IP whitelist (MongoDB Atlas)
- Pas d'accès public
- Indexes sur les champs sensibles

```javascript
// Chaîne de connexion sécurisée
// mongodb+srv://username:password@cluster.mongodb.net/dbname
```

❌ **Risques :**
- Connection string en clair dans le code
- Pas de backup régulier
- Pas de chiffrement au repos

### Injection MongoDB

❌ **Vulnérable** :
```javascript
User.find({ name: userInput }); // userInput peut contenir du code
```

✅ **Sûr** :
```javascript
User.find({ name: userInput }); // Mongoose échappe automatiquement
```

## 4. API Security

### CORS

```javascript
app.use(cors({
  origin: ['https://tondomaine.com', 'https://app.tondomaine.com'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**À faire :**
- ✅ Limite les origins en production
- ✅ Accepte seulement GET/POST/PUT/DELETE nécessaires
- ✅ Valide tous les headers

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requêtes par IP
  message: 'Trop de requêtes, réessaie plus tard'
});

app.use('/api/', limiter);
app.use('/admin/login', rateLimit({ max: 5 })); // Plus strict pour login
```

### Validation des Données

```javascript
// Valide toujours les entrées
if (!req.body.email || !req.body.email.includes('@')) {
  return res.status(400).json({ error: 'Email invalide' });
}

// Utilise des validators
import validator from 'validator';
if (!validator.isEmail(email)) return res.status(400).json({ error: 'Email invalide' });
```

## 5. Codes Cadeaux

### Stockage des Codes

**Jamais afficher les codes aux utilisateurs avant paiement.**

```javascript
// ❌ Mauvais : le code est visible
res.json({ code: '1234-5678-9012' });

// ✅ Bon : l'admin envoie les codes manuellement
// Codes visibles SEULEMENT dans l'admin panel (authentifié)
```

### Protection des Codes

- Codes hashés en BD (comme les mots de passe)
- PIN stocké chiffré si présent
- Logs d'accès aux codes

```javascript
import bcrypt from 'bcryptjs';

// Avant de sauvegarder
card.code = await bcrypt.hash(realCode, 10);

// Pour vérifier
const isValid = await bcrypt.compare(userInput, card.code);
```

## 6. Webhook Telegram (Futur)

Si tu utilises les webhooks au lieu du polling :

```javascript
app.post('/webhook', (req, res) => {
  // Valide le secret Telegram
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== req.headers['x-telegram-bot-api-secret-token']) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Traite la requête
  res.json({ ok: true });
});
```

Utilise HTTPS obligatoirement avec les webhooks.

## 7. Logs et Monitoring

### Logs importants

```javascript
console.log(`[${new Date().toISOString()}] Admin login: ${adminId}`);
console.log(`Order created: #${orderId} from user ${telegramId}`);
console.log(`Codes added: ${count} for ${brand}`);
```

### À logger

- ✅ Tentatives de login admin
- ✅ Création/modification de commandes
- ✅ Ajout de codes
- ✅ Erreurs d'API
- ✅ Accès non autorisé

### À NE PAS logger

- ❌ Mots de passe
- ❌ Tokens JWT
- ❌ Clés d'API
- ❌ Données sensibles d'utilisateurs

## 8. HTTPS et Déploiement

### Obligatoire en production

- ✅ Certificat SSL/TLS valide
- ✅ Redirection HTTP → HTTPS
- ✅ Headers de sécurité

```javascript
app.use((req, res, next) => {
  // Force HTTPS en production
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});

// Headers de sécurité
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Déploiement sécurisé

- ✅ Variables d'env séparé (pas dans git)
- ✅ `.gitignore` : `.env`, `node_modules`, `logs/`
- ✅ Backup régulier de MongoDB
- ✅ Monitoring des erreurs (Sentry, etc.)

## 9. Checklist de Sécurité

Avant de deployer en production :

- [ ] `.env` non committé dans git
- [ ] `NODE_ENV=production`
- [ ] HTTPS activé
- [ ] CORS limité aux domaines autorisés
- [ ] Rate limiting sur les endpoints sensibles
- [ ] Validation des données entrantes
- [ ] MongoDB authentifié + IP whitelist
- [ ] JWT secret fort (32+ caractères)
- [ ] Admin password fort
- [ ] Backup MongoDB configuré
- [ ] Logs importants activés
- [ ] Secrets Telegram masqués
- [ ] Codes cadeaux jamais en clair

## 10. Gestion des Incidents

### Si ton bot token fuit

1. Va sur BotFather → `/revoke_token`
2. Génère un nouveau token immédiatement
3. Met à jour `.env` et redémarre
4. Notifie les utilisateurs si nécessaire

### Si MongoDB est compromise

1. Change le mot de passe MongoDB
2. Crée une nouvelle base de données
3. Restaure depuis un backup (récent !)
4. Revérifie toutes les données

### Si l'admin password fuit

1. Change-le dans `.env`
2. Redémarre l'application
3. Vérifie les logs d'accès admin

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [Telegram Bot Security](https://core.telegram.org/bots/api-security)

---

**Rappel :** La sécurité n'est jamais "terminée". Audite régulièrement, mets à jour tes dépendances, et reste vigilant ! 🛡️
