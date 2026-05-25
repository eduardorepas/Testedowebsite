// ─── ROUTER ──────────────────────────────────────────────────────────────────
function navigate(path) {
  const pub = ['/', '/login', '/register'];
  if (!pub.includes(path) && !isLoggedIn()) {
    history.pushState(null, '', '/login');
    renderPage('/login'); return;
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
document.addEventListener('click', e => {
  const a = e.target.closest('[data-nav]');
  if (a) { e.preventDefault(); navigate(a.dataset.nav); }
});

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function updateNavbar() {
  const root = document.getElementById('navbar-root');
  if (!root) return;
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();
  const path = location.pathname;
  const selected = getSelectedAppliances();

  const lnk = (label, to, extra='') =>
    `<button class="nb-link ${path===to?'active':''}" data-nav="${to}" ${extra}>${label}</button>`;

  root.innerHTML = `
  <nav class="navbar">
    <div class="nb-inner">
      <div class="nb-logo" data-nav="/">Home<span>Loop</span></div>
      <div class="nb-links">
        ${lnk('Início','/')}
        ${loggedIn ? `
          ${lnk('Catálogo','/appliances')}
          ${lnk('Planos','/plans')}
          ${lnk('Subscrição','/subscription')}
        ` : ''}
      </div>
      <div class="nb-right">
        ${loggedIn ? `
          <span class="nb-user">Olá, <strong>${user.name.split(' ')[0]}</strong></span>
          ${selected.length > 0 ? `
            <button class="nb-cart" data-nav="/subscription">
              🛒 O Meu Plano
              <span class="cart-badge">${selected.length}</span>
            </button>` : ''}
          <button class="btn-logout" onclick="handleLogout()">Sair</button>
        ` : `
          <button class="nb-link" data-nav="/login">Entrar</button>
          <button class="btn nb-cta" data-nav="/register">Registar-se</button>
        `}
      </div>
      <button class="nb-burger" onclick="toggleMobile()">☰</button>
    </div>
    <div class="nb-mobile" id="nb-mobile">
      ${loggedIn ? `
        <button data-nav="/">Início</button>
        <button data-nav="/appliances">Catálogo</button>
        <button data-nav="/plans">Planos</button>
        <button data-nav="/subscription">Subscrição</button>
        <button data-nav="/dashboard">O Meu Painel</button>
        <button onclick="handleLogout()" style="color:var(--red)">Sair</button>
      ` : `
        <button data-nav="/">Início</button>
        <button data-nav="/login">Entrar</button>
        <button data-nav="/register">Registar-se</button>
      `}
    </div>
  </nav>`;
}

function toggleMobile() {
  document.getElementById('nb-mobile')?.classList.toggle('open');
}
function handleLogout() { logout(); navigate('/'); }

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function renderFooter() {
  return `
  <footer style="background:var(--navy);color:white;margin-top:auto">
    <div style="max-width:1280px;margin:0 auto;padding:3rem 1.5rem">
      <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:2rem;flex-wrap:wrap">
        <div>
          <div style="font-family:'Sora',sans-serif;font-size:1.25rem;font-weight:700;margin-bottom:.875rem">
            Home<span style="color:var(--teal)">Loop</span>
          </div>
          <p style="color:#94a3b8;font-size:.82rem;line-height:1.6">
            A forma mais inteligente de equipar a sua casa. Eletrodomésticos premium com entrega, instalação e manutenção incluídas.
          </p>
        </div>
        <div>
          <h4 style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#cbd5e1;margin-bottom:.875rem">Produto</h4>
          ${['Catálogo,/appliances','Planos,/plans','Subscrição,/subscription'].map(i=>{
            const [l,p]=i.split(',');
            return `<button data-nav="${p}" style="display:block;background:none;border:none;cursor:pointer;color:#94a3b8;font-size:.82rem;margin-bottom:7px;font-family:'DM Sans',sans-serif;text-align:left">${l}</button>`;
          }).join('')}
        </div>
        <div>
          <h4 style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#cbd5e1;margin-bottom:.875rem">Empresa</h4>
          ${['Sobre Nós','Carreiras','Blog'].map(i=>`<a href="#" style="display:block;color:#94a3b8;font-size:.82rem;margin-bottom:7px">${i}</a>`).join('')}
        </div>
        <div>
          <h4 style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#cbd5e1;margin-bottom:.875rem">Suporte</h4>
          ${['Centro de Ajuda','Contacte-nos','Privacidade'].map(i=>`<a href="#" style="display:block;color:#94a3b8;font-size:.82rem;margin-bottom:7px">${i}</a>`).join('')}
        </div>
      </div>
      <div style="margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid #334155;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <p style="color:#64748b;font-size:.78rem">© 2026 HomeLoop. Todos os direitos reservados.</p>
        <p style="color:#64748b;font-size:.78rem">alugar com inteligência · viver melhor</p>
      </div>
    </div>
  </footer>`;
}

// ─── APPLIANCE CARD ──────────────────────────────────────────────────────────
function appCard(a, showCancel = false) {
  const sel = isSelected(a.id);
  const plan = getCurrentPlan();
  const state = getState();
  const full = plan && state.selectedIds.length >= plan.maxAppliances;
  const icon = CATEGORY_ICONS[a.category] || '📦';

  let btnClass, btnLabel;
  if (!plan)       { btnClass='no-plan';  btnLabel='Escolha um plano primeiro'; }
  else if (sel)    { btnClass='is-added'; btnLabel='✓ Adicionado — clique para remover'; }
  else if (full)   { btnClass='is-full';  btnLabel=`Plano completo (${plan.maxAppliances}/${plan.maxAppliances})`; }
  else             { btnClass='can-add';  btnLabel='Adicionar à subscrição'; }

  return `
  <div class="app-card ${sel?'selected':''}" id="ac-${a.id}">
    <div class="app-img">
      <img src="${a.image}" alt="${a.name}" loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'">
      <div class="app-cat">${icon} ${a.category}</div>
      ${sel ? '<div class="app-check">✓</div>' : ''}
    </div>
    <div class="app-body">
      <div class="app-brand">${a.brand}</div>
      <div class="app-name">${a.name}</div>
      <div class="app-desc">${a.description}</div>
      <div class="app-feats">${a.features.map(f=>`<span class="app-feat">${f}</span>`).join('')}</div>
      ${showCancel ? `
        <button class="btn-add" style="background:#fee2e2;color:var(--red);border:1px solid #fca5a5"
          onclick="handleCancelAppliance('${a.id}')">
          ✕ Anular aluguer
        </button>` : `
        <button class="btn-add ${btnClass}" onclick="toggleApp('${a.id}')"
          ${btnClass==='is-full'||btnClass==='no-plan'?'disabled':''}>
          ${btnLabel}
        </button>`}
    </div>
  </div>`;
}

function toggleApp(id) {
  if (!getCurrentPlan()) { navigate('/plans'); return; }
  if (isSelected(id)) removeAppliance(id);
  else addAppliance(id);
  renderPage(location.pathname);
}

function handleCancelAppliance(id) {
  const a = APPLIANCES.find(x => x.id === id);
  if (!a) return;
  if (confirm(`Tem a certeza que quer anular o aluguer de "${a.name}"? Esta ação remove o equipamento do seu plano.`)) {
    cancelAppliance(id);
    renderPage(location.pathname);
  }
}
