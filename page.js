// ====== FUNÇÕES DE SUPORTE DO CALENDÁRIO / AGENDAMENTO ======
function prevMo() {
  if (dState.mo === 0) {
    dState.mo = 11;
    dState.yr--;
  } else {
    dState.mo--;
  }
  renderDelivery();
}

function nextMo() {
  if (dState.mo === 11) {
    dState.mo = 0;
    dState.yr++;
  } else {
    dState.mo++;
  }
  renderDelivery();
}

function pickDate(day) {
  dState.date = new Date(dState.yr, dState.mo, day);
  dState.slot = null; 
  renderDelivery();
}

function pickSlot(slotStr) {
  dState.slot = slotStr;
  renderDelivery();
}

function handleDeliveryApplianceSelect(id) {
  dState.applianceId = id;
  renderDelivery();
}

function confirmDel() {
  const { date, slot, addr, applianceId } = dState;
  
  if (!applianceId || !date || !slot || !addr.trim()) {
    alert("Por favor, preencha todos os campos obrigatórios (Aparelho, Data, Horário e Morada).");
    return;
  }

  const appliance = APPLIANCES.find(a => a.id === applianceId);
  
  saveDelivery({
    applianceId: applianceId,
    applianceName: appliance ? appliance.name : 'Eletrodoméstico',
    date: date.toLocaleDateString('pt-PT'),
    slot: slot,
    addr: addr
  });

  // Limpa a seleção do formulário para permitir agendar o próximo item
  dState.date = null;
  dState.slot = null;
  dState.applianceId = null;

  alert("Entrega agendada com sucesso!");
  navigate('/dashboard');
}

// ====== RENDERER DO DASHBOARD (PAINEL DE CONTROLO) ======
function renderDashboard() {
  const user = state.user;
  const plan = getCurrentPlan();
  const selected = getSelectedAppliances();
  const deliveries = getDeliveries();

  if (!user) {
    navigate('/login');
    return;
  }

  document.getElementById('page-dashboard').innerHTML = `
    <div class="ph">
      <div class="ph-inner">
        <h1>Painel de Controlo</h1>
        <p class="text-gray">Bem-vindo à sua área de gestão, <strong>${user.email}</strong></p>
      </div>
    </div>
    
    <div class="pc">
      <div class="sub-grid">
        <!-- Coluna Esquerda: Detalhes do Contrato -->
        <div>
          <div class="card p-5 mb-5">
            <h2 style="font-size:1.1rem;margin-bottom:1rem">A sua Subscrição</h2>
            ${plan ? `
              <div style="background:var(--gray-50);border-radius:10px;padding:1rem;margin-bottom:1rem">
                <p class="text-navy fw-600" style="font-size:1rem">${plan.name}</p>
                <p class="text-teal fw-600" style="font-size:.875rem">€${plan.price}/ano (Ativo)</p>
              </div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray">Aparelhos Alocados</span>
                <span class="text-navy fw-600">${selected.length} / ${plan.maxAppliances}</span>
              </div>
              <div style="height:8px;background:var(--gray-100);border-radius:999px;overflow:hidden;margin-bottom:1rem">
                <div style="height:100%;width:${(selected.length / plan.maxAppliances) * 100}%;background:var(--teal)"></div>
              </div>
              <button class="btn btn-outline w-full" data-nav="/appliances" style="font-size:.82rem">Gerir Equipamentos</button>
            ` : `
              <p class="text-gray text-sm mb-4">Ainda não tem nenhum plano ativo.</p>
              <button class="btn btn-primary w-full" data-nav="/plans">Escolher um Plano →</button>
            `}
          </div>

          <div class="card p-5">
            <h3 style="font-size:1rem;margin-bottom:1rem">Eletrodomésticos Incluídos</h3>
            ${selected.length === 0 ? `
              <p class="text-gray text-sm">Nenhum aparelho selecionado até ao momento.</p>
            ` : `
              <div style="display:flex;flex-direction:column;gap:10px">
                ${selected.map(a => `
                  <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--gray-50)">
                    <span style="font-size:1.2rem">${CATEGORY_ICONS[a.category] || '📦'}</span>
                    <div>
                      <p class="text-navy text-sm fw-600">${a.name}</p>
                      <p class="text-gray" style="font-size:.72rem">${a.brand}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Coluna Direita: Estado de Logística -->
        <div>
          <div class="card p-5 mb-5">
            <h2 style="font-size:1.1rem;margin-bottom:1rem">Estado dos Envios</h2>
            ${deliveries.length === 0 ? `
              <p class="text-gray text-sm mb-4">Nenhuma entrega agendada no sistema.</p>
              ${selected.length > 0 ? `<button class="btn btn-primary w-full" data-nav="/delivery">📅 Agendar Entregas Técnicas</button>` : ''}
            ` : `
              <div style="display:flex;flex-direction:column;gap:12px">
                ${deliveries.map(d => `
                  <div style="padding:12px;background:var(--gray-50);border-radius:10px;border-left:4px solid var(--teal)">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-navy text-sm fw-600">${d.applianceName}</span>
                      <span class="badge bg-teal" style="font-size:.65rem">Confirmada</span>
                    </div>
                    <p class="text-gray" style="font-size:.75rem">📅 Data: ${d.date} (${d.slot})</p>
                    <p class="text-gray" style="font-size:.75rem">📍 Morada: ${d.addr}</p>
                  </div>
                `).join('')}
                ${selected.length > deliveries.length ? `
                  <div class="info-banner info-amber text-xs mt-2">
                    ⚠️ Tens eletrodomésticos na lista sem agendamento feito.
                    <button data-nav="/delivery" style="background:none;border:none;cursor:pointer;font-weight:600;text-decoration:underline;color:#92400e">Agendar o resto</button>
                  </div>
                ` : ''}
              </div>
            `}
          </div>

          <div class="card p-5">
            <h3 style="font-size:1rem;margin-bottom:.5rem">🔧 Suporte Técnico HomeLoop</h3>
            <p class="text-gray text-sm mb-3">Lembrete: dispõe de duas intervenções gratuitas por ano.</p>
            <div style="background:var(--teal-l);color:var(--teal-d);padding:10px;border-radius:8px;font-size:.8rem;text-align:center;font-weight:600">
              📞 Contacto Direto: 800 20 30 40 (Grátis)
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
