// ─── PLANOS ──────────────────────────────────────────────────────────────────
const PLANS = {
  parcial:  { id:'parcial',  name:'Plano Parcial',   price:600,  maxAppliances:4 },
  completo: { id:'completo', name:'Plano Completo',  price:1000, maxAppliances:8 },
};

// ─── APPLIANCES ──────────────────────────────────────────────────────────────
const APPLIANCES = [
  { id:'a1', name:'Samsung EcoBubble 9kg', brand:'Samsung', category:'Máquina de Lavar',
    description:'Tecnologia EcoBubble para lavagem eficiente a baixas temperaturas.',
    features:['9kg','1400 rpm','A+++','Wi-Fi'],
    image:'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop' },
  { id:'a2', name:'LG InstaView Frigorífico', brand:'LG', category:'Frigorífico',
    description:'Painel de vidro InstaView — dois toques para iluminar o interior sem abrir a porta.',
    features:['French Door','No Frost','A++'],
    image:'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop' },
  { id:'a3', name:'Bosch Serie 6 Lava-Louça', brand:'Bosch', category:'Máquina de Lavar Louça',
    description:'Silenciosa com tecnologia PerfectDry para secagem perfeita.',
    features:['14 conjuntos','42 dB','A+++'],
    image:'https://images.unsplash.com/photo-1758631130778-42d518bf13aa?w=400&h=300&fit=crop' },
  { id:'a4', name:"De'Longhi Dinamica Plus", brand:"De'Longhi", category:'Máquina de Café',
    description:'Máquina automática com ecrã tátil a cores e sistema LatteCrema.',
    features:['Ecrã tátil','Moinho integrado','Wi-Fi'],
    image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
  { id:'a5', name:'Whirlpool FreshControl', brand:'Whirlpool', category:'Frigorífico',
    description:'Tecnologia FreshControl para manter os alimentos frescos até 3x mais tempo.',
    features:['No Frost','6th Sense','A++'],
    image:'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop' },
  { id:'a6', name:'Siemens iQ700 Forno', brand:'Siemens', category:'Forno',
    description:'Forno multifunções com assistente de cozinha e limpeza automática pirólise.',
    features:['Home Connect','Pirólise','4D Hotair'],
    image:'https://plus.unsplash.com/premium_photo-1744390860448-3d12cfcae65f?w=400&h=300&fit=crop' },
  { id:'a7', name:'Miele W1 ChromeEdition', brand:'Miele', category:'Máquina de Lavar',
    description:'Máquina de lavar premium com tambor em favo de mel e TwinDos automático.',
    features:['TwinDos','A+++','WiFiConn@ct'],
    image:'https://images.unsplash.com/photo-1778731660255-215c9172e18d?w=400&h=300&fit=crop' },
  { id:'a8', name:'Electrolux PerfectCare 800', brand:'Electrolux', category:'Máquina de Secar',
    description:'Secadora de condensação com tecnologia SensiDry para máxima eficiência.',
    features:['SensiDry','9kg','A++'],
    image:'https://images.unsplash.com/photo-1721395285456-05a8b9b45b9f?w=400&h=300&fit=crop' },
  { id:'a9', name:'LG NeoChef Micro-ondas', brand:'LG', category:'Micro-ondas',
    description:'Smart Inverter para cozinhar de forma uniforme. Interior EasyClean.',
    features:['Smart Inverter','42L','Grill'],
    image:'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop' },
  { id:'a10', name:'Bosch HNG6764B6 Fogão', brand:'Bosch', category:'Fogão',
    description:'Fogão combinado com placa a gás e forno elétrico de alta eficiência.',
    features:['4 queimadores gás','66L forno','A'],
    image:'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop' },
  { id:'a11', name:'Dyson V15 Detect', brand:'Dyson', category:'Aspirador',
    description:'Aspirador sem fios com laser que deteta partículas invisíveis a olho nu.',
    features:['Laser Detect','HEPA','60 min'],
    image:'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop' },
  { id:'a12', name:'Samsung WindFree AC', brand:'Samsung', category:'Ar Condicionado',
    description:'Sistema WindFree sem fluxo de ar direto para conforto máximo.',
    features:['WindFree','Wi-Fi','A+++'],
    image:'https://plus.unsplash.com/premium_photo-1676320514036-fcc490dbd855?w=400&h=300&fit=crop&crop=focalpoint&fp-y=0&fp-x=0.2' },
];

const CATEGORY_ICONS = {
  'Máquina de Lavar':'🫧','Frigorífico':'❄️','Máquina de Lavar Louça':'🍽️',
  'Máquina de Café':'☕','Forno':'🔥','Máquina de Secar':'💨',
  'Micro-ondas':'📡','Fogão':'🍳','Aspirador':'🌀','Ar Condicionado':'🌬️',
};

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const USERS_KEY = 'homeloop_users';   // lista de utilizadores registados
const STATE_KEY = 'homeloop_state';   // estado da sessão atual

// ─── USERS REGISTRY ──────────────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(name, age, email, password) {
  if (parseInt(age) < 18) return { ok: false, error: 'Tens de ter 18 ou mais anos para te registar.' };
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: 'Este email já está registado.' };
  if (!name.trim()) return { ok: false, error: 'O nome não pode estar vazio.' };
  if (password.length < 4) return { ok: false, error: 'A password deve ter pelo menos 4 caracteres.' };
  const user = { name: name.trim(), age: parseInt(age), email: email.trim().toLowerCase(), password };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

// ─── SESSION STATE ────────────────────────────────────────────────────────────
function getState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch { return defaultState(); }
}

function defaultState() {
  return {
    user: null,
    planId: null,
    selectedIds: [],
    subscribed: false,
    deliveries: [],      // array de entregas (permite agendar várias)
    cancelledIds: [],    // IDs de eletrodomésticos cujo aluguer foi anulado
  };
}

function saveState(s) { localStorage.setItem(STATE_KEY, JSON.stringify(s)); }

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function login(email, password) {
  const user = getUsers().find(u => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) return false;
  const state = getState();
  state.user = { email: user.email, name: user.name, age: user.age };
  saveState(state);
  return true;
}

function logout() { saveState(defaultState()); }
function isLoggedIn() { return !!getState().user; }
function getCurrentUser() { return getState().user; }

// ─── PLAN ────────────────────────────────────────────────────────────────────
function selectPlan(planId) {
  const state = getState();
  const plan = PLANS[planId];
  if (state.selectedIds.length > plan.maxAppliances)
    state.selectedIds = state.selectedIds.slice(0, plan.maxAppliances);
  state.planId = planId;
  saveState(state);
}

function getCurrentPlan() {
  const s = getState();
  return s.planId ? PLANS[s.planId] : null;
}

// ─── APPLIANCES ──────────────────────────────────────────────────────────────
function getSelectedAppliances() {
  return APPLIANCES.filter(a => getState().selectedIds.includes(a.id));
}

function addAppliance(id) {
  const state = getState();
  const plan = getCurrentPlan();
  if (!plan || state.selectedIds.length >= plan.maxAppliances) return false;
  if (state.selectedIds.includes(id)) return false;
  state.selectedIds.push(id);
  // se estava cancelado, remove o cancel
  state.cancelledIds = (state.cancelledIds||[]).filter(i => i !== id);
  saveState(state);
  return true;
}

function removeAppliance(id) {
  const state = getState();
  state.selectedIds = state.selectedIds.filter(i => i !== id);
  saveState(state);
}

// Anular aluguer de um eletrodoméstico específico
function cancelAppliance(id) {
  const state = getState();
  state.selectedIds = state.selectedIds.filter(i => i !== id);
  if (!state.cancelledIds) state.cancelledIds = [];
  if (!state.cancelledIds.includes(id)) state.cancelledIds.push(id);
  saveState(state);
}

function isSelected(id) { return getState().selectedIds.includes(id); }
function isCancelled(id) { return (getState().cancelledIds||[]).includes(id); }

// ─── SUBSCRIPTION ────────────────────────────────────────────────────────────
function confirmSubscription() {
  const state = getState();
  state.subscribed = true;
  saveState(state);
}

// ─── DELIVERY ────────────────────────────────────────────────────────────────
function saveDelivery(delivery) {
  const state = getState();
  if (!state.deliveries) state.deliveries = [];
  state.deliveries.push(delivery);
  saveState(state);
}

function getDeliveries() {
  return getState().deliveries || [];
}
