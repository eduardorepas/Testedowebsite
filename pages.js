// ====== RENDERER: HOME PAGE ======
function renderHome() {
  document.getElementById('page-home').innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">✨ Revolução Circular HomeLoop</div>
        <h1>Eletrodomésticos Premium <span>Sem Complicações</span></h1>
        <p class="hero-desc">Subscreva pacotes anuais com entrega técnica, montagem imediata e manutenção total gratuitas.</p>
        <div class="hero-btns">
          <button class="btn btn-primary" data-nav="/plans">Explorar Planos Disponíveis</button>
          <button class="btn btn-outline" style="color:white;border-color:rgba(255,255,255,0.3)" data-nav="/appliances">Ver Catálogo</button>
        </div>
      </div>
    </section>`;
}

// ====== RENDERER: SELEÇÃO DE PLANOS ======
function renderPlans() {
  const currentPlan = getCurrentPlan();
  document.getElementById('page-plans').innerHTML = `
    <div class="ph">
      <div class="ph-inner">
        <h1>Escolha o seu Plano Anual</h1>
        <p>Adapte os limites à quantidade de aparelhos que necessita na sua habitação.</p>
      </div>
    </div>
    <div class="pc">
      <div class="plans-grid">
        <div class="plan-card ${currentPlan?.id === 'parcial'?'selected':''}" onclick="selectPlan('parcial'); renderPlans();">
          <div class="plan-head">
            <h3>Plano Parcial</h3>
            <div class="plan-price-row"><span class="plan-price">€600</span><span class="plan-period">/ano</span></div>
          </div>
          <div class="plan-body">
            <div class="plan-feature"><span>✓</span> Escolha até 4 aparelhos em simultâneo</div>
            <div class="plan-feature"><span>✓</span> Manutenção preventiva total</div>
          </div>
        </div>
        <div class="plan-card ${currentPlan?.id === 'completo'?'selected':''}" onclick="selectPlan('completo'); renderPlans();">
          <div class="plan-head">
            <h3>Plano Completo</h3>
            <div class="plan-price-row"><span class="plan-price">€1000</span><span class="plan-period">/ano</span></div>
          </div>
          <div class="plan-body">
            <div class="plan-feature"><span>✓</span> Escolha até 8 aparelhos em simultâneo</div>
            <div class="plan-feature"><span>✓</span> Suporte Premium de Instalação Técnica</div>
          </div>
        </div>
      </div>
      <div class="text-center mt-6">
        <button class="btn btn-primary" data-nav="/subscription">Avançar para Checkout da Subscrição →</button>
      </div>
    </div>`;
}

// ====== RENDERER: CATÁLOGO DE EQUIPAMENTOS (US1.3) ======
function renderAppliances() {
  const plan = getCurrentPlan();
  const state = getState();
  const categories = ['Todos', 'Máquina de Lavar', 'Frigorífico', 'Máquina de Lavar Louça', 'Máquina de Café', 'Forno', 'Máquina de Secar', 'Micro-ondas', 'Fogão', 'Aspirador', 'Ar Condicionado'];
  
  let filtered = APPLIANCES.filter(a => {
    const matchesCat = window.currentCategory === 'Todos' || a.category === window.currentCategory;
    const matchesSearch = a.name.toLowerCase().includes(window.currentSearch.toLowerCase()) || 
                          a.brand.toLowerCase().includes(window.currentSearch.toLowerCase()) ||
                          a.category.toLowerCase().includes(window.currentSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  document.getElementById('page-appliances').innerHTML = `
    <div class="ph">
      <div class="ph-inner">
        <h1>Catálogo de Eletrodomésticos</h1>
        <p>Gerencie as escolhas incluídas no seu plafond contratado.</p>
        
        <div class="filter-bar mt-4" style="justify-content:center">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Pesquise tipo ou marca e prima Enter..." 
                   value="${window.currentSearch}" 
                   onkeydown="handleSearchKeyDown(event, this)">
          </div>
          <div class="filter-pills">
            ${categories.map(c => `
              <span class="fpill ${window.currentCategory === c ? 'active':''}" 
                    onclick="handleCategoryFilter('${c}')">${c}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="pc">
      ${plan ? `
        <div class="info-banner info-teal mb-4">
          ℹ️ Plano Ativo: <strong>${plan.name}</strong> — Alocados: ${state.selectedIds.length} de ${plan.maxAppliances} equipamentos max.
        </div>
      `: `
        <div class="info-banner info-amber mb-4">
          ⚠️ Não tem plano ativo. <a href="#" data-nav="/plans" style="font-weight:600; text-decoration:underline">Selecione um plano</a> antes de efetuar agendamentos.
        </div>
      `}

      <div class="app-grid">
        ${filtered.map(a => {
          const sel = isSelected(a.id);
          const icon = CATEGORY_ICONS[a.category] || '📦';

          let btnHtml = '';
          if (a.id === 'a10') {
            btnHtml = `<button class="btn btn-outline w-full" onclick="handleOpenSchedule('${a.id}')">Agendar Entrega (Teste Erro)</button>`;
          } else if (sel) {
            btnHtml = `<button class="btn btn-outline w-full" style="border-color:var(--teal); color:var(--teal-d)" disabled>✓ Já Adicionado</button>`;
          } else {
            btnHtml = `<button class="btn btn-primary w-full" onclick="handleOpenSchedule('${a.id}')">Agendar Entrega deste Item</button>`;
          }

          return `
            <div class="app-card ${sel?'selected':''}">
              <div class="app-img">
                <img src="${a.image}">
                <div class="app-cat">${icon} ${a.category}</div>
              </div>
              <div class="app-body">
                <div class="app-brand">${a.brand}</div>
                <div class="app-name">${a.name}</div>
                <div class="app-desc">${a.description}</div>
                <div class="app-feats">${a.features.map(f=>`<span class="app-feat">${f}</span>`).join('')}</div>
                ${btnHtml}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ====== RENDERER: CHECKOUT DA SUBSCRIÇÃO & PAGAMENTO (US1.1) ======
function renderSubscription() {
  const plan = getCurrentPlan();
  document.getElementById('page-subscription').innerHTML = `
    <div class="ph">
      <div class="ph-inner">
        <h1>Confirmação de Pagamento</h1>
        <p>Valide as condições do seu plano HomeLoop.</p>
      </div>
    </div>
    <div class="pc" style="max-width:600px">
      <div class="card p-6">
        <h3 class="mb-4">Resumo do Contrato</h3>
        <div class="justify-between flex mb-4 pb-2" style="border-bottom:1px solid var(--gray-100)">
          <span>Plano Selecionado:</span>
          <strong>${plan ? plan.name : 'Nenhum plano escolhido'}</strong>
        </div>
        <div class="justify-between flex mb-6">
          <span>Anuidade a Liquidar:</span>
          <span class="text-teal fw-600" style="font-size:1.25rem">€${plan ? plan.price : 0}</span>
        </div>

        <div id="pay-error-msg" class="pay-err"></div>

        <div class="field">
          <label>Titular do Cartão</label>
          <input type="text" placeholder="João Silva" value="João Silva">
        </div>
        <div class="field">
          <label>Número do Cartão de Crédito</label>
          <input type="text" placeholder="4532 •••• •••• 1124" value="4532 0000 0000 1124">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px" class="mb-6">
          <div class="field"><label>Validade</label><input type="text" placeholder="12/28" value="12/28"></div>
          <div class="field"><label>CVC</label><input type="text" placeholder="123" value="123"></div>
        </div>

        <div class="fcol gap-2 flex">
          <button class="btn btn-primary w-full" onclick="executePaymentSimulation('success')">Confirmar Pagamento Bem-sucedido (Cenário 1)</button>
          <button class="btn btn-danger w-full" onclick="executePaymentSimulation('fail')">Simular Falha de Pagamento (Cenário 2)</button>
        </div>
      </div>
    </div>`;
}

// ====== RENDERER: AGENDAMENTO LOGÍSTICO (US1.2) ======
function renderDelivery() {
  const form = window.activeDeliveryForm;
  const appliance = APPLIANCES.find(a => a.id === form.applianceId);

  if (!appliance) {
    document.getElementById('page-delivery').innerHTML = `
      <div class="pc text-center">
        <p class="text-gray">Selecione um eletrodoméstico no catálogo para poder agendar datas de entrega.</p>
        <button class="btn btn-primary mt-3" data-nav="/appliances">Ir para o Catálogo</button>
      </div>`;
    return;
  }

  document.getElementById('page-delivery').innerHTML = `
    <div class="ph">
      <div class="ph-inner">
        <h1>Agendar Entrega Técnico-Logística</h1>
        <p>Defina as coordenadas de entrega para o equipamento: <strong>${appliance.name}</strong></p>
      </div>
    </div>
    <div class="pc" style="max-width:600px">
      <div class="card p-6">
        <div class="field mb-4">
          <label>Data de Entrega Pretendida</label>
          <input type="date" id="dev-date" onchange="window.activeDeliveryForm.date = this.value">
        </div>
        <div class="field mb-6">
          <label>Morada de Destino e Instalação</label>
          <input type="text" id="dev-addr" placeholder="Rua Central, nº 10, Coimbra" onchange="window.activeDeliveryForm.address = this.value">
        </div>

        <button class="btn btn-primary w-full" onclick="executeScheduleSimulation('success')">Submeter e Confirmar Agendamento</button>
      </div>
    </div>`;
}

// ====== RENDERER: DASHBOARD DE CONTA (US1.4 E US1.5) ======
function renderDashboard() {
  const user = getCurrentUser();
  const state = getState();
  const selected = getSelectedAppliances();
  const deliveries = getDeliveries();

  document.getElementById('page-dashboard').innerHTML = `
    <div class="dash-hero text-center" style="padding: 3rem 1.5rem; color: white">
      <div class="dash-inner">
        <h2>Área Reservada de Gestão</h2>
        <p style="color:#cbd5e1" class="mt-1">Bem-vindo, <strong>${user ? user.name : 'Cliente'}</strong> (${user ? user.email : ''})</p>
      </div>
    </div>

    <div class="pc">
      <div class="sub-grid">
        <div>
          <h3 class="mb-4">📦 Os Meus Equipamentos Ativos</h3>
          ${selected.length === 0 ? '<p class="text-gray">Nenhum equipamento alocado de momento.</p>':''}
          
          <div class="fcol gap-4 flex">
            ${selected.map(a => `
              <div class="card p-4 flex justify-between items-center" style="gap:20px">
                <div class="flex items-center gap-3">
                  <span style="font-size:1.5rem">${CATEGORY_ICONS[a.category]||'⚙️'}</span>
                  <div>
                    <h4 style="font-size:0.95rem">${a.name}</h4>
                    <p class="text-gray text-xs">${a.brand}</p>
                  </div>
                </div>
                
                <div style="background:var(--gray-50); padding:10px; border-radius:10px; font-size:0.75rem" class="fcol gap-2 flex">
                  <div>
                    <label style="font-weight:600">Foto do Aparelho (Obrigatório):</label>
                    <input type="file" id="photo-${a.id}" style="font-size:0.7rem; margin-top:2px">
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="condition-${a.id}">
                    <label for="condition-${a.id}" style="color:var(--red); font-weight:600">Aparelho Danificado/Mau Estado</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <label>Data Recolha:</label>
                    <input type="date" id="ret-date-${a.id}" style="padding:3px; font-size:0.75rem">
                  </div>
                  <button class="btn btn-danger" style="padding:5px 10px; font-size:0.75rem; width:100%" 
                          onclick="executeCancellation('${a.id}')">Anular Aluguer e Agendar Recolha</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <h3 class="mb-4">🚚 Estado Logístico de Entregas</h3>
          ${deliveries.length === 0 ? '<p class="text-gray text-sm">Sem ordens de envio processadas.</p>':''}
          
          <div class="fcol gap-3 flex">
            ${deliveries.map((d, index) => {
              let badgeColor = 'bg-blue';
              if (d.status === 'Entregue') badgeColor = 'bg-green';
              if (d.status === 'Adiada') badgeColor = 'bg-orange';

              return `
                <div class="card p-4">
                  <div class="justify-between flex items-center mb-2">
                    <span class="fw-600 text-sm">${d.applianceName}</span>
                    <span class="badge ${badgeColor}">${d.status}</span>
                  </div>
                  <p class="text-gray text-xs">📍 Destino: ${d.address}</p>
                  <p class="text-navy text-xs fw-600 mt-1">📅 Agendado: ${d.date}</p>
                  
                  ${d.status === 'Adiada' ? `
                    <div class="mt-2 p-2" style="background:#fffbeb; border-radius:8px">
                      <label class="text-xs fw-600 block text-red">A HomeLoop teve de adiar. Selecione nova data:</label>
                      <div class="flex gap-2 mt-1">
                        <input type="date" id="resched-date-${index}" style="padding:4px; font-size:0.75rem">
                        <button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem" 
                                onclick="handleRescheduleDelivery(${index}, document.getElementById('resched-date-${index}').value)">Remarcar</button>
                      </div>
                    </div>
                  ` : ''}

                  <div class="flex gap-2 mt-3 pt-2" style="border-top:1px dashed var(--gray-200)">
                    <button class="btn btn-outline text-xs" style="padding:4px 8px; font-size:0.7rem" 
                            onclick="triggerDeliveryStatusUpdate(${index}, 'Entregue')">Simular Entrega (Cenário 1)</button>
                    <button class="btn btn-outline text-xs" style="padding:4px 8px; font-size:0.7rem; color:var(--red)" 
                            onclick="triggerDeliveryStatusUpdate(${index}, 'Adiada')">Simular Adiar (Cenário 2)</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

// ====== RENDERER: LOGIN ======
function renderLogin() {
  document.getElementById('page-login').innerHTML = `
    <div class="login-screen">
      <div class="login-box">
        <div class="login-logo">Home<span>Loop</span></div>
        <div class="login-sub">Inicie sessão para gerir os seus eletrodomésticos</div>
        <div id="login-err-msg" class="login-err">Email ou password incorretos.</div>
        <div class="field">
          <label>Email</label>
          <input type="text" id="login-email" placeholder="joao@email.com" value="joao@email.com">
        </div>
        <div class="field mb-4">
          <label>Password</label>
          <input type="password" id="login-pass" style="width:100%;padding:11px 14px;border:1px solid var(--gray-200);border-radius:11px" value="1234">
        </div>
        <button class="btn btn-primary w-full" onclick="executeLogin()">Entrar</button>
        <div class="login-hint">Ainda não tem conta? <a href="#" data-nav="/register" style="color:var(--teal);font-weight:600">Registe-se</a></div>
      </div>
    </div>`;
}

function executeLogin() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  if (login(email, pass)) {
    navigate('/dashboard');
  } else {
    const err = document.getElementById('login-err-msg');
    if(err) err.classList.add('show');
  }
}

// ====== RENDERER: REGISTO ======
function renderRegister() {
  document.getElementById('page-register').innerHTML = `
    <div class="login-screen">
      <div class="login-box">
        <div class="login-logo">Home<span>Loop</span></div>
        <div class="login-sub">Crie a sua conta de utilizador</div>
        <div id="reg-err-msg" class="login-err"></div>
        <div class="field"><label>Nome Completo</label><input type="text" id="reg-name" value="João Silva"></div>
        <div class="field"><label>Idade</label><input type="number" id="reg-age" class="w-full" style="padding:11px 14px;border:1px solid var(--gray-200);border-radius:11px" value="25"></div>
        <div class="field"><label>Email</label><input type="text" id="reg-email" value="joao@email.com"></div>
        <div class="field mb-4"><label>Password</label><input type="password" id="reg-pass" style="width:100%;padding:11px 14px;border:1px solid var(--gray-200);border-radius:11px" value="1234"></div>
        <button class="btn btn-primary w-full" onclick="executeRegister()">Criar Conta</button>
      </div>
    </div>`;
}

function executeRegister() {
  const name = document.getElementById('reg-name').value;
  const age = document.getElementById('reg-age').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;
  
  const res = registerUser(name, age, email, pass);
  if (res.ok) {
    login(email, pass);
    navigate('/plans');
  } else {
    const err = document.getElementById('reg-err-msg');
    if(err) { err.textContent = res.error; err.classList.add('show'); }
  }
}
