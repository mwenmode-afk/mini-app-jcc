import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Stockage en mémoire
let cards = [];
let orders = [];

function readCards() {
  return cards;
}

function writeCards(newCards) {
  cards = newCards;
}

function readOrders() {
  return orders;
}

function writeOrders(newOrders) {
  orders = newOrders;
}

function writeOrders(orders) {
  fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));
}

app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#101a3c">
<title>Jérémy CC · Cartes cadeaux</title>
<script src="https://telegram.org/js/telegram-web-app.js"><\/script>
<style>
:root{--bg1:#12204a; --bg2:#1a2258; --bg3:#2a1f5c; --glass:rgba(34,50,110,.52); --txt:#eef2ff; --blue:#3d63e6; --blue-hi:#7fa2ff;}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg1);color-scheme:dark}
body{font-family:system-ui,-apple-system,Roboto,sans-serif;color:var(--txt);min-height:100vh;background:linear-gradient(165deg,var(--bg1),var(--bg2) 55%,var(--bg3));padding:20px;}
.wrap{max-width:560px;margin:0 auto}
.head{text-align:center;padding:20px 0}
.head .name{font-weight:800;font-size:18px;color:var(--blue-hi);text-transform:uppercase}
.glass{background:var(--glass);border:1px solid rgba(122,152,255,.30);border-radius:16px;padding:30px;text-align:center;backdrop-filter:blur(16px)}
.glass h2{margin:10px 0;font-size:24px}
.glass p{margin:8px 0;color:#93a4d6;font-size:14px}
.card{background:rgba(61,99,230,.1);border:1px solid rgba(61,99,230,.3);border-radius:12px;padding:15px;margin:10px 0;text-align:left}
.card-brand{font-weight:800;color:var(--blue-hi);font-size:16px}
.card-price{font-size:20px;font-weight:800;color:#5fe3a6;margin:8px 0}
.card-code{font-family:monospace;color:#93a4d6;font-size:12px;word-break:break-all}
.cta{width:100%;height:50px;margin-top:20px;border-radius:14px;background:var(--blue);color:white;border:none;font-weight:800;cursor:pointer}
.cta:hover{filter:brightness(1.1)}
.empty{color:#93a4d6;padding:20px;text-align:center}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div class="name">Jérémy CC</div>
  </div>
  <div class="glass">
    <h2>🎁 Cartes Cadeaux</h2>
    <div id="codes"></div>
  </div>
</div>

<script>
const tg = window.Telegram?.WebApp;
if(tg) {
  tg.ready();
  tg.expand();
}

async function loadCodes() {
  try {
    const res = await fetch('/api/cards');
    const cards = await res.json();
    const codesDiv = document.getElementById('codes');
    
    if(!cards.length) {
      codesDiv.innerHTML = '<div class="empty">Aucun code disponible</div>';
      return;
    }
    
    codesDiv.innerHTML = cards
      .filter(c => c.status === 'available')
      .map(c => \`
        <div class="card">
          <div class="card-brand">\${c.brand}</div>
          <div class="card-price">\${c.amount}€</div>
          <div class="card-code">\${c.code}</div>
        </div>
      \`).join('');
  } catch(e) {
    document.getElementById('codes').innerHTML = '<div class="empty">Erreur de chargement</div>';
  }
}

loadCodes();
setInterval(loadCodes, 5000);
<\/script>
</body>
</html>`;
  res.send(html);
});
app.get('/admin', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin - Jérémy CC</title>
<style>
:root{--bg:#12204a;--txt:#eef2ff;--blue:#3d63e6;--glass:rgba(34,50,110,.52)}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg);color-scheme:dark}
body{font-family:system-ui,-apple-system,Roboto,sans-serif;color:var(--txt);background:linear-gradient(165deg,var(--bg),#1a2258 55%,#2a1f5c);min-height:100vh;padding:20px}
.container{max-width:900px;margin:0 auto}
.header{text-align:center;padding:30px 0}
.header h1{font-size:28px;margin-bottom:5px}
.header p{color:#93a4d6;font-size:14px}
.glass{background:var(--glass);border:1px solid rgba(122,152,255,.30);border-radius:14px;padding:25px;margin:20px 0;backdrop-filter:blur(16px)}
.login-form{max-width:400px;margin:0 auto}
.input-group{margin-bottom:15px}
.input-group label{display:block;font-size:12px;font-weight:700;color:#7fa2ff;margin-bottom:5px;text-transform:uppercase}
.input-group input{width:100%;padding:12px;border:1px solid rgba(122,152,255,.30);border-radius:8px;background:rgba(0,0,0,.2);color:var(--txt);font-size:14px}
.input-group input:focus{outline:none;border-color:var(--blue)}
button{width:100%;padding:12px;background:var(--blue);color:white;border:none;border-radius:8px;font-weight:800;cursor:pointer;margin-top:10px;font-size:14px}
button:hover{filter:brightness(1.1)}
button.small{width:auto;padding:6px 12px;font-size:12px;margin:0}
button.danger{background:#ff6b6b}
.tabs{display:flex;gap:10px;margin:20px 0;flex-wrap:wrap}
.tab-btn{padding:10px 16px;background:rgba(34,50,110,.52);border:1px solid rgba(122,152,255,.30);border-radius:8px;color:var(--txt);cursor:pointer;font-size:13px}
.tab-btn.active{background:var(--blue);border-color:var(--blue)}
.tab-content{display:none}
.tab-content.active{display:block}
table{width:100%;border-collapse:collapse;margin-top:15px;font-size:13px}
table th{padding:12px;text-align:left;border-bottom:1px solid rgba(122,152,255,.30);font-weight:700;color:#7fa2ff}
table td{padding:12px;border-bottom:1px solid rgba(122,152,255,.30)}
.msg{padding:15px;border-radius:8px;margin:10px 0;text-align:center;font-size:14px}
.msg.success{background:rgba(95,227,166,.1);color:#5fe3a6}
.msg.error{background:rgba(255,107,107,.1);color:#ff6b6b}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin:20px 0}
.stat{background:rgba(95,227,166,.1);padding:20px;border-radius:8px;text-align:center}
.stat-num{font-size:28px;font-weight:800;color:#5fe3a6}
.stat-label{font-size:12px;color:#93a4d6;margin-top:5px}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🔐 Panel Admin</h1>
    <p>Gère tes codes cadeaux</p>
  </div>

  <div id="loginPanel" class="glass login-form">
    <div class="input-group">
      <label>Username</label>
      <input type="text" id="username" placeholder="admin">
    </div>
    <div class="input-group">
      <label>Password</label>
      <input type="password" id="password" placeholder="Mot de passe">
    </div>
    <button onclick="login()">Se connecter</button>
    <div id="loginMsg"></div>
  </div>

  <div id="adminPanel" style="display:none">
    <div class="tabs">
      <button class="tab-btn active" onclick="showTab(event, 'dashboard')">📊 Dashboard</button>
      <button class="tab-btn" onclick="showTab(event, 'add')">➕ Ajouter</button>
      <button class="tab-btn" onclick="showTab(event, 'codes')">📝 Codes</button>
      <button class="tab-btn danger" onclick="logout()">Déconnexion</button>
    </div>

    <div id="dashboard" class="tab-content active glass">
      <h2>📊 Dashboard</h2>
      <div class="stats">
        <div class="stat">
          <div class="stat-num" id="totalCards">0</div>
          <div class="stat-label">Codes totaux</div>
        </div>
        <div class="stat">
          <div class="stat-num" id="availableCards">0</div>
          <div class="stat-label">Disponibles</div>
        </div>
        <div class="stat">
          <div class="stat-num" id="soldCards">0</div>
          <div class="stat-label">Vendus</div>
        </div>
      </div>
    </div>

    <div id="add" class="tab-content glass">
      <h2>➕ Ajouter un code cadeau</h2>
      <div class="input-group">
        <label>Marque</label>
        <input type="text" id="brandInput" placeholder="Amazon">
      </div>
      <div class="input-group">
        <label>Montant (€)</label>
        <input type="number" id="amountInput" placeholder="25">
      </div>
      <div class="input-group">
        <label>Code</label>
        <input type="text" id="codeInput" placeholder="ABC123">
      </div>
      <button onclick="addCode()">Ajouter</button>
      <div id="addMsg"></div>
    </div>

    <div id="codes" class="tab-content glass">
      <h2>📝 Tous les codes</h2>
      <table id="codesTable">
        <thead>
          <tr>
            <th>Marque</th>
            <th>Montant</th>
            <th>Code</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</div>

<script>
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'SecureAdminPass2024!$';
let authenticated = false;

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const msg = document.getElementById('loginMsg');
  
  if(user === ADMIN_USER && pass === ADMIN_PASS) {
    authenticated = true;
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadDashboard();
  } else {
    msg.innerHTML = '<div class="msg error">❌ Identifiants incorrects</div>';
  }
}

function logout() {
  authenticated = false;
  document.getElementById('loginPanel').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function showTab(e, tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  e.target.classList.add('active');
  
  if(tab === 'codes') loadCodes();
  if(tab === 'dashboard') loadDashboard();
}

async function loadDashboard() {
  try {
    const res = await fetch('/api/cards');
    const cards = await res.json();
    const total = cards.length;
    const available = cards.filter(c => c.status === 'available').length;
    const sold = cards.filter(c => c.status === 'sold').length;
    
    document.getElementById('totalCards').textContent = total;
    document.getElementById('availableCards').textContent = available;
    document.getElementById('soldCards').textContent = sold;
  } catch(e) {
    console.error(e);
  }
}

async function addCode() {
  const brand = document.getElementById('brandInput').value;
  const amount = document.getElementById('amountInput').value;
  const code = document.getElementById('codeInput').value;
  const msg = document.getElementById('addMsg');
  
  if(!brand || !amount || !code) {
    msg.innerHTML = '<div class="msg error">❌ Remplis tous les champs</div>';
    return;
  }
  
  try {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({brand, amount: Number(amount), code})
    });
    
    if(res.ok) {
      msg.innerHTML = '<div class="msg success">✅ Code ajouté!</div>';
      document.getElementById('brandInput').value = '';
      document.getElementById('amountInput').value = '';
      document.getElementById('codeInput').value = '';
      setTimeout(() => msg.innerHTML = '', 2000);
      loadDashboard();
    }
  } catch(e) {
    msg.innerHTML = '<div class="msg error">❌ Erreur</div>';
  }
}

async function loadCodes() {
  try {
    const res = await fetch('/api/cards');
    const cards = await res.json();
    const tbody = document.querySelector('#codesTable tbody');
    
    if(!cards.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Aucun code</td></tr>';
      return;
    }
    
    tbody.innerHTML = cards.map(c => \`
      <tr>
        <td>\${c.brand}</td>
        <td>\${c.amount}€</td>
        <td>\${c.code}</td>
        <td>\${c.status === 'available' ? '✅' : '❌'}</td>
        <td><button class="small danger" onclick="deleteCode('\${c.id}')">X</button></td>
      </tr>
    \`).join('');
  } catch(e) {
    console.error(e);
  }
}

async function deleteCode(id) {
  if(!confirm('Supprimer?')) return;
  try {
    await fetch('/api/cards/' + id, {method: 'DELETE'});
    loadCodes();
    loadDashboard();
  } catch(e) {
    alert('Erreur');
  }
}
<\/script>
</body>
</html>`;
  res.send(html);
});

app.post('/api/cards', (req, res) => {
  try {
    const { brand, amount, code } = req.body;
    const cards = readCards();
    const newCard = {
      id: Date.now().toString(),
      brand,
      amount,
      code,
      status: 'available',
      createdAt: new Date().toISOString()
    };
    cards.push(newCard);
    writeCards(cards);
    res.json({ success: true, card: newCard });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/cards', (req, res) => {
  try {
    const cards = readCards();
    res.json(cards.reverse());
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/cards/:id', (req, res) => {
  try {
    const cards = readCards();
    const filtered = cards.filter(c => c.id !== req.params.id);
    writeCards(filtered);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
