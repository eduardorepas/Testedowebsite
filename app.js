// ===== BASE DE DADOS DE ELETRODOMÉSTICOS =====
const appliancesData = [
    { id: "app-1", name: "Frigorífico Americano NoFrost", brand: "Samsung", category: "Cozinha", desc: "Capacidade de 634L com dispensador de água e gelo.", features: ["Classe E", "Inverter", "Digital Touch"] },
    { id: "app-2", name: "Máquina de Lavar Roupa EcoBubble", brand: "Samsung", category: "Lavandaria", desc: "Capacidade de 9kg com tecnologia de lavagem a frio inteligente.", features: ["9kg", "1400 rpm", "Wi-Fi"] },
    { id: "app-3", name: "Forno de Encastre Inox Multifunções", brand: "Bosch", category: "Cozinha", desc: "Auto-limpeza pirolítica e distribuição uniforme de calor 3D.", features: ["Classe A+", "71 Litros", "Pirolítico"] },
    { id: "app-4", name: "Máquina de Lavar Louça ExtraSilêncio", brand: "Bosch", category: "Cozinha", desc: "Motor EcoSilence eficiente com gaveta dedicada para talheres.", features: ["14 Talheres", "Home Connect"] },
    { id: "app-5", name: "Ar Condicionado Split Inverter", brand: "LG", category: "Climatização", desc: "Arrefecimento ultra-rápido e purificação de ar avançada.", features: ["12000 BTU", "Silencioso"] },
    { id: "app-6", name: "Micro-ondas de Encastre Grill", brand: "LG", category: "Cozinha", desc: "Tecnologia Smart Inverter para aquecimento homogéneo.", features: ["25 Litros", "Grill Quartz"] },
    { id: "app-7", name: "Máquina de Secar Roupa por Bomba de Calor", brand: "Whirlpool", category: "Lavandaria", desc: "Secagem delicada que protege as fibras mais sensíveis.", features: ["8kg", "Bomba de Calor"] },
    { id: "app-8", name: "Placa de Indução FlexInduction", brand: "Siemens", category: "Cozinha", desc: "Zonas flexíveis que detetam automaticamente o formato dos recipientes.", features: ["4 Zonas", "Boost Control"] }
];

const MAX_SLOTS = 8;
const ANNUAL_PRICE = 1000;

let state = {
    isAuthenticated: false,
    currentUser: null,
    cart: [],
    currentCategory: "Todos",
    searchQuery: "",
    subscription: null
};

document.addEventListener("DOMContentLoaded", () => {
    loadFromStorage();
    if (state.isAuthenticated) {
        showAuthenticatedUI();
        initNavigation();
        initCatalogFilters();
        initSearch();
        initCheckoutTriggers();
        setupDeliveryDateConstraints();
        renderCatalog();
        renderCart();
    } else {
        showLoginUI();
    }
});

function getStorageKey() {
    return `homeloop_${state.currentUser?.id || 'guest'}`;
}

function saveToStorage() {
    const key = state.currentUser ? `homeloop_${state.currentUser.id}` : 'homeloop_guest';
    localStorage.setItem(key, JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        cart: state.cart,
        subscription: state.subscription
    }));
}

function loadFromStorage() {
    const saved = localStorage.getItem('homeloop_state');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.isAuthenticated = data.isAuthenticated;
            state.currentUser = data.currentUser;
            state.cart = data.cart || [];
            state.subscription = data.subscription || null;
            
            if (state.currentUser) {
                const userKey = `homeloop_${state.currentUser.id}`;
                const userData = localStorage.getItem(userKey);
                if (userData) {
                    const parsed = JSON.parse(userData);
                    state.cart = parsed.cart || [];
                    state.subscription = parsed.subscription || null;
                }
            }
        } catch (e) {
            console.error("Erro ao carregar dados:", e);
            state = {
                isAuthenticated: false,
                currentUser: null,
                cart: [],
                currentCategory: "Todos",
                searchQuery: "",
                subscription: null
            };
        }
    }
}

function showLoginUI() {
    document.getElementById('navbar-main').style.display = 'none';
    document.getElementById('login-view').classList.remove('hidden');
    document.querySelectorAll('.view-section').forEach(v => {
        if (v.id !== 'login-view') v.classList.add('hidden');
    });
}

function showAuthenticatedUI() {
    document.getElementById('navbar-main').style.display = 'block';
    document.getElementById('login-view').classList.add('hidden');
    switchView('home-view');
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");
    
    if (!email || !password) {
        errorDiv.innerText = "Preencha todos os campos";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('homeloop_users')) || [];
    const user = users.find(u => u.email === email);
    
    if (!user || !validatePassword(password, user.passwordHash)) {
        errorDiv.innerText = "Email ou password inválido";
        return;
    }
    
    state.isAuthenticated = true;
    state.currentUser = { id: user.id, email: user.email, fullName: user.fullName, address: user.address };
    
    const userKey = `homeloop_${user.id}`;
    const userData = localStorage.getItem(userKey);
    if (userData) {
        const parsed = JSON.parse(userData);
        state.cart = parsed.cart || [];
        state.subscription = parsed.subscription || null;
    }
    
    errorDiv.innerText = "";
    localStorage.setItem('homeloop_state', JSON.stringify({
        isAuthenticated: true,
        currentUser: state.currentUser,
        cart: state.cart,
        subscription: state.subscription
    }));
    
    showAuthenticatedUI();
    initNavigation();
    initCatalogFilters();
    initSearch();
    initCheckoutTriggers();
    setupDeliveryDateConstraints();
    renderCatalog();
    renderCart();
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const fullName = document.getElementById("register-fullname").value.trim();
    const address = document.getElementById("register-address").value.trim();
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;
    const terms = document.getElementById("register-terms").checked;
    const errorDiv = document.getElementById("register-error");
    
    if (!email || !fullName || !address || !password) {
        errorDiv.innerText = "Preencha todos os campos";
        return;
    }
    if (password.length < 8) {
        errorDiv.innerText = "Password deve ter no mínimo 8 caracteres";
        return;
    }
    if (!validatePasswordStrength(password)) {
        errorDiv.innerText = "Password fraca. Use maiúsculas, minúsculas e números";
        return;
    }
    if (password !== passwordConfirm) {
        errorDiv.innerText = "Passwords não coincidem";
        return;
    }
    if (!terms) {
        errorDiv.innerText = "Deve aceitar os termos de serviço";
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('homeloop_users')) || [];
    if (users.find(u => u.email === email)) {
        errorDiv.innerText = "Este email já está registado";
        return;
    }
    
    const newUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email: email,
        fullName: fullName,
        address: address,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('homeloop_users', JSON.stringify(users));
    
    const userKey = `homeloop_${newUser.id}`;
    localStorage.setItem(userKey, JSON.stringify({
        cart: [],
        subscription: null
    }));
    
    errorDiv.innerText = "";
    alert("Conta criada com sucesso! Agora pode fazer login.");
    switchAuthTab('login');
    document.getElementById("register-form").reset();
}

async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("forgot-email").value.trim();
    const errorDiv = document.getElementById("forgot-error");
    const successDiv = document.getElementById("forgot-success");
    
    const users = JSON.parse(localStorage.getItem('homeloop_users')) || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
        errorDiv.innerText = "Email não encontrado na base de dados";
        successDiv.innerText = "";
        return;
    }
    
    errorDiv.innerText = "";
    successDiv.innerText = `Link de recuperação enviado para ${email}. O link é válido por 24 horas.`;
    document.getElementById("forgot-form").reset();
}

function handleLogout() {
    state.isAuthenticated = false;
    state.currentUser = null;
    state.cart = [];
    state.currentCategory = "Todos";
    state.searchQuery = "";
    state.subscription = null;
    
    localStorage.removeItem('homeloop_state');
    
    document.querySelectorAll('form').forEach(form => {
        try { form.reset(); } catch(e) {}
    });
    
    setTimeout(() => {
        showLoginUI();
    }, 100);
}

function validatePasswordStrength(password) {
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

function validatePassword(plainPassword, hashedPassword) {
    return hashPassword(plainPassword) === hashedPassword;
}

function hashPassword(password) {
    return btoa(password);
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
        document.querySelectorAll('.auth-tab-btn')[0].classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('register-form').classList.add('active');
        document.querySelectorAll('.auth-tab-btn')[1].classList.add('active');
    } else if (tab === 'forgot') {
        document.getElementById('forgot-form').classList.add('active');
    }
}

function initNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            switchView(link.getAttribute("data-target"));
        });
    });
}

function switchView(viewId) {
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(viewId).classList.remove("hidden");
    document.querySelectorAll(".nav-link").forEach(l => {
        l.getAttribute("data-target") === viewId ? l.classList.add("active") : l.classList.remove("active");
    });
    if (viewId === 'cart-view') renderCart();
    if (viewId === 'account-view') loadAccountView();
    if (viewId === 'delivery-view') updateDeliveryPreview();
    window.scrollTo(0,0);
}

function initCatalogFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.currentCategory = btn.getAttribute("data-category");
            renderCatalog();
        });
    });
}

function initSearch() {
    document.getElementById("search-input").addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        renderCatalog();
    });
}

function renderCatalog() {
    const grid = document.getElementById("appliances-grid");
    grid.innerHTML = "";
    const filtered = appliancesData.filter(item => {
        const matchesCategory = state.currentCategory === "Todos" || item.category === state.currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(state.searchQuery) || 
                              item.brand.toLowerCase().includes(state.searchQuery) ||
                              item.desc.toLowerCase().includes(state.searchQuery);
        return matchesCategory && matchesSearch;
    });

    if(filtered.length === 0) {
        grid.innerHTML = `<p class="hint-text" style="grid-column: 1/-1; text-align:center; padding: 2rem;">Nenhum eletrodoméstico encontrado com os critérios atuais.</p>`;
        return;
    }

    filtered.forEach(item => {
        const itemsToCheck = state.subscription ? state.subscription.items : state.cart;
        const isInList = itemsToCheck.some(cartItem => cartItem.id === item.id);
        const card = document.createElement("div");
        card.className = "appliance-card";
        
        let buttonText = 'Adicionar ao Plano';
        let buttonClass = 'btn-accent';
        let isDisabled = false;

        if (isInList) {
            buttonText = 'Remover do Plano';
            buttonClass = 'btn-outline-danger';
        } else if (itemsToCheck.length >= MAX_SLOTS) {
            buttonText = 'Plano Cheio';
            isDisabled = true;
        }

        card.innerHTML = `
            <div class="appliance-info">
                <span class="appliance-brand">${item.brand}</span>
                <h3 class="appliance-name">${item.name}</h3>
                <p class="appliance-desc">${item.desc}</p>
                <div class="features-tags">
                    ${item.features.map(f => `<span class="tag">${f}</span>`).join('')}
                </div>
                <button class="btn ${buttonClass}" 
                        onclick="handleRemoveClick('${item.id}', '${item.name}')"
                        ${isDisabled ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    const itemsToCount = state.subscription ? state.subscription.items : state.cart;
    document.getElementById("cart-count").innerText = itemsToCount.length;
}

function handleRemoveClick(id, itemName) {
    const itemsToCheck = state.subscription ? state.subscription.items : state.cart;
    const isInList = itemsToCheck.some(cartItem => cartItem.id === id);
    
    if (isInList) {
        if (confirm(`Tem a certeza que deseja remover "${itemName}" do plano?`)) {
            toggleCartItem(id);
        }
    } else {
        toggleCartItem(id);
    }
}

function toggleCartItem(id) {
    if (state.subscription) {
        const index = state.subscription.items.findIndex(item => item.id === id);
        if (index > -1) {
            state.subscription.items.splice(index, 1);
        } else {
            if (state.subscription.items.length >= MAX_SLOTS) return;
            const item = appliancesData.find(a => a.id === id);
            state.subscription.items.push(item);
        }
    } else {
        const index = state.cart.findIndex(item => item.id === id);
        if (index > -1) {
            state.cart.splice(index, 1);
        } else {
            if (state.cart.length >= MAX_SLOTS) return;
            const item = appliancesData.find(a => a.id === id);
            state.cart.push(item);
        }
    }
    saveToStorage();
    renderCatalog();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items-container");
    container.innerHTML = "";
    const itemsToShow = state.subscription ? state.subscription.items : state.cart;

    if (itemsToShow.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 3rem 1rem; color: #6b7280;">
            <p>O seu plano anual ainda está vazio.</p>
            <button class="btn btn-primary" style="width:auto; margin-top:1rem;" onclick="switchView('catalog-view')">Ir para o Catálogo</button>
        </div>`;
        document.getElementById("checkout-btn").disabled = true;
        document.getElementById("checkout-warning").classList.remove("hidden");
        document.getElementById("summary-slots").innerText = `0 / ${MAX_SLOTS}`;
        document.getElementById("checkout-btn").innerText = "Confirmar e Escolher Entrega";
        return;
    }

    itemsToShow.forEach(item => {
        const row = document.createElement("div");
        row.className = "step-card";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.marginBottom = "1rem";
        row.style.padding = "1.25rem";
        row.innerHTML = `
            <div>
                <span class="appliance-brand" style="font-size:0.75rem;">${item.category} • ${item.brand}</span>
                <h4 style="color:var(--primary); margin-top:0.25rem;">${item.name}</h4>
            </div>
            <button class="btn btn-outline-danger" style="width:auto; padding: 0.5rem 1rem;" onclick="handleRemoveClick('${item.id}', '${item.name}')">Remover</button>
        `;
        container.appendChild(row);
    });

    document.getElementById("summary-slots").innerText = `${itemsToShow.length} / ${MAX_SLOTS}`;
    document.getElementById("checkout-btn").disabled = false;
    document.getElementById("checkout-warning").classList.add("hidden");
    document.getElementById("checkout-btn").innerText = state.subscription ? "Guardar Alterações" : "Confirmar e Escolher Entrega";
}

function initCheckoutTriggers() {
    document.getElementById("checkout-btn").addEventListener("click", () => {
        const itemsToCheck = state.subscription ? state.subscription.items : state.cart;
        if (itemsToCheck.length > 0) {
            if (state.subscription) {
                saveToStorage();
                alert("Alterações guardadas com sucesso!");
                switchView('account-view');
            } else {
                switchView('delivery-view');
            }
        }
    });
}

function setupDeliveryDateConstraints() {
    const dateInput = document.getElementById("delivery-date");
    const hint = document.getElementById("date-bounds-hint");
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 7);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    const formatDateStr = (d) => d.toISOString().split('T')[0];
    dateInput.min = formatDateStr(minDate);
    dateInput.max = formatDateStr(maxDate);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    hint.innerText = `Datas válidas entre: ${minDate.toLocaleDateString('pt-PT', options)} e ${maxDate.toLocaleDateString('pt-PT', options)}`;
}

function updateDeliveryPreview() {
    const previewContainer = document.getElementById("delivery-preview-items");
    previewContainer.innerHTML = "";
    state.cart.forEach(item => {
        const p = document.createElement("p");
        p.style.fontSize = "0.9rem";
        p.style.padding = "0.5rem 0";
        p.style.borderBottom = "1px solid var(--border)";
        p.innerHTML = `• <strong>${item.brand}</strong> - ${item.name}`;
        previewContainer.appendChild(p);
    });
}

function processCheckout(event) {
    event.preventDefault();
    const name = document.getElementById("client-name").value.trim();
    const address = document.getElementById("client-address").value.trim();
    const date = document.getElementById("delivery-date").value;
    const slot = document.getElementById("delivery-slot").value;

    if (!name || !address || !date || !slot) {
        alert("Por favor, preencha todos os campos");
        return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
    selectedDate.setHours(0,0,0,0);
    const diffTime = Math.abs(selectedDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7 || diffDays > 30) {
        alert("Erro: A data escolhida viola as regras comerciais (deve ser entre 7 a 30 dias).");
        return;
    }

    state.subscription = {
        contractId: "HL-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString('pt-PT'),
        client: { name, address },
        delivery: { date, slot },
        price: ANNUAL_PRICE + "€/ano",
        items: state.cart.map(i => ({ ...i }))
    };

    const receiptDiv = document.getElementById("receipt-details");
    receiptDiv.innerHTML = `
        <strong>Nº Contrato:</strong> ${state.subscription.contractId}<br>
        <strong>Data de Emissão:</strong> ${state.subscription.timestamp}<br>
        <strong>Titular:</strong> ${state.subscription.client.name}<br>
        <strong>Morada:</strong> ${state.subscription.client.address}<br>
        <strong>Janela de Entrega Agendada:</strong> ${state.subscription.delivery.date} [${state.subscription.delivery.slot}]<br>
        <strong>Total Cobrado:</strong> ${state.subscription.price}<br>
        <strong>Equipamentos Rentabilizados (${state.subscription.items.length}):</strong><br>
        ${state.subscription.items.map(title => ` - ${title.brand} ${title.name}`).join('<br>')}
    `;

    state.cart = [];
    saveToStorage();
    switchView('success-view');
}

function resetApp() {
    document.getElementById("delivery-form").reset();
    renderCatalog();
    switchView('home-view');
}

function loadAccountView() {
    if (!state.currentUser) return;
    document.getElementById("account-email").innerText = state.currentUser.email;
    document.getElementById("account-name").innerText = state.currentUser.fullName;
    document.getElementById("account-address").innerText = state.currentUser.address;

    if (state.subscription) {
        document.getElementById("account-contract-id").innerText = state.subscription.contractId;
        document.getElementById("account-rental-count").innerText = state.subscription.items.length;
        const rentalListDiv = document.getElementById("rental-list");
        rentalListDiv.innerHTML = "";
        state.subscription.items.forEach(item => {
            const rentalItem = document.createElement("div");
            rentalItem.className = "rental-item";
            rentalItem.innerHTML = `
                <h4>${item.brand} - ${item.name}</h4>
                <p><strong>Categoria:</strong> ${item.category}</p>
                <p><strong>Data de Entrega:</strong> ${state.subscription.delivery.date}</p>
                <p><strong>Status:</strong> Ativo</p>
            `;
            rentalListDiv.appendChild(rentalItem);
        });
    } else {
        document.getElementById("account-contract-id").innerText = "-";
        document.getElementById("account-rental-count").innerText = "0";
        document.getElementById("rental-list").innerHTML = '<p class="hint-text">Nenhuma subscrição ativa</p>';
    }
}
