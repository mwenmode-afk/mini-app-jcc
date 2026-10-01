import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

let cards = [];

app.get('/', (req, res) => {
  res.type('text/html').send('<html><head><meta charset="utf-8"><style>body{background:#12204a;color:#eef2ff;font-family:system-ui;padding:20px}.wrap{max-width:560px;margin:0 auto}.head{text-align:center;padding:20px 0}.name{font-weight:800;font-size:18px;color:#7fa2ff;text-transform:uppercase}.glass{background:rgba(34,50,110,.52);border:1px solid rgba(122,152,255,.30);border-radius:16px;padding:30px;text-align:center}.card{background:rgba(61,99,230,.2);border:1px solid rgba(61,99,230,.5);border-radius:12px;padding:15px;margin:10px 0;text-align:left}.card-brand{font-weight:800;color:#7fa2ff;font-size:16px}.card-price{font-size:22px;font-weight:800;color:#5fe3a6;margin:8px 0}.card-code{font-family:monospace;color:#93a4d6;font-size:12px;background:rgba(0,0,0,.2);padding:8px;border-radius:4px;margin-top:8px}.empty{color:#93a4d6;padding:20px;text-align:center}</style></head><body><div class="wrap"><div class="head"><div class="name">Jeremy CC</div></div><div class="glass"><h2>Gift Cards</h2><div id="codes">Loading...</div></div></div><script>fetch("/api/cards").then(r=>r.json()).then(c=>{const d=document.getElementById("codes");if(!c.length){d.innerHTML=\'<div class="empty">No codes</div>\';return}d.innerHTML=c.map(x=>`<div class="card"><div class="card-brand">${x.brand}</div><div class="card-price">${x.amount}EUR</div><div class="card-code">Code: ${x.code}</div></div>`).join("")}).catch(()=>{document.getElementById("codes").innerHTML=\'<div class="empty">Error</div>\'})</script></body></html>');
});

app.get('/admin', (req, res) => {
  res.type('text/html').send('<html><head><meta charset="utf-8"><style>body{background:#12204a;color:#eef2ff;font-family:system-ui;padding:20px}.container{max-width:900px;margin:0 auto}.glass{background:rgba(34,50,110,.52);border:1px solid rgba(122,152,255,.30);border-radius:14px;padding:25px;margin:20px 0}.input-group{margin-bottom:15px}label{display:block;font-size:12px;font-weight:700;color:#7fa2ff;margin-bottom:5px}input{width:100%;padding:12px;border:1px solid rgba(122,152,255,.30);border-radius:8px;background:rgba(0,0,0,.2);color:#eef2ff}button{width:100%;padding:12px;background:#3d63e6;color:white;border:none;border-radius:8px;font-weight:800;cursor:pointer;margin-top:10px}button:hover{filter:brightness(1.1)}.tabs{display:flex;gap:10px;margin:20px 0}.tab-btn{padding:10px 16px;background:rgba(34,50,110,.52);border:1px solid rgba(122,152,255,.30);border-radius:8px;color:#eef2ff;cursor:pointer}.tab-btn.active{background:#3d63e6}.tab-content{display:none}.tab-content.active{display:block}table{width:100%;border-collapse:collapse;margin-top:15px;font-size:13px}th,td{padding:12px;text-align:left;border-bottom:1px solid rgba(122,152,255,.30)}.msg{padding:15px;border-radius:8px;margin:10px 0;text-align:center}.success{background:rgba(95,227,166,.1);color:#5fe3a6}.error{background:rgba(255,107,107,.1);color:#ff6b6b}.danger{background:#ff6b6b}.small{width:auto;padding:6px 12px;font-size:12px}</style></head><body><div class="container"><h1 style="text-align:center">Admin Panel</h1><div id="loginPanel" class="glass"><div class="input-group"><label>Username</label><input type="text" id="username" placeholder="admin"></div><div class="input-group"><label>Password</label><input type="password" id="password" placeholder="password"></div><button onclick="login()">Login</button><div id="loginMsg"></div></div><div id="adminPanel" style="display:none"><div class="tabs"><button class="tab-btn active" onclick="switchTab(event,\'add\')">Add Code</button><button class="tab-btn" onclick="switchTab(event,\'list\')">List</button><button class="tab-btn danger" onclick="logout()">Logout</button></div><div id="add" class="tab-content active glass"><h2>Add Card</h2><div class="input-group"><label>Brand</label><input type="text" id="brand" placeholder="Amazon"></div><div class="input-group"><label>Amount</label><input type="number" id="amount" placeholder="25"></div><div class="input-group"><label>Code</label><input type="text" id="code" placeholder="ABC123"></div><button onclick="addCode()">Add</button><div id="addMsg"></div></div><div id="list" class="tab-content glass"><h2>Codes</h2><table id="table"><thead><tr><th>Brand</th><th>Amount</th><th>Code</th><th>Action</th></tr></thead><tbody></tbody></table></div></div></div><script>function login(){const u=document.getElementById("username").value;const p=document.getElementById("password").value;if(u==="admin"&&p==="SecureAdminPass2024!$"){document.getElementById("loginPanel").style.display="none";document.getElementById("adminPanel").style.display="block";loadList()}else{document.getElementById("loginMsg").innerHTML=\'<div class="msg error">Wrong</div>\'}}function logout(){document.getElementById("loginPanel").style.display="block";document.getElementById("adminPanel").style.display="none"}function switchTab(e,tab){document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active"));document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));document.getElementById(tab).classList.add("active");e.target.classList.add("active");if(tab==="list")loadList()}async function addCode(){const brand=document.getElementById("brand").value;const amount=document.getElementById("amount").value;const code=document.getElementById("code").value;const msg=document.getElementById("addMsg");if(!brand||!amount||!code){msg.innerHTML=\'<div class="msg error">Fill all</div>\';return}const res=await fetch("/api/cards",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brand,amount:Number(amount),code})});if(res.ok){msg.innerHTML=\'<div class="msg success">Added!</div>\';document.getElementById("brand").value="";document.getElementById("amount").value="";document.getElementById("code").value="";loadList()}}async function loadList(){const res=await fetch("/api/cards");const cards=await res.json();const tbody=document.querySelector("#table tbody");tbody.innerHTML=cards.map(c=>`<tr><td>${c.brand}</td><td>${c.amount}</td><td>${c.code}</td><td><button class="small danger" onclick="del(\'${c.id}\')">X</button></td></tr>`).join("")}async function del(id){if(!confirm("Delete?"))return;await fetch("/api/cards/"+id,{method:"DELETE"});loadList()}<\/script></body></html>');
});

app.post('/api/cards', (req, res) => {
  const {brand, amount, code} = req.body;
  cards.push({id: Date.now().toString(), brand, amount, code, status: 'available'});
  res.json({ok: true});
});

app.get('/api/cards', (req, res) => {
  res.json(cards);
});

app.delete('/api/cards/:id', (req, res) => {
  cards = cards.filter(c => c.id !== req.params.id);
  res.json({ok: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
