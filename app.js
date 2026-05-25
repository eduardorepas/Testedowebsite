// ====== EVENT HANDLING / ACTIONS ======

function doRegister() {
  const name = document.getElementById('r-name')?.value?.trim();
  const age = document.getElementById('r-age')?.value?.trim();
  const email = document.getElementById('r-email')?.value?.trim();
  const pass = document.getElementById('r-pass')?.value;
  const pass2 = document.getElementById('r-pass2')?.value;
  const errEl = document.getElementById('reg-err');
  
  const showErr = msg => { if(errEl) { errEl.textContent = msg; errEl.classList.add('show'); } };
  
  if (!name || !age || !email || !pass) return showErr('Preencha todos os campos.');
  if (pass !== pass2) return showErr('As passwords não coincidem.');
  
  const result = registerUser(name, age, email, pass);
  if (!result.ok) return showErr(result.error);
  
  login(email, pass);
  updateNavbar();
  navigate('/');
}

function doLogin() {
  const email = document.getElementById('l-email')?.value?.trim();
  const pass = document.getElementById('l-pass')?.value;
  
  if (!email || !pass) return;

  if (login(email, pass)) { 
    updateNavbar();
    navigate('/'); 
  } else { 
    const err = document.getElementById('login-err'); 
    if(err) {
      err.textContent = 'Email ou password incorretos.'; 
      err.classList.add('show'); 
    }
  }
}

function doLogoutAction() {
  logout();
  updateNavbar();
  navigate('/');
}

function choosePlan(planId) { 
  selectPlan(planId); 
  renderPlans(); 
  updateNavbar();
}

function onSearch(val) {
  appSearch = val;
  renderAppliances();
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
  
  const result = processPayment(plan?.price || 0, cardNum, cardName, cardExp, cardCVC);
  if (!result.ok) {
    if (errEl) { errEl.textContent = result.error; errEl.classList.add('show'); }
    return;
  }
  renderPaymentSuccess(result.transactionId);
}

function updateDeliveryAddress(value) {
  dState.addr = value;
}

// ====== ROTEADOR SPA NATIVO ======
function navigate(path) {
  console.log(`Navegando para: ${path}`);
  
  // 1. Esconder todas as views com segurança
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.style.display = 'none';
  });

  // 2. Mapeamento de rotas e renderizadores
  if (path === '/') {
    renderHome();
    const p = document.getElementById('page-home'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/register') {
    renderRegister();
    const p = document.getElementById('page-register'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/login') {
    renderLogin();
    const p = document.getElementById('page-login'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/plans') {
    renderPlans();
    const p = document.getElementById('page-plans'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/appliances') {
    renderAppliances();
    const p = document.getElementById('page-appliances'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/subscription') {
    renderSubscription();
    const p = document.getElementById('page-subscription'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/payment') {
    renderPayment();
    const p = document.getElementById('page-payment'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/delivery') {
    renderDelivery();
    const p = document.getElementById('page-delivery'); p.classList.add('active'); p.style.display = 'block';
  }
  else if (path === '/dashboard') {
    renderDashboard();
    const p = document.getElementById('page-dashboard'); p.classList.add('active'); p.style.display = 'block';
  }

  // Atualiza a navbar para refletir mudanças de estado (login/carrinho)
  updateNavbar();
  window.scrollTo(0, 0);
}

// ====== CAPTURA AUTOMÁTICA DE ATRIBUTOS DATA-NAV ======
document.addEventListener('click', (e) => {
  // Procura o elemento clicado ou o seu parente mais próximo com "data-nav"
  const target = e.target.closest('[data-nav]');
  if (target) {
    e.preventDefault();
    const path = target.getAttribute('data-nav');
    navigate(path);
  }
});
