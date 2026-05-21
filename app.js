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
    activeSubscription: null
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

function saveToStorage() {
    const dataToSave = {
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        cart: state.cart,
        activeSubscription: state.activeSubscription
    };
    localStorage.setItem('homeloop_state', JSON.stringify(dataToSave));
}

function loadFromStorage() {
    const saved = localStorage.getItem('homeloop_state');
    if (saved) {
        const data = JSON.parse(saved);
        state.isAuthenticated = data.isAuthenticated;
        state.currentUser = data.currentUser;
        state.cart = data.cart || [];
        state.activeSubscription = data.activeSubscription || null;
    }
}

function showLoginUI() {
    document.getElementById('navbar-main').style.display = 'none';
    document.getElementById('login-view').classList.remove('hidden');
    document.querySelectorAll('.view-section:not(#login-view)').forEach(v => {
        v.classList.add('hidden');
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
    state.currentUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        address: user.address
    };
    
    errorDiv.innerText = "";
    saveToStorage();
    showAuthenticatedUI();
    initNavigation();
    initCatalogFilters();
    initSearch();
    initCheckoutTriggers();
    setupDeliveryDateConstraints();
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
    
    const resetToken = Math.random().toString(36).substr(2, 9);
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = new Date(Date.now() + 24*60*60*1000).toISOString();
    
    users[users.indexOf(users.find(u => u.email === email))] = user;
    localStorage.setItem('homeloop_users', JSON.stringify(users));
    
    errorDiv.innerText = "";
    successDiv.innerText = `Link de recuperação enviado para ${email}. O link é válido por 24 horas.`;
}

function handleLogout() {
    state.isAuthenticated = false;
    state.currentUser = null;
    state.cart = [];
    state.currentCategory = "Todos";
    state.searchQuery = "";
    saveToStorage();
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    showLoginUI();
}

function validatePasswordStrength(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpper && hasLower && hasNumber;
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
            const targetView = link.getAttribute("data-target");
            switchView(targetView);
        });
    });
}

function switchView(viewId) {
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(viewId).classList.remove("hidden");
    
    document.querySelectorAll(".nav-link").forEach(l => {
        if(l.getAttribute("data-target") === viewId) l.classList.add("active");
        else l.classList.remove("active");
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
        const isInCart = state.cart.some(cartItem => cartItem.id === item.id);
        const card = document.createElement("div");
        card.className = "appliance-card";
        
        card.innerHTML = `
            <div class="appliance-info">
                <span class="appliance-brand">${item.brand}</span>
                <h3 class="appliance-name">${item.name}</h3>
                <p class="appliance-desc">${item.desc}</p>
                <div class="features-tags">
                    ${item.features.map(f => `<span class="tag">${f}</span>`).join('')}
                </div>
                <button class="btn ${isInCart ? 'btn-outline-danger' : 'btn-accent'}" 
                        onclick="toggleCartItem('${item.id}')"
                        ${!isInCart && state.cart.length >= MAX_SLOTS ? 'disabled' : ''}>
                    ${isInCart ? 'Remover do Plano' : (state.cart.length >= MAX_SLOTS ? 'Plano Cheio' : 'Adicionar ao Plano')}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById("cart-count").innerText = state.cart.length;
}

function toggleCartItem(id) {
    const index = state.cart.findIndex(item => item.id === id);
    if (index > -1) {
        state.cart.splice(index, 1);
    } else {
        if (state.cart.length >= MAX_SLOTS) return;
        const item = appliancesData.find(a => a.id === id);
        state.cart.push(item);
    }
    
    saveToStorage();
    renderCatalog();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items-container");
    container.innerHTML = "";

    if (state.cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 3rem 1rem; color: #6b7280;">
            <p>O seu plano anual ainda está vazio.</p>
            <button class="btn btn-primary" style="width:auto; margin-top:1rem;" onclick="switchView('catalog-view')">Ir para o Catálogo</button>
        </div>`;
        document.getElementById("checkout-btn").disabled = true;
        document.getElementById("checkout-warning").classList.remove("hidden");
        document.getElementById("summary-slots").innerText = `0 / ${MAX_SLOTS}`;
        return;
    }

    state.cart.forEach(item => {
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
            <button class="btn btn-outline-danger" style="width:auto; padding: 0.5rem 1rem;" onclick="toggleCartItem('${item.id}')">Remover</button>
        `;
        container.appendChild(row);
    });

    document.getElementById("summary-slots").innerText = `${state.cart.length} / ${MAX_SLOTS}`;
    document.getElementById("checkout-btn").disabled = false;
    document.getElementById("checkout-warning").classList.add("hidden");
}

function initCheckoutTriggers() {
    document.getElementById("checkout-btn").addEventListener("click", () => {
        if(state.cart.length > 0) {
            switchView('delivery-view');
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

    if (!name) {
        alert("Por favor, preencha o nome completo");
        return;
    }
    if (!address) {
        alert("Por favor, preencha a morada de entrega");
        return;
    }
    if (!date) {
        alert("Por favor, selecione uma data de entrega");
        return;
    }
    if (!slot) {
        alert("Por favor, selecione uma janela horária");
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

    const subscription = {
        contractId: "HL-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString('pt-PT'),
        client: { name, address },
        delivery: { date, slot },
        price: ANNUAL_PRICE + "€/ano",
        itemsCount: state.cart.length,
        items: state.cart.map(i => ({ ...i }))
    };

    state.activeSubscription = subscription;
    state.cart = [];

    const receiptDiv = document.getElementById("receipt-details");
    receiptDiv.innerHTML = `
        <strong>Nº Contrato:</strong> ${subscription.contractId}<br>
        <strong>Data de Emissão:</strong> ${subscription.timestamp}<br>
        <strong>Titular:</strong> ${subscription.client.name}<br>
        <strong>Morada:</strong> ${subscription.client.address}<br>
        <strong>Janela de Entrega Agendada:</strong> ${subscription.delivery.date} [${subscription.delivery.slot}]<br>
        <strong>Total Cobrado:</strong> ${subscription.price}<br>
        <strong>Equipamentos Rentabilizados (${subscription.itemsCount}):</strong><br>
        ${subscription.items.map(title => ` - ${title.brand} ${title.name}`).join('<br>')}
    `;

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

    if (state.activeSubscription) {
        const sub = state.activeSubscription;
        document.getElementById("account-contract-id").innerText = sub.contractId;
        document.getElementById("account-rental-count").innerText = sub.itemsCount;

        const rentalListDiv = document.getElementById("rental-list");
        rentalListDiv.innerHTML = "";
        sub.items.forEach(item => {
            const rentalItem = document.createElement("div");
            rentalItem.className = "rental-item";
            rentalItem.innerHTML = `
                <h4>${item.brand} - ${item.name}</h4>
                <p><strong>Categoria:</strong> ${item.category}</p>
                <p><strong>Data de Entrega:</strong> ${sub.delivery.date}</p>
                <p><strong>Status:</strong> Agendada</p>
            `;
            rentalListDiv.appendChild(rentalItem);
        });
    } else {
        document.getElementById("account-contract-id").innerText = "-";
        document.getElementById("account-rental-count").innerText = "0";
        document.getElementById("rental-list").innerHTML = '<p class="hint-text">Nenhum equipamento alugado</p>';
    }
}
