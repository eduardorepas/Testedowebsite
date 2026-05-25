// ====== EVENT HANDLING / ACTIONS ======

function doRegister() {
  const name = document.getElementById('r-name')?.value?.trim();
  const age = document.getElementById('r-age')?.value?.trim();
  const email = document.getElementById('r-email')?.value?.trim();
  const pass = document.getElementById('r-pass')?.value;
  const pass2 = document.getElementById('r-pass2')?.value;
  const errEl = document.getElementById('reg-err');
  
  const showErr = msg => { errEl.textContent = msg; errEl.classList.add('show'); };
  
  if (pass !== pass2) return showErr('As passwords não coincidem.');
  
  const result = registerUser(name, age, email, pass);
  if (!result.ok) return showErr(result.error);
  
  login(email, pass);
  navigate('/');
}

function doLogin() {
  const email = document.getElementById('l-email')?.value?.trim();
  const pass = document.getElementById('l-pass')?.value;
  
  if (login(email, pass)) { 
    navigate('/'); 
  } else { 
    const err = document.getElementById('login-err'); 
    err.textContent = 'Email ou password incorretos.'; 
    err.classList.add('show'); 
  }
}

function choosePlan(planId) { 
  selectPlan(planId); 
  renderPlans(); 
}

function onSearch(val) {
  appSearch = val;
  const filtered = APPLIANCES.filter(a => {
    const mc = appFilter === 'Todos' || a.category === appFilter;
    const ms = a.name.toLowerCase().includes(val.toLowerCase()) || a.category.toLowerCase().includes(val.toLowerCase()) || a.brand.toLowerCase().includes(val.toLowerCase());
    return mc && ms;
  });
  
  const grid = document.getElementById('app-grid');
  if (grid) {
    grid.innerHTML = filtered.length > 0 
      ? filtered.map(a => appCard(a)).join('') 
      : '<div style="grid-column:1/-1;text-align:center;padding:4rem 0"><p style="font-size:2.5rem">🔍</p><p class="text-gray mt-3">Nenhum resultado.</p></div>';
  }
}

function onFilter(cat) { 
  appFilter = cat; 
  renderAppliances(); 
}

function handleConfirmSub() {
  if (getSelectedAppliances().length === 0) return;
  navigate('/payment');
}

function formatCardNumber(el) {
  let value = el.value.replace(/\s/g, '');
  el.value = value.replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiry(el) {
  let value = el.value.replace(/\D/g, '');
  if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
  el.value = value;
}

function processPaymentSubmit() {
  const cardNum = document.getElementById('pay-cardnum')?.value?.replace(/\s/g, '') || '';
  const cardName = document.getElementById('pay-name')?.value || '';
  const cardExp = document.getElementById('pay-expiry')?.value || '';
  const cardCVC = document.getElementById('pay-cvc')?.value || '';
  const plan = getCurrentPlan();
  const errEl = document.getElementById('pay-err');
  
  const result = processPayment(plan.price, cardNum, cardName, cardExp, cardCVC);
  if (!result.ok) {
    errEl.textContent = result.error;
    errEl.classList.add('show');
    return;
  }
  renderPaymentSuccess(result.transactionId);
}

// ====== LÓGICA DO CALENDÁRIO DE ENTREGA ======

function handleDeliveryApplianceSelect(id) {
  dState.applianceId = id;
  renderDelivery();
}

function updateDeliveryAddress(value) {
  dState.addr = value;
}

function prevMo() {
  if (dState.mo === 0) { dState.mo = 11; dState.yr--; } 
  else { dState.mo--; }
  dState.date = null; dState.slot = null;
  renderDelivery();
}

function nextMo() {
  if (dState.mo === 11) { dState.mo = 0; dState.yr++; } 
  else { dState.mo++; }
  dState.date = null; dState.slot = null;
  renderDelivery();
}

function pickDate(day) {
  dState.date = new Date(dState.yr, dState.mo, day);
  dState.slot = null;
  renderDelivery();
}

function pickSlot(slotWindow) {
  dState.slot = slotWindow;
  renderDelivery();
}

function confirmDel() {
  if (!dState.applianceId || !dState.date || !dState.slot || !dState.addr.trim()) return;
  
  const appliance = APPLIANCES.find(a => a.id === dState.applianceId);
  saveDelivery({
    applianceId: dState.applianceId,
    applianceName: appliance ? appliance.name : 'Eletrodoméstico',
    date: dState.date.toLocaleDateString('pt-PT'),
    slot: dState.slot,
    addr: dState.addr
  });
  
  dState.applianceId = null; dState.date = null; dState.slot = null;
  renderDelivery();
}

// Sistema mock de navegação simples (Substitui pelo teu router real, se necessário)
function navigate(path) {
  console.log(`A navegar para: ${path}`);
  if (path === '/') renderHome();
  if (path === '/register') renderRegister();
  if (path === '/login') renderLogin();
  if (path === '/plans') renderPlans();
  if (path === '/appliances') renderAppliances();
  if (path === '/subscription') renderSubscription();
  if (path === '/payment') renderPayment();
  if (path === '/delivery') renderDelivery();
}
