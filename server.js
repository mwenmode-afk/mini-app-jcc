import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Stockage simple en mémoire
let cardsDB = [];

// Mini-app
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#101a3c">
<title>Jérémy CC</title>
<script src="https://telegram.org/js/telegram-web-app.js"><\/script>
<style>
:root{--bg1:#12204a; --bg2:#1a2258; --bg3:#2a1f5c; --glass:rgba(34,50,110,.52); --txt:#eef2ff; --blue:#3d63e6; --blue-hi:#7fa2ff;}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg1);color-scheme:dark}
body{font-family:system-ui,-apple-system,Roboto,sans-serif;color:var(--txt);min-height:100vh;background:linear-gradient(165deg,var(--bg1),var(--bg2) 55%,var(--bg3));padding:20px;}
.wrap{max-width:560px;margin:0 auto}
.head{text-align:center;padding:20px 0}
.head .name{font-weight:800;font-size:18px;color:var(--blue-hi);text-transform:uppercase}
.glass{background:var(--glass);border:1px solid rgba(122,152,255,.30);border-radius:16px;padding:30px;backdrop-filter:blur(16px)}
.glass h2{margin:10px 0;font-size:24px;color:var(--txt)}
.card{background:rgba(61,99,230,.2);border:1px solid rgba(61,99,230,.5);border-radius:12px;padding:15px;margin:10px 0;text-align:left}
.card-brand{font-weight:800;color:var(--blue-hi);font-size:16px}
.card-price{font-size:22px;font-weight:800;color:#5fe3a6;margin:8px 0}
.card-code{font-family:monospace;color:#93a4d6;font-size:12px;word-break:break-all;background:rgba(0,0,0,.2);padding:8px;border-radius:4px;margin-top:8px}
.empty{color:#93a4d6;padding:20px;text-align:center;font-size:14px}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div class="name">Jérémy CC</div>
  </div>
  <div class="glass">
    <h2>🎁 Cartes</h2>
    <div id="codes"></div>
  </div>
</div>

<script>
const tg = window.Telegram?.WebApp;
if(tg) { tg.ready(); tg.expand(); }

async function load() {
  try {
    const res = await fetch('/api/cards');
    const cards = await res.json();
    const div = document.getElementById('codes');
    
    if(!cards || cards.length === 0) {
      div.innerHTML = '<div class="empty">Aucun code</div>';
      return;
    }
    
    div.innerHTML = cards.map(c => \`
      <div class="card">
        <div class="card-brand">\${c.brand}</div>
        <div class="card-price">\${c.amount}€</div>
        <div class="card-code">Code: \${c.code}</div>
      </div>
    \`).join('');
  } catch(e) {
    document.getElementById('codes').innerHTML = '<div class="empty">Erreur</div>';
  }
}

load();
setInterval(load, 3000);
<\/script>
</body>
</html>`);
});

// Panel admin
app.get('/admin', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin</title>
<style>
:root{--bg:#12204a;--txt:#eef2ff;--blue:#3d63e6;--glass:rgba(34,50,110,.52)}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg);color-scheme:dark}
body{font-family:system-ui,-apple-system,Roboto,sans-serif;color:var(--txt);background:linear-gradient(165deg,var(--bg),#1a2258 55%,#2a1f5c);min-height:100vh;padding:20px}
.container{max-width:900px;margin:0 auto}
.header{text-align:center;padding:30px 0}
.header h1{font-size:28px;margin-bottom:5px}
.glass{background:var(--glass);border:1px solid rgba(122,152,255,.30);border-radius:14px;padding:25px;margin:20px 0;backdrop-filter:blur(16px)}
.login-form{max-width:400px;margin:0 auto}
.input-group{margin-bottom:15px}
.input-group label{display:block;font-size:12px;font-weight:700;color:#7fa2ff;margin-bottom:5px;text-transform:uppercase}
.input-group input{width:100%;padding:12px;border:1px solid rgba(122,152,255,.30);border-radius:8px;background:rgba(0,0,0,.2);color:var(--txt);font-size:14px}
.input-group input:focus{outline:none;border-color:var(--blue)}
button{width:100%;padding:12px;background:var(--blue);color:white;border:none;border-radius:8px;font-weight:800;cursor:pointer;margin-top:10px}
button:hover{filter:brightness(1.1)}
button.small{width:auto;padding:6px 12px;font-size:12px;margin:0}
button.danger{background:#ff6b6b}
.tabs{display:flex;gap:10px;margin:20px 0;flex-wrap:wrap}
.tab-btn{padding:10px 16px;background:rgba(34,50,110,.52);border:1px solid rgba(122,152,255,.30);border-radius:8px;color:var(--txt);cursor:pointer}
.tab-btn.active{background:var(--blue)}
.tab-content{display:none}
.tab-content.active{display:block}
table{width:100%;border-collapse:collapse;margin-top:15px;font-size:13px}
table th{padding:12px;text-align:left;border-bottom:1px solid rgba(122,152,255,.30);font-weight:700;color:#7fa2ff}
table td{padding:12px;border-bottom:1px solid rgba(122,152,255,.30)}
.msg{padding:15px;border-radius:8px;margin:10px 0;text-align:center}
.msg.success{background:rgba(95,227,166,.1);color:#5fe3a6}
.msg.error{background:rgba(255,107,107,.1);color:#ff6b6b}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🔐 Admin Panel</h1>
  </div>

  <div id="loginPanel" class="glass login-form">
    <div class="input-group">
      <label>Username</label>
      <input type="text" id="username" placeholder="admin">
    </div>
    <div class="input-group">
      <label>Password</label>
      <input type="password" id="password" placeholder="password">
    </div>
    <button onclick="login()">Login</button>
    <div id="loginMsg"></div>
  </div>

  <div id="adminPanel" style="display:none">
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab(event, 'add')">➕ Add Code</button>
      <button class="tab-btn" onclick="switchTab(event, 'list')">📝 List</button>
      <button class="tab-btn danger" onclick="logout()">Logout</button>
    </div>

    <div id="add" class="tab-content active glass">
      <h2>Add Gift Card</h2>
      <div class="input-group">
        <label>Brand</label>
        <input type="text" id="brand" placeholder="Amazon">
      </div>
      <div class="input-group">
        <label>Amount (€)</label>
        <input type="number" id="amount" placeholder="25">
      </div>
      <div class="input-group">
        <label>Code</label>
        <input type="text" id="code" placeholder="ABC123XYZ">
      </div>
      <button onclick="addCode()">Add</button>
      <div id="addMsg"></div>
    </div>

    <div id="list" class="tab-content glass">
      <h2>Codes List</h2>
      <table id="table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Amount</th>
            <th>Code</th>
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
let auth = false;

function login() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if(u === ADMIN_USER && p === ADMIN_PASS) {
    auth = true;
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadList();
  } else {
    document.getElementById('loginMsg').innerHTML = '<div class="msg error">❌ Wrong</div>';
  }
}

function logout() {
  auth = false;
  document.getElementById('loginPanel').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

function switchTab(e, tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  e.target.classList.add('active');
  if(tab === 'list') loadList();
}

async function addCode() {
  const brand = document.getElementById('brand').value;
  const amount = document.getElementById('amount').value;
  const code = document.getElementById('code').value;
  const msg = document.getElementById('addMsg');
  
  if(!brand || !amount || !code) {
    msg.innerHTML = '<div class="msg error">❌ Fill all fields</div>';
    return;
  }
  
  const res = await fetch('/api/cards', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({brand, amount: Number(amount), code})
  });
  
  if(res.ok) {
    msg.innerHTML = '<div class="msg success">✅ Added!</div>';
    document.getElementById('brand').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('code').value = '';
    loadList();
  }
}

async function loadList() {
  const res = await fetch('/api/cards');
  const cards = await res.json();
  const tbody = document.querySelector('#table tbody');
  
  tbody.innerHTML = cards.map(c => \`
    <tr>
      <td>\${c.brand}</td>
      <td>\${c.amount}€</td>
      <td>\${c.code}</td>
      <td><button class="small danger" onclick="del('\${c.id}')">X</button></td>
    </tr>
  \`).join('');
}

async function del(id) {
  if(!confirm('Delete?')) return;
  await fetch('/api/cards/' + id, {method: 'DELETE'});
  loadList();
}
<\/script>
</body>
</html>`);
});

// API
app.post('/api/cards', (req, res) => {
  const { brand, amount, code } = req.body;
  const card = {
    id: Date.now().toString(),
    brand,
    amount,
    code,
    status: 'available',
    createdAt: new Date().toISOString()
  };
  cardsDB.push(card);
  res.json({ success: true, card });
});

app.get('/api/cards', (req, res) => {
  res.json(cardsDB);
});

app.delete('/api/cards/:id', (req, res) => {
  cardsDB = cardsDB.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Running on ${PORT}`));
