// ====== CONSTANTES E MOCK DATA ======
const CATEGORY_ICONS = {
  'Frigorífico': '❄️',
  'Máquina de Lavar': '🧺',
  'Lava-louças': '🍽️',
  'Forno': '🍳'
};

const APPLIANCES = [
  { id: '1', name: 'Frigorífico NoFrost Premium', brand: 'Samsung', category: 'Frigorífico', image: 'https://images.unsplash.com/photo-1571175432244-5f025856b462?w=300' },
  { id: '2', name: 'Máquina Lavar Roupa 9kg', brand: 'Bosch', category: 'Máquina de Lavar', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300' },
  { id: '3', name: 'Lava-louças Enastrada', brand: 'Siemens', category: 'Lava-louças', image: 'https://images.unsplash.com/photo-1581622558663-b293337722da?w=300' }
];

const PLANS = {
  parcial: { id: 'parcial', name: 'Plano Parcial', price: 600, maxAppliances: 4 },
  completo: { id: 'completo', name: 'Plano Completo', price: 1000, maxAppliances: 8 }
};

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const SLOTS = ['08:00 – 10:00','10:00 – 12:00','12:00 – 14:00','14:00 – 16:00','16:00 – 18:00'];

// ====== ESTADO DA APLICAÇÃO ======
let state = {
  user: null,
  currentPlan: null,
  selectedAppliances: [],
  deliveries: []
};

let dState = { yr: null, mo: null, date: null, slot: null, addr: '', applianceId: null };
let appFilter = 'Todos';
let appSearch = '';

// ====== FUNÇÕES DE BASE DE DADOS / SISTEMA ======
function isLoggedIn() { return state.user !== null; }
function getCurrentPlan() { return state.currentPlan; }
function getSelectedAppliances() { return state.selectedAppliances; }
function getDeliveries() { return state.deliveries; }

function registerUser(name, age, email, pass) {
  if (parseInt(age) < 18) return { ok: false, error: 'É necessário ter 18 ou mais anos.' };
  return { ok: true };
}

function login(email, pass) {
  state.user = { email };
  return true;
}

function selectPlan(planId) {
  state.currentPlan = PLANS[planId];
}

function handleCancelAppliance(id) {
  state.selectedAppliances = state.selectedAppliances.filter(a => a.id !== id);
  renderSubscription(); // Recarrega a página onde a ação ocorreu
}

function toggleApplianceSelection(id) {
  const app = APPLIANCES.find(a => a.id === id);
  if (!app) return;
  
  const index = state.selectedAppliances.findIndex(a => a.id === id);
  if (index > -1) {
    state.selectedAppliances.splice(index, 1);
  } else {
    if (state.currentPlan && state.selectedAppliances.length < state.currentPlan.maxAppliances) {
      state.selectedAppliances.push(app);
    }
  }
  renderAppliances();
}

function processPayment(price, card, name, exp, cvc) {
  if (!card || !name || !exp || !cvc) return { ok: false, error: 'Preencha todos os campos do cartão.' };
  return { ok: true, transactionId: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase() };
}

function saveDelivery(deliveryObj) {
  state.deliveries.push(deliveryObj);
}
