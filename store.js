// ====== ESTADO GLOBAL DA APLICAÇÃO ======
window.state = {
  user: null, // Fica preenchido quando faz login (ex: { email: 'teste@mail.com' })
  currentPlanId: null,
  selectedAppliances: [],
  deliveries: []
};

// Variáveis globais para filtros e agendamento que as tuas páginas usam
window.appSearch = '';
window.appFilter = 'Todos';
window.dState = {
  yr: null,
  mo: null,
  date: null,
  slot: null,
  addr: '',
  applianceId: null
};

// ====== DADOS ESTÁTICOS ======
window.PLANS = {
  parcial: { id: 'parcial', name: 'Plano Parcial', price: 600, maxAppliances: 4 },
  completo: { id: 'completo', name: 'Plano Completo', price: 1000, maxAppliances: 8 }
};

window.CATEGORY_ICONS = {
  'Frigorífico': '❄️',
  'Máquina de Lavar': '🧼',
  'Forno': '🍳',
  'Micro-ondas': '🍿',
  'Loiça': '🍽️'
};

window.MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
window.SLOTS = ['09:00 - 13:00', '14:00 - 18:00'];

window.APPLIANCES = [
  { id: '1', name: 'Frigorífico Americano NoFrost', brand: 'Samsung', category: 'Frigorífico', image: 'https://images.unsplash.com/photo-1571175432244-5f02585f814d?w=400' },
  { id: '2', name: 'Máquina de Lavar Roupa 9kg', brand: 'Bosch', category: 'Máquina de Lavar', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400' },
  { id: '3', name: 'Forno Elétrico Encastre', brand: 'Siemens', category: 'Forno', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a814c99?w=400' }
];

// ====== FUNÇÕES DE MANIPULAÇÃO DE ESTADO ======
window.getCurrentPlan = () => window.PLANS[window.state.currentPlanId] || null;
window.getSelectedAppliances = () => window.state.selectedAppliances;
window.getDeliveries = () => window.state.deliveries;

window.selectPlan = (planId) => { window.state.currentPlanId = planId; };
window.saveDelivery = (deliveryObj) => { window.state.deliveries.push(deliveryObj); };

window.login = (email, pass) => {
  window.state.user = { email: email };
  return true;
};
window.logout = () => { window.state.user = null; window.state.currentPlanId = null; window.state.selectedAppliances = []; window.state.deliveries = []; };
window.registerUser = (name, age, email, pass) => { return { ok: true }; };
window.processPayment = (amount, num, name, exp, cvc) => { 
  if(num.length < 16) return { ok: false, error: 'Número de cartão inválido.' };
  return { ok: true, transactionId: 'TX-' + Math.floor(Math.random() * 100000) }; 
};
window.updateNavbar = () => { /* Evita erro caso não tenhas a função da navbar ativa */ };
