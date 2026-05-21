// Base de dados mock de eletrodomésticos premium (Conforme pedido)
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

// Inicialização do Estado (Carrega do LocalStorage se existir)
let state = {
    cart: JSON.parse(localStorage.getItem('hl_cart')) || [],
    currentCategory: "Todos",
    searchQuery: ""
};

const MAX_SLOTS = 8;

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCatalogFilters();
    initSearch();
    initCheckoutTriggers();
    setupDeliveryDateConstraints();
    
    // Renderização inicial
    renderCatalog();
    renderCart();
});

// --- ROTEAMENTO E NAVEGAÇÃO ---
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

    // Atualizações específicas ao entrar em vistas
    if (viewId === 'cart-view') renderCart();
    if (viewId === 'delivery-view') updateDeliveryPreview();
    
    window.scrollTo(0,0);
}

// --- FILTROS E PESQUISA (UC01 / UC01.1) ---
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
        card.className = "appance-card";
        card.classList.add("appliance-card");
        
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

    // Atualiza contador da navbar
    document.getElementById("cart-count").innerText = state.cart.length;
}

// --- GESTÃO DO PLANO/CARRINHO (UC03) ---
function toggleCartItem(id) {
    const index = state.cart.findIndex(item => item.id === id);
    if (index > -1) {
        state.cart.splice(index, 1);
    } else {
        if (state.cart.length >= MAX_SLOTS) return; // Proteção extra de limite
        const item = appliancesData.find(a => a.id === id);
        state.cart.push(item);
    }
    
    localStorage.setItem('hl_cart', JSON.stringify(state.cart));
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
        row.style.justifyContent = "nav-space-between";
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

// --- VALIDAÇÃO DE DATAS E AGENDAMENTO (UC06 - Regra de Negócio Crítica) ---
function setupDeliveryDateConstraints() {
    const dateInput = document.getElementById("delivery-date");
    const hint = document.getElementById("date-bounds-hint");
    
    const today = new Date();
    
    // Calcula Data Mínima: Hoje + 7 dias
    const minDate = new Date();
    minDate.setDate(today.getDate() + 7);
    
    // Calcula Data Máxima: Hoje + 30 dias
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    // Formata para a propriedade string YYYY-MM-DD exigida pelo input do browser
    const formatDateStr = (d) => d.toISOString().split('T')[0];

    dateInput.min = formatDateStr(minDate);
    dateInput.max = formatDateStr(maxDate);

    // Exibe ajuda visual para o utilizador e ajuda os testes automatizados a lerem os limites
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

// --- SUBMISSÃO E PROCESSAMENTO DE CONTRATO (UC04) ---
function processCheckout(event) {
    event.preventDefault(); // Bloqueia o reload tradicional da página

    const name = document.getElementById("client-name").value;
    const address = document.getElementById("client-address").value;
    const date = document.getElementById("delivery-date").value;
    const slot = document.getElementById("delivery-slot").value;

    // Dupla verificação programática da regra dos 7 a 30 dias (Segurança Extra para os testes)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
    selectedDate.setHours(0,0,0,0);

    const diffTime = Math.abs(selectedDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7 || diffDays > 30) {
        alert("Erro: A data escolhida viola as regras comerciais da plataforma (deve ser entre 7 a 30 dias a contar de hoje).");
        return;
    }

    // Criar Objeto de Subscrição Concluída para simular o Registo na Base de Dados via LocalStorage
    const orderReceipt = {
        contractId: "HL-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString('pt-PT'),
        client: { name, address },
        delivery: { date, slot },
        price: "1000€/ano",
        itemsCount: state.cart.length,
        items: state.cart.map(i => `${i.brand} ${i.name}`)
    };

    // Salva o histórico final para auditoria local
    localStorage.setItem('hl_active_subscription', JSON.stringify(orderReceipt));

    // Renderiza o ecrã de Sucesso
    const receiptDiv = document.getElementById("receipt-details");
    receiptDiv.innerHTML = `
        <strong>Nº Contrato:</strong> ${orderReceipt.contractId}<br>
        <strong>Data de Emissão:</strong> ${orderReceipt.timestamp}<br>
        <strong>Titular:</strong> ${orderReceipt.client.name}<br>
        <strong>Morada:</strong> ${orderReceipt.client.address}<br>
        <strong>Janela de Entrega Agendada:</strong> ${orderReceipt.delivery.date} [${orderReceipt.delivery.slot}]<br>
        <strong>Total Cobrado:</strong> ${orderReceipt.price}<br>
        <strong>Equipamentos Rentabilizados (${orderReceipt.itemsCount}):</strong><br>
        ${orderReceipt.items.map(title => ` - ${title}`).join('<br>')}
    `;

    // Limpa o carrinho atual já subscrito
    state.cart = [];
    localStorage.removeItem('hl_cart');
    document.getElementById("cart-count").innerText = 0;

    switchView('success-view');
}

function resetApp() {
    localStorage.removeItem('hl_active_subscription');
    // Força o reset visual dos inputs
    document.getElementById("delivery-form").reset();
    renderCatalog();
    switchView('home-view');
}