// ====== ESTADO VOLÁTIL DE INTERFACE ======
window.currentSearch = '';
window.currentCategory = 'Todos';

// Estado temporário para o formulário de agendamento em curso
window.activeDeliveryForm = {
  applianceId: null,
  date: '',
  address: ''
};

// ====== EVENTO DE CAPTURA DE LINKS DATA-NAV ======
document.addEventListener('click', e => {
  const target = e.target.closest('[data-nav]');
  if (target) {
    e.preventDefault();
    navigate(target.dataset.nav);
  }
});

// ====== FUNÇÃO AUXILIAR DE PESQUISA (US1.3 - Cenário 2) ======
function handleSearchKeyDown(e, inputEl) {
  if (e.key === 'Enter') {
    window.currentSearch = inputEl.value.trim();
    renderPage(location.pathname);
  }
}

function handleCategoryFilter(category) {
  window.currentCategory = category;
  renderPage(location.pathname);
}

// ====== FLUXOS DE AÇÃO DAS USER STORIES ======

// US1.1: Subscrição e Pagamento
function executePaymentSimulation(scenario) {
  const state = getState();
  const plan = getCurrentPlan();
  
  if (!plan) {
    alert("Por favor, selecione um plano na página de planos antes de proceder ao pagamento.");
    return;
  }

  if (scenario === 'success') {
    confirmSubscription();
    alert(`Pagamento de €${plan.price} efetuado com sucesso! Tem agora 1 ano de subscrição ativo. Pode escolher até ${plan.maxAppliances} eletrodomésticos.`);
    navigate('/appliances');
  } else {
    // Cenário 2 - Falha de Pagamento
    const errEl = document.getElementById('pay-error-msg');
    if (errEl) {
      errEl.textContent = "Erro! O cartão inserido foi recusado devido a saldo insuficiente. Corrija o problema para obter o ano de subscrição.";
      errEl.classList.add('show');
    }
  }
}

// US1.2: Agendamento de Entregas
function handleOpenSchedule(applianceId) {
  const state = getState();
  const plan = getCurrentPlan();
  
  // US1.2 - Cenário 3: Limite Atingido
  if (plan && state.selectedIds.length >= plan.maxAppliances && !state.selectedIds.includes(applianceId)) {
    alert(`Limite de eletrodomésticos já atingido! Se quiser este eletrodoméstico terá de anular o aluguer de um dos seus eletrodomésticos previamente escolhidos.`);
    return;
  }

  window.activeDeliveryForm.applianceId = applianceId;
  navigate('/delivery');
}

function executeScheduleSimulation(scenario) {
  const form = window.activeDeliveryForm;
  if (!form.applianceId || !form.date || !form.address) {
    alert("Por favor, preencha todos os campos do agendamento (Data e Morada).");
    return;
  }

  const appliance = APPLIANCES.find(a => a.id === form.applianceId);

  if (scenario === 'success') {
    // Simulação de Erro de Catálogo Ocasional (US1.2 - Cenário 2)
    // Se tentarmos agendar o aparelho "a10", vamos simular que ele saiu do catálogo
    if (form.applianceId === 'a10') {
      alert(`Erro! É possível o ${appliance.name} já ter sido alugado ou ter saído do catálogo, tente escolher outro.`);
      return;
    }

    // Adiciona ao plano se ainda não estiver lá dentro
    addAppliance(form.applianceId);
    
    // Grava a entrega logística
    saveDelivery({
      applianceId: form.applianceId,
      applianceName: appliance.name,
      date: form.date,
      address: form.address,
      status: 'Confirmada'
    });

    alert(`O ${appliance.name} será entregue na ${form.date}. Agendamento efetuado!`);
    
    // Reseta formulário temporário
    window.activeDeliveryForm = { applianceId: null, date: '', address: '' };
    navigate('/dashboard');
  }
}

// US1.4: Anulação com Upload de Foto e Estado do Aparelho
function executeCancellation(applianceId) {
  const appliance = APPLIANCES.find(a => a.id === applianceId);
  if (!appliance) return;

  const fileInput = document.getElementById(`photo-${applianceId}`);
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Por favor, selecione primeiro uma imagem com o estado atual do equipamento.");
    return;
  }

  const isDamaged = document.getElementById(`condition-${applianceId}`).checked;
  const dateField = document.getElementById(`ret-date-${applianceId}`).value;

  if (!dateField) {
    alert("Por favor, selecione a data pretendida para a recolha.");
    return;
  }

  cancelAppliance(applianceId);

  if (isDamaged) {
    // US1.4 - Cenário 2: Mau estado
    alert(`O ${appliance.name} não está em bom estado, portanto, será devolvido na ${dateField}, mas terás de pagar o valor de €${(600 / 2)} (metade do valor padrão do aparelho).`);
  } else {
    // US1.4 - Cenário 1: Bom estado
    alert(`O ${appliance.name} será devolvido na ${dateField}. Agendamento de recolha efetuado com sucesso!`);
  }

  renderPage(location.pathname);
}

// US1.5: Recebimento e Notificação Logística
function triggerDeliveryStatusUpdate(index, newStatus) {
  const state = getState();
  if (!state.deliveries || !state.deliveries[index]) return;

  state.deliveries[index].status = newStatus;
  saveState(state);

  if (newStatus === 'Entregue') {
    alert(`Notificação Enviada: "${state.deliveries[index].applianceName} entregue". O aparelho pode ser instalado agora.`);
  } else if (newStatus === 'Adiada') {
    alert("Simulação: Email enviado para o João a alertar que a HomeLoop não consegue entregar na data. O João terá de redefinir o agendamento.");
  }

  renderPage(location.pathname);
}

function handleRescheduleDelivery(index, newDate) {
  const state = getState();
  if (!state.deliveries || !state.deliveries[index]) return;
  
  if(!newDate) {
    alert("Insira uma nova data válida.");
    return;
  }

  state.deliveries[index].date = newDate;
  state.deliveries[index].status = 'Confirmada';
  saveState(state);
  
  alert(`Data remarcada com sucesso para: ${newDate}`);
  renderPage(location.pathname);
}

// ─── COMPLEMENTO REBOUT SPA MOTOR ───────────────────────────────────────────
function navigate(path) {
  const pub = ['/', '/login', '/register'];
  if (!pub.includes(path) && !isLoggedIn()) {
    history.pushState(null, '', '/login');
    renderPage('/login'); 
    return;
  }
  history.pushState(null, '', path);
  renderPage(path);
  window.scrollTo(0, 0);
}

function renderPage(path) {
  const pub = ['/', '/login', '/register'];
  if (!pub.includes(path) && !isLoggedIn()) {
    path = '/login';
    history.replaceState(null, '', '/login');
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  const map = {
    '/':'page-home', '/login':'page-login', '/register':'page-register',
    '/plans':'page-plans', '/appliances':'page-appliances',
    '/subscription':'page-subscription', '/delivery':'page-delivery',
    '/dashboard':'page-dashboard',
  };
  
  const el = document.getElementById(map[path] || 'page-home');
  if (el) el.classList.add('active');
  updateNavbar();
  
  switch(path) {
    case '/':             renderHome();         break;
    case '/login':        renderLogin();        break;
    case '/register':     renderRegister();     break;
    case '/plans':        renderPlans();        break;
    case '/appliances':   renderAppliances();   break;
    case '/subscription': renderSubscription(); break;
    case '/delivery':     renderDelivery();     break;
    case '/dashboard':    renderDashboard();    break;
  }
}

window.addEventListener('popstate', () => renderPage(location.pathname));
