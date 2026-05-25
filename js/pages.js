// ─── REGISTER ────────────────────────────────────────────────────────────────
function renderRegister() {
  document.getElementById('page-register').innerHTML = `
  <div class="login-screen">
    <div class="login-box" style="max-width:460px">
      <div class="login-logo">Home<span>Loop</span></div>
      <p class="login-sub">Crie a sua conta para começar</p>
      <div class="login-err" id="reg-err"></div>
      <div class="field">
        <label>Nome completo</label>
        <input type="text" id="r-name" placeholder="Ex: Maria Silva">
      </div>
      <div class="field">
        <label>Idade</label>
        <input type="text" id="r-age" placeholder="Ex: 25" style="max-width:120px">
        <p style="font-size:.72rem;color:var(--gray-400);margin-top:4px">É necessário ter 18 ou mais anos.</p>
      </div>
      <div class="field">
        <label>Email</label>
        <input type="text" id="r-email" placeholder="email@exemplo.com">
      </div>
      <div class="field">
        <label>Password</label>
        <input type="text" id="r-pass" placeholder="Mínimo 4 caracteres">
      </div>
      <div class="field">
        <label>Confirmar password</label>
        <input type="text" id="r-pass2" placeholder="Repita a password" onkeydown="if(event.key==='Enter')doRegister()">
      </div>
      <button class="btn btn-primary w-full" onclick="doRegister()" style="margin-top:.5rem">Criar conta →</button>
      <p style="text-align:center;font-size:.82rem;color:var(--gray-400);margin-top:1rem">
        Já tem conta? <button data-nav="/login" style="background:none;border:none;cursor:pointer;color:var(--teal-d);font-weight:600">Entrar</button>
      </p>
    </div>
  </div>`;
}

function doRegister() {
  const name  = document.getElementById('r-name')?.value?.trim();
  const age   = document.getElementById('r-age')?.value?.trim();
  const email = document.getElementById('r-email')?.value?.trim();
  const pass  = document.getElementById('r-pass')?.value;
  const pass2 = document.getElementById('r-pass2')?.value;
  const errEl = document.getElementById('reg-err');

  const showErr = msg => {
    errEl.textContent = msg;
    errEl.classList.add('show');
  };

  if (pass !== pass2) return showErr('As passwords não coincidem.');

  const result = registerUser(name, age, email, pass);
  if (!result.ok) return showErr(result.error);

  // login automático após registo
  login(email, pass);
  navigate('/');
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function renderLogin() {
  document.getElementById('page-login').innerHTML = `
  <div class="login-screen">
    <div class="login-box">
      <div class="login-logo">Home<span>Loop</span></div>
      <p class="login-sub">Entre na sua conta para continuar</p>
      <div class="login-err" id="login-err"></div>
      <div class="field">
        <label>Email</label>
        <input type="text" id="l-email" placeholder="email@exemplo.com" autocomplete="email">
      </div>
      <div class="field">
        <label>Password</label>
        <input type="text" id="l-pass" placeholder="A sua password" onkeydown="if(event.key==='Enter')doLogin()">
      </div>
      <button class="btn btn-primary w-full" onclick="doLogin()" style="margin-top:.5rem">Entrar →</button>
      <p style="text-align:center;font-size:.82rem;color:var(--gray-400);margin-top:1rem">
        Ainda não tem conta? <button data-nav="/register" style="background:none;border:none;cursor:pointer;color:var(--teal-d);font-weight:600">Registar-se</button>
      </p>
    </div>
  </div>`;
}

function doLogin() {
  const email = document.getElementById('l-email')?.value?.trim();
  const pass  = document.getElementById('l-pass')?.value;
  if (login(email, pass)) {
    navigate('/');
  } else {
    const err = document.getElementById('login-err');
    err.textContent = 'Email ou password incorretos.';
    err.classList.add('show');
  }
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function renderHome() {
  const loggedIn = isLoggedIn();
  document.getElementById('page-home').innerHTML = `
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">⭐ Eleito o melhor serviço de subscrição de eletrodomésticos</div>
      <h1>Eletrodomésticos<br><span>como Serviço</span></h1>
      <p class="hero-desc">
        Alugue eletrodomésticos premium a partir de <strong>€600/ano</strong>.
        Entrega, instalação e 2 manutenções gratuitas incluídas.
      </p>
      <div class="hero-btns">
        ${loggedIn
          ? `<button class="btn btn-primary" data-nav="/plans">Ver Planos →</button>
             <button class="btn btn-ghost" data-nav="/appliances">Ver Catálogo</button>`
          : `<button class="btn btn-primary" data-nav="/register">Registar-se →</button>
             <button class="btn btn-ghost" data-nav="/login">Já tenho conta</button>`}
      </div>
      <div class="hero-trust">
        <span class="hero-trust-item">✅ Dois planos disponíveis</span>
        <span class="hero-trust-item">✅ Cancelar a qualquer momento</span>
        <span class="hero-trust-item">✅ Instalação gratuita</span>
      </div>
    </div>
  </section>

  <div class="stats-bar">
    <div class="stats-inner">
      <div class="stat-item"><div class="stat-val">12.000+</div><div class="stat-lbl">Clientes satisfeitos</div></div>
      <div class="stat-item"><div class="stat-val">48.500+</div><div class="stat-lbl">Eletrodomésticos alugados</div></div>
      <div class="stat-item"><div class="stat-val">35+</div><div class="stat-lbl">Cidades servidas</div></div>
      <div class="stat-item"><div class="stat-val">4,9/5</div><div class="stat-lbl">Satisfação</div></div>
    </div>
  </div>

  <section class="section" style="background:white">
    <div class="sec-inner">
      <div class="sec-hdr">
        <h2>Escolha o seu plano</h2>
        <p>Dois planos para se adaptar às suas necessidades.</p>
      </div>
      <div class="plans-grid">
        <div class="plan-card" data-nav="${loggedIn?'/plans':'/register'}">
          <div class="plan-head"><h3>Plano Parcial</h3>
            <div class="plan-price-row"><span class="plan-price">€600</span><span class="plan-period">/ano</span></div>
          </div>
          <div class="plan-body">
            <div class="plan-feature"><span>✓</span> 4 eletrodomésticos incluídos</div>
            <div class="plan-feature"><span>✓</span> 2 manutenções gratuitas/ano</div>
            <div class="plan-feature"><span>✓</span> Entrega e instalação</div>
          </div>
        </div>
        <div class="plan-card" style="border-color:var(--teal)" data-nav="${loggedIn?'/plans':'/register'}">
          <div class="plan-head" style="position:relative">
            <div style="position:absolute;top:10px;right:10px;background:var(--teal);color:white;font-size:.7rem;padding:2px 10px;border-radius:999px">Mais popular</div>
            <h3>Plano Completo</h3>
            <div class="plan-price-row"><span class="plan-price">€1.000</span><span class="plan-period">/ano</span></div>
          </div>
          <div class="plan-body">
            <div class="plan-feature"><span>✓</span> 8 eletrodomésticos incluídos</div>
            <div class="plan-feature"><span>✓</span> 2 manutenções gratuitas/ano</div>
            <div class="plan-feature"><span>✓</span> Entrega e instalação</div>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:2rem">
        <button class="btn btn-primary" data-nav="${loggedIn?'/plans':'/register'}">
          ${loggedIn?'Escolher plano →':'Registar-se e subscrever →'}
        </button>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--gray-50)">
    <div class="sec-inner">
      <div class="sec-hdr"><h2>Porquê escolher a HomeLoop?</h2></div>
      <div class="benefit-grid">
        ${[
          {i:'⚡',t:'Sem custos iniciais',d:'Eletrodomésticos premium sem investimento inicial.'},
          {i:'🔧',t:'Manutenção incluída',d:'2 reparações gratuitas/ano. Extras a 50% do valor.'},
          {i:'🚚',t:'Entrega em 7–30 dias',d:'Entrega e instalação profissional incluídas.'},
          {i:'🔄',t:'Flexível',d:'Anule o aluguer de qualquer eletrodoméstico quando quiser.'},
        ].map(b=>`<div class="card benefit-card"><div class="benefit-icon">${b.i}</div><h3>${b.t}</h3><p>${b.d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="background:white">
    <div class="sec-inner">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:1.5rem">
        <div>
          <h2 style="margin-bottom:4px">Eletrodomésticos disponíveis</h2>
          <p class="text-gray" style="font-size:.9rem">Marcas premium, tudo incluído na subscrição.</p>
        </div>
        <button class="text-teal fw-600 text-sm" data-nav="${loggedIn?'/appliances':'/register'}"
          style="background:none;border:none;cursor:pointer">Ver todos →</button>
      </div>
      <div class="app-grid">${APPLIANCES.slice(0,6).map(a=>appCard(a)).join('')}</div>
    </div>
  </section>

  <section style="background:linear-gradient(135deg,var(--teal),var(--teal-d));padding:4.5rem 1.5rem;text-align:center">
    <h2 style="color:white;font-size:clamp(1.6rem,3.5vw,2.2rem);margin-bottom:.875rem">Pronto para alugar de forma inteligente?</h2>
    <p style="color:#ccfbf1;margin-bottom:1.75rem;max-width:30rem;margin-left:auto;margin-right:auto;font-size:.95rem">
      Junte-se a milhares de famílias que desfrutam de eletrodomésticos premium sem complicações.
    </p>
    <button class="btn" data-nav="${loggedIn?'/plans':'/register'}"
      style="background:white;color:var(--teal-d);font-weight:600">
      ${loggedIn?'Escolher plano →':'Criar conta gratuita →'}
    </button>
  </section>`;
}

// ─── PLANS ────────────────────────────────────────────────────────────────────
function renderPlans() {
  const current = getCurrentPlan();
  document.getElementById('page-plans').innerHTML = `
  <div class="ph"><div class="ph-inner">
    <h1>Escolha o seu Plano</h1>
    <p>Selecione o plano que melhor se adapta às suas necessidades.</p>
  </div></div>
  <div class="pc">
    <div class="plans-grid" style="max-width:700px;margin:0 auto 2.5rem">
      ${Object.values(PLANS).map(plan=>`
        <div class="plan-card ${current?.id===plan.id?'selected':''}" onclick="choosePlan('${plan.id}')">
          <div class="plan-head" style="position:relative">
            ${plan.id==='completo'?'<div style="position:absolute;top:10px;right:10px;background:var(--teal);color:white;font-size:.7rem;padding:2px 10px;border-radius:999px">Mais popular</div>':''}
            <h3>${plan.name}</h3>
            <div class="plan-price-row">
              <span class="plan-price">€${plan.price.toLocaleString('pt-PT')}</span>
              <span class="plan-period">/ano</span>
            </div>
            <p style="color:#94a3b8;font-size:.78rem;margin-top:4px">≈ €${(plan.price/12).toFixed(2).replace('.',',')}/mês</p>
          </div>
          <div class="plan-body">
            <div class="plan-feature"><span>✓</span> <strong>${plan.maxAppliances} eletrodomésticos</strong> incluídos</div>
            <div class="plan-feature"><span>✓</span> 2 manutenções gratuitas/ano</div>
            <div class="plan-feature"><span>✓</span> Reparações extra a 50% do valor</div>
            <div class="plan-feature"><span>✓</span> Entrega em janela de 7–30 dias</div>
            <div class="plan-feature"><span>✓</span> Contrato mínimo 12 meses</div>
            <div class="plan-feature"><span>✓</span> Suporte ao cliente 24/7</div>
          </div>
        </div>`).join('')}
    </div>
    ${current ? `
    <div style="text-align:center">
      <p class="text-gray text-sm mb-4">Plano selecionado: <strong class="text-navy">${current.name}</strong> — ${current.maxAppliances} eletrodomésticos · €${current.price}/ano</p>
      <button class="btn btn-primary" data-nav="/appliances">Escolher eletrodomésticos →</button>
    </div>` : '<div style="text-align:center"><p class="text-gray text-sm">Clique num plano para o selecionar.</p></div>'}
    <div style="max-width:700px;margin:3rem auto 0">
      <div class="card" style="overflow:hidden">
        <table style="width:100%;border-collapse:collapse;font-size:.875rem">
          <thead><tr style="background:var(--gray-50);border-bottom:1px solid var(--gray-100)">
            <th style="text-align:left;padding:12px 20px;color:var(--gray-500);font-size:.72rem;text-transform:uppercase">Característica</th>
            <th style="text-align:center;padding:12px 20px;color:var(--navy)">Parcial</th>
            <th style="text-align:center;padding:12px 20px;color:var(--teal-d)">Completo</th>
          </tr></thead>
          <tbody>
            ${[
              ['Preço anual','€600','€1.000'],
              ['Eletrodomésticos','4','8'],
              ['Manutenções gratuitas/ano','2','2'],
              ['Reparações adicionais','50% do valor','50% do valor'],
              ['Janela de entrega','7–30 dias','7–30 dias'],
              ['Contrato mínimo','12 meses','12 meses'],
            ].map(([f,p,c],i)=>`
              <tr style="border-bottom:1px solid var(--gray-50);background:${i%2===0?'white':'var(--gray-50)'}">
                <td style="padding:12px 20px;color:var(--gray-600)">${f}</td>
                <td style="padding:12px 20px;text-align:center;color:var(--gray-700)">${p}</td>
                <td style="padding:12px 20px;text-align:center;color:var(--teal-d);font-weight:600">${c}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function choosePlan(planId) { selectPlan(planId); renderPlans(); }

// ─── APPLIANCES ───────────────────────────────────────────────────────────────
let appFilter = 'Todos', appSearch = '';

function renderAppliances() {
  const plan = getCurrentPlan();
  const selected = getSelectedAppliances();
  const cats = ['Todos', ...new Set(APPLIANCES.map(a=>a.category))];
  const filtered = APPLIANCES.filter(a => {
    const mc = appFilter==='Todos' || a.category===appFilter;
    const ms = a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
               a.category.toLowerCase().includes(appSearch.toLowerCase()) ||
               a.brand.toLowerCase().includes(appSearch.toLowerCase());
    return mc && ms;
  });

  document.getElementById('page-appliances').innerHTML = `
  <div class="ph"><div class="ph-inner">
    <h1>Catálogo de Eletrodomésticos</h1>
    ${!plan
      ? `<div class="info-banner info-amber mt-3" style="max-width:520px">
           ⚠️ Ainda não escolheu um plano.
           <button data-nav="/plans" style="background:none;border:none;cursor:pointer;color:#92400e;font-weight:600;text-decoration:underline">Escolher plano →</button>
         </div>`
      : `<p class="text-gray" style="font-size:.9rem;margin-top:4px">${plan.name} — até <strong>${plan.maxAppliances} eletrodomésticos</strong></p>
         <div class="prog-wrap">
           <div class="prog-bar-track">
             <div class="prog-bar-fill" style="width:${(selected.length/plan.maxAppliances)*100}%"></div>
           </div>
           <span class="text-sm text-gray">${selected.length}/${plan.maxAppliances} selecionados</span>
           ${selected.length>0?`<button class="btn btn-primary" data-nav="/subscription" style="padding:8px 18px;font-size:.82rem">Ver subscrição →</button>`:''}
         </div>`}
  </div></div>
  <div class="pc">
    <div class="filter-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="app-search" placeholder="Pesquisar por nome, categoria ou marca..." value="${appSearch}" oninput="onSearch(this.value)">
      </div>
      <div class="filter-pills">
        ${cats.map(c=>`<button class="fpill ${appFilter===c?'active':''}" onclick="onFilter('${c}')">${c!=='Todos'?(CATEGORY_ICONS[c]||'')+' ':''}${c}</button>`).join('')}
      </div>
    </div>
    <p class="text-gray text-xs mb-4">${filtered.length} eletrodomésticos disponíveis</p>
    <div class="app-grid" id="app-grid">
      ${filtered.length>0 ? filtered.map(a=>appCard(a)).join('')
        : '<div style="grid-column:1/-1;text-align:center;padding:4rem 0"><p style="font-size:2.5rem">🔍</p><p class="text-gray mt-3">Nenhum resultado encontrado.</p></div>'}
    </div>
  </div>
  <div class="sticky-bar ${selected.length>0&&plan?'show':''}" id="sticky-bar">
    <div class="sticky-inner">
      <div>
        <p class="text-navy text-sm fw-600">${selected.length} eletrodoméstico${selected.length!==1?'s':''} selecionado${selected.length!==1?'s':''}</p>
        <p class="text-gray truncate" style="font-size:.72rem;max-width:300px;margin-top:2px">${selected.map(a=>a.name).join(', ')}</p>
      </div>
      <button class="btn btn-primary" data-nav="/subscription">Ver subscrição →</button>
    </div>
  </div>`;
}

function onSearch(val) {
  appSearch = val;
  const filtered = APPLIANCES.filter(a => {
    const mc = appFilter==='Todos'||a.category===appFilter;
    const ms = a.name.toLowerCase().includes(val.toLowerCase())||
               a.category.toLowerCase().includes(val.toLowerCase())||
               a.brand.toLowerCase().includes(val.toLowerCase());
    return mc && ms;
  });
  const grid = document.getElementById('app-grid');
  if (grid) grid.innerHTML = filtered.length>0
    ? filtered.map(a=>appCard(a)).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:4rem 0"><p style="font-size:2.5rem">🔍</p><p class="text-gray mt-3">Nenhum resultado.</p></div>';
}

function onFilter(cat) { appFilter=cat; renderAppliances(); }

// ─── SUBSCRIPTION ─────────────────────────────────────────────────────────────
function renderSubscription() {
  const plan = getCurrentPlan();
  const selected = getSelectedAppliances();
  const el = document.getElementById('page-subscription');

  if (!plan) {
    el.innerHTML = `<div class="success-wrap"><div class="success-box">
      <div class="success-icon">📋</div>
      <h2 style="margin-bottom:12px">Sem plano selecionado</h2>
      <p class="text-gray mb-6">Escolha primeiro um plano para continuar.</p>
      <button class="btn btn-primary w-full" data-nav="/plans">Escolher Plano →</button>
    </div></div>`;
    return;
  }

  const remaining = plan.maxAppliances - selected.length;
  const canConfirm = selected.length > 0;

  el.innerHTML = `
  <div class="ph"><div class="ph-inner">
    <h1>A Sua Subscrição</h1>
    <p>Reveja o seu plano e confirme a subscrição anual.</p>
  </div></div>
  <div class="pc">
    <div class="sub-grid">
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 style="font-size:1.1rem">Eletrodomésticos selecionados</h2>
          <span class="text-gray text-sm">${selected.length}/${plan.maxAppliances}</span>
        </div>
        <div class="card p-4 mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span>${selected.length} de ${plan.maxAppliances}</span>
            <span class="${remaining===0?'text-red':'text-teal'}">${remaining} restantes</span>
          </div>
          <div style="height:8px;background:var(--gray-100);border-radius:999px;overflow:hidden">
            <div style="height:100%;width:${(selected.length/plan.maxAppliances)*100}%;background:${selected.length===plan.maxAppliances?'#f97316':'linear-gradient(90deg,#2dd4bf,var(--teal))'};border-radius:999px;transition:width .5s"></div>
          </div>
          <div class="slot-row mt-3">
            ${Array.from({length:plan.maxAppliances}).map((_,i)=>`
              <div class="slot ${i<selected.length?'filled':'empty'}">
                ${i<selected.length?(CATEGORY_ICONS[selected[i].category]||'📦'):'+'}
              </div>`).join('')}
          </div>
        </div>
        ${selected.length===0 ? `
          <div class="card" style="border:2px dashed var(--gray-200);padding:2.5rem;text-align:center">
            <p style="font-size:2.5rem;margin-bottom:1rem">🏠</p>
            <h3 style="margin-bottom:8px">Nenhum eletrodoméstico selecionado</h3>
            <p class="text-gray text-sm mb-4">Adicione pelo menos 1 para continuar.</p>
            <button class="btn btn-primary" data-nav="/appliances">Ver Catálogo</button>
          </div>` : `
          <div style="display:flex;flex-direction:column;gap:10px">
            ${selected.map(a=>`
              <div class="card p-4 flex items-center gap-3">
                <img src="${a.image}" alt="${a.name}" style="width:60px;height:60px;border-radius:11px;object-fit:cover;flex-shrink:0"
                  onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop'">
                <div style="flex:1;min-width:0">
                  <p style="font-size:.72rem;color:var(--teal-d);font-weight:600">${a.brand}</p>
                  <p class="text-navy text-sm fw-600 truncate">${a.name}</p>
                  <p class="text-gray" style="font-size:.72rem">${CATEGORY_ICONS[a.category]||''} ${a.category}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="badge bg-teal">Incluído</span>
                  <button onclick="handleCancelAppliance('${a.id}')"
                    style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;cursor:pointer;padding:5px 10px;font-size:.72rem;color:var(--red);font-family:'DM Sans',sans-serif"
                    title="Anular aluguer">✕ Anular</button>
                </div>
              </div>`).join('')}
            ${selected.length<plan.maxAppliances?`
              <button class="card flex items-center gap-3 p-4" data-nav="/appliances"
                style="border:2px dashed var(--gray-200);cursor:pointer;color:var(--gray-400);background:none;width:100%;text-align:left">
                <div style="width:60px;height:60px;border-radius:11px;background:var(--gray-100);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">+</div>
                <span class="text-sm">Adicionar mais (${remaining} lugares livres)</span>
              </button>`:''}
          </div>`}
      </div>
      <div>
        <div class="card" style="overflow:hidden">
          <div class="plan-head-card">
            <p style="color:var(--teal);font-size:.82rem;font-weight:600;margin-bottom:6px">${plan.name}</p>
            <div class="flex items-end gap-2">
              <span style="font-family:'Sora',sans-serif;font-size:2.2rem;font-weight:700;color:white">€${plan.price.toLocaleString('pt-PT')}</span>
              <span style="color:#94a3b8;margin-bottom:6px">/ano</span>
            </div>
            <p style="color:#94a3b8;font-size:.78rem;margin-top:3px">≈ €${(plan.price/12).toFixed(2).replace('.',',')}/mês</p>
          </div>
          <div class="p-5">
            ${[`Até ${plan.maxAppliances} eletrodomésticos`,'2 manutenções gratuitas/ano','Entrega e instalação','Suporte 24/7','Cancelamento com 30 dias de aviso'].map(f=>
              `<div class="flex gap-2 text-sm mb-2" style="color:var(--gray-600)"><span style="color:var(--teal);flex-shrink:0">✓</span>${f}</div>`).join('')}
            <div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--gray-100)">
              <div class="flex justify-between text-sm mb-2"><span class="text-gray">Eletrodomésticos</span><span class="text-navy">${selected.length}/${plan.maxAppliances}</span></div>
              <div class="flex justify-between text-sm mb-3"><span class="text-gray">Plano</span><span class="text-navy">${plan.name}</span></div>
              <div class="flex justify-between" style="font-size:1rem;border-top:1px solid var(--gray-100);padding-top:10px">
                <span class="text-navy fw-600">Total hoje</span>
                <span class="text-teal fw-600">€${plan.price.toLocaleString('pt-PT')}</span>
              </div>
            </div>
            <button onclick="handleConfirmSub()" class="btn btn-primary w-full mt-4" ${!canConfirm?'disabled':''}>
              Confirmar Subscrição →
            </button>
            ${!canConfirm?'<p class="text-gray text-xs text-center mt-2">Selecione pelo menos 1 eletrodoméstico</p>':''}
          </div>
        </div>
        <div class="info-banner info-teal mt-3">
          ℹ️ Contrato mínimo 12 meses. Cancelamento com 30 dias de aviso prévio.
        </div>
        <button class="btn btn-outline w-full mt-3" data-nav="/plans" style="font-size:.82rem">Mudar de plano</button>
      </div>
    </div>
  </div>`;
}

function handleConfirmSub() {
  if (getSelectedAppliances().length===0) return;
  confirmSubscription();
  navigate('/delivery');
}

// ─── DELIVERY ─────────────────────────────────────────────────────────────────
const MONTHS=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const SLOTS=['08:00 – 10:00','10:00 – 12:00','12:00 – 14:00','14:00 – 16:00','16:00 – 18:00'];
let dState={yr:null,mo:null,date:null,slot:null,addr:''};

function renderDelivery() {
  const today=new Date();
  const minD=new Date(today); minD.setDate(today.getDate()+7);
  const maxD=new Date(today); maxD.setDate(today.getDate()+30);
  if (!dState.yr){dState.yr=minD.getFullYear();dState.mo=minD.getMonth();}

  const {yr,mo,date,slot,addr}=dState;
  const dim=new Date(yr,mo+1,0).getDate();
  const fd=new Date(yr,mo,1).getDay();
  const sel=getSelectedAppliances();
  const deliveries=getDeliveries();

  const avail=d=>{const x=new Date(yr,mo,d);return x>=minD&&x<=maxD&&x.getDay()!==0&&x.getDay()!==6;};
  const isSel=d=>date&&date.getDate()===d&&date.getMonth()===mo&&date.getFullYear()===yr;

  document.getElementById('page-delivery').innerHTML=`
  <div class="ph"><div class="ph-inner">
    <h1>Agendar Entrega</h1>
    <p>Escolha uma data entre 7 e 30 dias. Apenas dias úteis.</p>
  </div></div>
  <div class="pc">
    ${deliveries.length>0?`
    <div class="card p-5 mb-6">
      <h3 style="font-size:1rem;margin-bottom:.875rem">📦 Entregas agendadas</h3>
      ${deliveries.map((d,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <span style="font-size:1.5rem">🚚</span>
          <div>
            <p class="text-navy text-sm fw-600">${d.date}</p>
            <p class="text-gray text-xs">${d.slot} · ${d.addr}</p>
          </div>
          <span class="badge bg-green" style="margin-left:auto">Agendada</span>
        </div>`).join('')}
    </div>` : ''}
    <div class="del-grid">
      <div>
        <div class="info-banner info-blue mb-5">
          ℹ️ Entregas disponíveis<strong>de segunda a sexta-feira</strong>, entre
          <strong>${minD.toLocaleDateString('pt-PT',{day:'numeric',month:'long'})}</strong> e
          <strong>${maxD.toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'})}</strong>.
        </div>
        <div class="card p-6 mb-5">
          <div class="cal-nav">
            <button onclick="prevMo()" style="background:none;border:none;cursor:pointer;padding:8px;font-size:1.3rem;color:var(--gray-600)">‹</button>
            <h3 style="font-size:1rem">${MONTHS[mo]} ${yr}</h3>
            <button onclick="nextMo()" style="background:none;border:none;cursor:pointer;padding:8px;font-size:1.3rem;color:var(--gray-600)">›</button>
          </div>
          <div class="cal-grid">
            ${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d=>`<div class="cal-dn">${d}</div>`).join('')}
            ${Array.from({length:fd}).map(()=>'<div></div>').join('')}
            ${Array.from({length:dim}).map((_,i)=>{
              const d=i+1,a=avail(d),s=isSel(d);
              return `<button class="cal-day${s?' sel':''}" ${!a?'disabled':''} onclick="pickDate(${d})">${d}</button>`;
            }).join('')}
          </div>
        </div>
        ${date?`
        <div class="card p-6 mb-5">
          <div class="flex items-center gap-2 mb-3"><span>🕐</span><h3 style="font-size:1rem">Janelas horárias</h3></div>
          <p class="text-gray text-sm mb-4">Para ${date.toLocaleDateString('pt-PT',{weekday:'long',day:'numeric',month:'long'})}</p>
          <div class="ts-grid">
            ${SLOTS.map(s=>`<button class="ts-btn${slot===s?' sel':''}" onclick="pickSlot('${s}')">${s}</button>`).join('')}
          </div>
        </div>`:''}
        ${date&&slot?`
        <div class="card p-6">
          <div class="flex items-center gap-2 mb-3"><span>📍</span><h3 style="font-size:1rem">Morada de entrega</h3></div>
          <input type="text" id="d-addr" placeholder="Morada completa de entrega..." value="${addr}" oninput="dState.addr=this.value">
        </div>`:''}
      </div>
      <div>
        <div class="card p-5">
          <h3 style="font-size:1rem;margin-bottom:1rem">Resumo</h3>
          <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:1.25rem;font-size:.875rem">
            <div class="flex justify-between"><span class="text-gray">Data</span><span class="text-navy">${date?date.toLocaleDateString('pt-PT',{day:'numeric',month:'short',year:'numeric'}):'—'}</span></div>
            <div class="flex justify-between"><span class="text-gray">Horário</span><span class="text-navy">${slot||'—'}</span></div>
            <div class="flex justify-between"><span class="text-gray">Eletrodomésticos</span><span class="text-navy">${sel.length}</span></div>
            <div class="flex justify-between"><span class="text-gray">Taxa de entrega</span><span class="text-teal">Gratuita</span></div>
          </div>
          <button onclick="confirmDel()" class="btn btn-primary w-full" ${!date||!slot||!addr?'disabled':''}>
            🚚 Confirmar Entrega
          </button>
          ${!date?'<p class="text-gray text-xs text-center mt-2">Selecione uma data</p>':
            !slot?'<p class="text-gray text-xs text-center mt-2">Escolha um horário</p>':
            !addr?'<p class="text-gray text-xs text-center mt-2">Introduza a morada</p>':''}
        </div>
      </div>
    </div>
  </div>`;
}

function prevMo(){if(dState.mo===0){dState.mo=11;dState.yr--;}else dState.mo--;renderDelivery();}
function nextMo(){if(dState.mo===11){dState.mo=0;dState.yr++;}else dState.mo++;renderDelivery();}
function pickDate(d){dState.date=new Date(dState.yr,dState.mo,d);dState.slot=null;renderDelivery();}
function pickSlot(s){dState.slot=s;renderDelivery();}

function confirmDel(){
  if(!dState.date||!dState.slot||!dState.addr) return;
  const del={
    date:dState.date.toLocaleDateString('pt-PT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),
    slot:dState.slot, addr:dState.addr
  };
  saveDelivery(del);
  // reset form para permitir agendar outra
  dState={yr:null,mo:null,date:null,slot:null,addr:''};
  renderDeliverySuccess(del);
}

function renderDeliverySuccess(del){
  document.getElementById('page-delivery').innerHTML=`
  <div class="success-wrap"><div class="success-box">
    <div class="success-icon">✅</div>
    <h2 style="margin-bottom:12px">Entrega Agendada!</h2>
    <p class="text-gray mb-2">Data: <strong class="text-navy">${del.date}</strong></p>
    <p class="text-gray mb-6">Horário: <strong class="text-navy">${del.slot}</strong></p>
    <div style="background:var(--gray-50);border-radius:14px;padding:1rem;text-align:left;margin-bottom:1.5rem">
      ${[
        {done:true, label:'Encomenda Confirmada',sub:'Subscrição confirmada'},
        {done:true, label:'A Preparar',sub:'Artigos a ser preparados'},
        {done:false,label:'Em Entrega',sub:'Na janela horária selecionada'},
        {done:false,label:'Entregue e Instalado',sub:'Instalação profissional'},
      ].map(s=>`
        <div class="flex items-center gap-3 mb-3">
          <div style="width:28px;height:28px;border-radius:50%;background:${s.done?'var(--teal)':'var(--gray-200)'};display:flex;align-items:center;justify-content:center;color:${s.done?'white':'var(--gray-400)'};flex-shrink:0;font-size:.8rem">${s.done?'✓':'○'}</div>
          <div><p class="text-sm ${s.done?'text-navy':'text-gray'} fw-600">${s.label}</p><p class="text-gray" style="font-size:.72rem">${s.sub}</p></div>
        </div>`).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn btn-primary w-full" onclick="dState={yr:null,mo:null,date:null,slot:null,addr:''};navigate('/delivery')">
        📅 Agendar outra entrega
      </button>
      <button class="btn btn-outline w-full" data-nav="/dashboard">Ver Painel</button>
    </div>
  </div></div>`;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function renderDashboard(){
  const user=getCurrentUser();
  const plan=getCurrentPlan();
  const selected=getSelectedAppliances();
  const deliveries=getDeliveries();
  const cancelled=(getState().cancelledIds||[]).map(id=>APPLIANCES.find(a=>a.id===id)).filter(Boolean);

  document.getElementById('page-dashboard').innerHTML=`
  <div class="dash-hero">
    <div class="dash-inner">
      <div class="flex justify-between items-center">
        <div>
          <p style="color:var(--teal);font-size:.875rem;margin-bottom:4px">Bem-vindo(a) de volta,</p>
          <h1 style="color:white;font-size:1.8rem;margin-bottom:5px">${user?.name||'Utilizador'}</h1>
          <div class="flex items-center gap-2" style="color:#94a3b8;font-size:.82rem">
            <div style="width:7px;height:7px;background:${plan?'var(--teal)':'#f87171'};border-radius:50%;${plan?'animation:pulse 2s infinite':''}"></div>
            ${plan?`${plan.name} ativo`:'Sem plano ativo'}
          </div>
        </div>
        <button class="btn btn-ghost" onclick="handleLogout()" style="font-size:.82rem">Sair</button>
      </div>
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi-icon">📦</div><div class="kpi-val">${selected.length}/${plan?.maxAppliances||'—'}</div><div class="kpi-lbl">Eletrodomésticos ativos</div></div>
        <div class="kpi"><div class="kpi-icon">💳</div><div class="kpi-val">${plan?`€${plan.price}/ano`:'—'}</div><div class="kpi-lbl">Plano atual</div></div>
        <div class="kpi"><div class="kpi-icon">🚚</div><div class="kpi-val">${deliveries.length}</div><div class="kpi-lbl">Entregas agendadas</div></div>
        <div class="kpi"><div class="kpi-icon">✕</div><div class="kpi-val">${cancelled.length}</div><div class="kpi-lbl">Alugueres anulados</div></div>
      </div>
    </div>
  </div>
  <div class="pc">
    <div style="display:grid;grid-template-columns:1fr 300px;gap:2rem">
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        ${!plan?`<div class="info-banner info-amber">⚠️ Ainda não tem plano.
          <button data-nav="/plans" style="background:none;border:none;cursor:pointer;color:#92400e;font-weight:600;text-decoration:underline">Escolher plano →</button>
        </div>`:''}

        <!-- Eletrodomésticos ativos -->
        <div class="card" style="overflow:hidden">
          <div class="flex justify-between items-center p-5" style="border-bottom:1px solid var(--gray-100)">
            <h2 style="font-size:1rem">Os Meus Eletrodomésticos</h2>
            <button class="text-teal text-sm fw-600" data-nav="/appliances" style="background:none;border:none;cursor:pointer">Editar →</button>
          </div>
          <div class="p-4" style="display:flex;flex-direction:column;gap:8px">
            ${selected.length>0 ? selected.map(a=>`
              <div class="flex items-center gap-3 p-3" style="border-radius:11px">
                <img src="${a.image}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0"
                  onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=52&h=52&fit=crop'">
                <div style="flex:1;min-width:0">
                  <p class="text-navy text-sm fw-600 truncate">${a.name}</p>
                  <p class="text-gray" style="font-size:.72rem">${CATEGORY_ICONS[a.category]||''} ${a.category}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="badge bg-green">Ativo</span>
                  <button onclick="handleCancelAppliance('${a.id}')"
                    style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;cursor:pointer;padding:4px 9px;font-size:.7rem;color:var(--red);font-family:'DM Sans',sans-serif">
                    ✕ Anular
                  </button>
                </div>
              </div>`).join('')
            : `<div style="text-align:center;padding:1.5rem">
                <p class="text-gray text-sm">Nenhum eletrodoméstico no plano.</p>
                <button class="btn btn-primary mt-3" data-nav="/appliances" style="font-size:.82rem;padding:8px 18px">Adicionar →</button>
              </div>`}
          </div>
        </div>

        <!-- Alugueres anulados -->
        ${cancelled.length>0?`
        <div class="card" style="overflow:hidden">
          <div class="flex items-center p-5" style="border-bottom:1px solid var(--gray-100);gap:8px">
            <span style="color:var(--red)">✕</span>
            <h2 style="font-size:1rem">Alugueres Anulados</h2>
          </div>
          <div class="p-4" style="display:flex;flex-direction:column;gap:8px">
            ${cancelled.map(a=>`
              <div class="flex items-center gap-3 p-3" style="border-radius:11px;background:var(--gray-50)">
                <img src="${a.image}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0;opacity:.6"
                  onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=52&h=52&fit=crop'">
                <div style="flex:1;min-width:0">
                  <p class="text-gray text-sm fw-600 truncate">${a.name}</p>
                  <p class="text-gray" style="font-size:.72rem">${a.category}</p>
                </div>
                <span class="badge bg-orange">Anulado</span>
              </div>`).join('')}
          </div>
        </div>`:''}

        <!-- Entregas -->
        <div class="card" style="overflow:hidden">
          <div class="flex justify-between items-center p-5" style="border-bottom:1px solid var(--gray-100)">
            <h2 style="font-size:1rem">Entregas</h2>
            <button class="text-teal text-sm fw-600" data-nav="/delivery" style="background:none;border:none;cursor:pointer">
              ${deliveries.length>0?'Agendar outra →':'Agendar →'}
            </button>
          </div>
          <div class="p-4">
            ${deliveries.length>0
              ? deliveries.map(d=>`
                <div class="flex items-center gap-3 p-3 mb-2" style="border-radius:11px;background:var(--gray-50)">
                  <span style="font-size:1.5rem">🚚</span>
                  <div>
                    <p class="text-navy text-sm fw-600">${d.date}</p>
                    <p class="text-gray" style="font-size:.72rem">${d.slot} · ${d.addr}</p>
                  </div>
                  <span class="badge bg-green" style="margin-left:auto">Agendada</span>
                </div>`).join('')
              : `<p class="text-gray text-sm">Ainda não agendou nenhuma entrega.
                  <button data-nav="/delivery" style="background:none;border:none;cursor:pointer;color:var(--teal-d);font-weight:600">Agendar →</button>
                </p>`}
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div style="display:flex;flex-direction:column;gap:1rem">
        ${plan?`
        <div style="background:linear-gradient(135deg,var(--teal),var(--teal-d));border-radius:18px;padding:1.4rem;color:white">
          <p style="color:#ccfbf1;font-size:.8rem;margin-bottom:6px">${plan.name}</p>
          <p style="font-family:'Sora',sans-serif;font-size:1.9rem;font-weight:700">€${plan.price}</p>
          <p style="color:#ccfbf1;font-size:.8rem">/ano · €${(plan.price/12).toFixed(2).replace('.',',')}/mês</p>
          <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.2);font-size:.82rem">
            <div class="flex justify-between mb-2"><span style="color:#ccfbf1">Equipamentos</span><span>${selected.length}/${plan.maxAppliances}</span></div>
            <div class="flex justify-between"><span style="color:#ccfbf1">Renovação</span><span>1 Fev 2027</span></div>
          </div>
          <button class="btn btn-ghost w-full mt-3" data-nav="/plans" style="font-size:.8rem;padding:8px">Mudar plano</button>
        </div>`:`
        <div class="card p-5 text-center">
          <p style="font-size:2rem;margin-bottom:8px">📋</p>
          <p class="text-gray text-sm mb-3">Sem plano ativo</p>
          <button class="btn btn-primary w-full" data-nav="/plans">Escolher Plano</button>
        </div>`}
        <div class="card p-5">
          <h3 style="font-size:.95rem;margin-bottom:.875rem">Ações Rápidas</h3>
          ${[
            {i:'📋',l:'Planos',t:'/plans'},
            {i:'📦',l:'Catálogo',t:'/appliances'},
            {i:'💳',l:'Subscrição',t:'/subscription'},
            {i:'🚚',l:'Agendar entrega',t:'/delivery'},
          ].map(a=>`
            <button data-nav="${a.t}" class="flex items-center gap-3 p-3 w-full"
              style="border-radius:10px;background:none;border:none;cursor:pointer;color:var(--gray-600);margin-bottom:3px;transition:background .15s;font-family:'DM Sans',sans-serif"
              onmouseover="this.style.background='var(--teal-l)'" onmouseout="this.style.background=''">
              <div style="width:30px;height:30px;background:var(--gray-100);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${a.i}</div>
              <span class="text-sm">${a.l}</span>
              <span style="margin-left:auto;color:var(--gray-400)">→</span>
            </button>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}
