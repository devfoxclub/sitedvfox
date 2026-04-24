// CACHE BUSTING: Incremente este número quando atualizar imagens
const IMAGE_VERSION = "1.2";

// ============================
// NOTIFICAÇÕES
// ============================
const NOTIFICATIONS = [
  {
    id: "notif-5",
    title: "Seção 'Comece por Aqui' adicionada",
    text: "4 trilhas para iniciantes disponíveis: Python, Java, JavaScript e Desenvolvimento Mobile.",
    type: "new",
    date: "13 Mar 2026"
  },
  {
    id: "notif-4",
    title: "10 Ferramentas adicionadas",
    text: "Confira a nova seção Ferramentas com 10 recursos profissionais para apoiar seus estudos e projetos.",
    type: "new",
    date: "10 Mar 2026"
  },
  {
    id: "notif-1",
    title: "Novo pack na Loja",
    text: "O Autocode foi adicionado à loja: +40 automações prontas para usar ou vender.",
    type: "store",
    date: "05 Mar 2026"
  },
  {
    id: "notif-2",
    title: "Novos cursos adicionados",
    text: "Confira os últimos cursos de Data Science e IA que acabaram de chegar.",
    type: "new",
    date: "01 Mar 2026"
  },
  {
    id: "notif-3",
    title: "Dica de estudo",
    text: "Comece pelo módulo de Lógica para construir uma base sólida antes de avançar para outras áreas.",
    type: "tip",
    date: "01 Mar 2026"
  }
];

const STORE_PRODUCTS = [
  {
    id: "autocode",
    name: "Autocode - Aprenda Automação do Zero e Leve +40 Automações Prontas Para Usar ou Vender",
    benefit: "Curso completo + pack de automações prontas.",
    tag: "Em breve",
    price: "R$ 19,90",
    description: "Aprenda automação do zero e receba mais de 40 automações prontas para usar ou vender.",
    checkoutUrl: "",
    comingSoon: true
  },
  {
    id: "dashpower",
    name: "Dashpower - Domine Excel & Power BI do Zero e Receba +20 Dashboards Profissionais Prontos Para Usar",
    benefit: "Curso completo + pack de dashboards prontos.",
    tag: "Em breve",
    price: "R$ 27,90",
    description: "Domine Excel & Power BI do zero e receba +20 dashboards profissionais prontos para usar.",
    checkoutUrl: "",
    comingSoon: true
  }
];

function getNotificationIcon(type) {
  const icons = { new: "🆕", tip: "💡", store: "🛒" };
  return icons[type] || "📌";
}

function getReadNotifications() {
  const stored = localStorage.getItem("devbox_read_notifications");
  return stored ? JSON.parse(stored) : [];
}

function saveReadNotifications(ids) {
  localStorage.setItem("devbox_read_notifications", JSON.stringify(ids));
}

let notificationPanel = null;
let notificationBackdrop = null;

function closeNotificationPanel() {
  if (notificationPanel) notificationPanel.classList.remove('active');
  if (notificationBackdrop) notificationBackdrop.classList.remove('active');
}

function openNotificationPanel() {
  if (notificationPanel) notificationPanel.classList.add('active');
  if (notificationBackdrop) notificationBackdrop.classList.add('active');
}

function initNotifications() {
  const btn = document.getElementById("notificationBtn");
  notificationPanel = document.getElementById("notificationPanel");
  notificationBackdrop = document.getElementById("notificationBackdrop");
  const badge = document.getElementById("notificationBadge");
  const list = document.getElementById("notificationList");
  const markAllBtn = document.getElementById("markAllRead");
  const closeMobileBtn = document.getElementById("closeNotificationMobile");

  if (!btn || !notificationPanel) return;

  function renderNotifications() {
    const currentReadIds = getReadNotifications();
    const unreadCount = NOTIFICATIONS.filter(n => !currentReadIds.includes(n.id)).length;
    
    badge.textContent = unreadCount > 0 ? unreadCount : "";
    badge.style.display = unreadCount > 0 ? "flex" : "none";

    if (NOTIFICATIONS.length === 0) {
      list.innerHTML = '<div class="notification-empty">Sem novidades por enquanto</div>';
      return;
    }

    list.innerHTML = NOTIFICATIONS.map(n => {
      const isUnread = !currentReadIds.includes(n.id);
      return `
        <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${n.id}" data-type="${n.type}">
          <div class="notification-icon">${getNotificationIcon(n.type)}</div>
          <div class="notification-content">
            <div class="notification-item-title">${n.title}</div>
            <div class="notification-item-text">${n.text}</div>
            <div class="notification-item-date">${n.date}</div>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const type = item.dataset.type;
        
        markAsRead(id);
        
        if (type === 'store') {
          closeNotificationPanel();
          openStoreTab();
        }
      });
    });
  }

  function markAsRead(id) {
    const readIds = getReadNotifications();
    if (!readIds.includes(id)) {
      readIds.push(id);
      saveReadNotifications(readIds);
      renderNotifications();
    }
  }

  function markAllAsRead() {
    const allIds = NOTIFICATIONS.map(n => n.id);
    saveReadNotifications(allIds);
    renderNotifications();
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (notificationPanel.classList.contains('active')) {
      closeNotificationPanel();
    } else {
      openNotificationPanel();
    }
  });

  const closeDesktopBtn = document.getElementById("closeNotificationDesktop");
  
  notificationBackdrop.addEventListener('click', closeNotificationPanel);
  closeMobileBtn.addEventListener('click', closeNotificationPanel);
  if (closeDesktopBtn) closeDesktopBtn.addEventListener('click', closeNotificationPanel);
  markAllBtn.addEventListener('click', markAllAsRead);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notificationPanel.classList.contains('active')) {
      closeNotificationPanel();
    }
  });

  renderNotifications();
}

// ============================
// TABS (Módulos | Loja)
// ============================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      
      if (targetTab === 'modules') {
        document.getElementById('modulesSection').classList.add('active');
      } else if (targetTab === 'store') {
        document.getElementById('storeSection').classList.add('active');
      }
    });
  });
}

function openStoreTab() {
  const storeBtn = document.getElementById('tabStore');
  if (storeBtn) {
    storeBtn.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ============================
// STORE
// ============================
function initStore() {
  const productsGrid = document.getElementById('storeProductsGrid');
  if (!productsGrid) return;

  productsGrid.innerHTML = STORE_PRODUCTS.map(p => `
    <div class="store-product-card ${p.comingSoon ? 'coming-soon' : ''}" data-product-id="${p.id}">
      <div class="product-tag${p.comingSoon ? ' tag-coming-soon' : ''}">${p.tag}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-benefit">${p.benefit}</div>
      <div class="product-price">${p.price}</div>
      <button class="product-cta" data-product-id="${p.id}" ${p.comingSoon ? 'disabled' : ''}>${p.comingSoon ? 'Em breve' : 'Ver detalhes'}</button>
    </div>
  `).join('');

  productsGrid.querySelectorAll('.product-cta:not([disabled])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.dataset.productId;
      const product = STORE_PRODUCTS.find(p => p.id === productId);
      if (product && product.checkoutUrl) {
        window.open(product.checkoutUrl, '_blank');
      }
    });
  });
}

function openProductModal(productId) {
  const product = STORE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const desc = document.getElementById('productModalDesc');
  const price = document.getElementById('productModalPrice');
  const cta = document.getElementById('productModalCta');

  title.textContent = product.name;
  desc.textContent = product.description;
  price.textContent = product.price;
  cta.href = product.checkoutUrl;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function initProductModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('productModalClose');
  const backdrop = modal?.querySelector('.product-modal-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
  if (backdrop) backdrop.addEventListener('click', closeProductModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeProductModal();
    }
  });
}

// Aplica cache busting automático em todas as imagens
function aplicarCacheBusting() {
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    const src = img.getAttribute('src');
    const srcset = img.getAttribute('srcset');
    
    if (src && !src.includes('?v=')) {
      img.src = `${src}?v=${IMAGE_VERSION}`;
    }
    
    if (srcset && !srcset.includes('?v=')) {
      img.srcset = `${srcset}?v=${IMAGE_VERSION}`;
    }
  });
  
  // Aplica também em source tags dentro de picture
  const allSources = document.querySelectorAll('source');
  allSources.forEach(source => {
    const srcset = source.getAttribute('srcset');
    if (srcset && !srcset.includes('?v=')) {
      source.srcset = `${srcset}?v=${IMAGE_VERSION}`;
    }
  });
}

let cursos = [];
let categoriaAtual = "";
let termoBusca = "";
let cursosCarregados = false;

async function carregarCursos() {
  try {
    const resp = await fetch("cursos.json");
    cursos = await resp.json();
    cursosCarregados = true;
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    cursos = [];
    cursosCarregados = true;
  }
}

function obterCursosFiltrados() {
  let filtrados = cursos.filter(curso => curso.categoria === categoriaAtual);

  if (termoBusca.trim() !== "") {
    const termoLower = termoBusca.toLowerCase();
    filtrados = filtrados.filter(curso =>
      curso.nome.toLowerCase().includes(termoLower)
    );
  }

  return filtrados;
}

function atualizarLista() {
  const filtrados = obterCursosFiltrados();
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalList = document.getElementById("modalList");

  modalTitle.textContent = categoriaAtual;

  if (filtrados.length === 0) {
    modalSubtitle.textContent = "Nenhum curso encontrado para esta busca.";
  } else {
    modalSubtitle.textContent = `${filtrados.length} curso${filtrados.length !== 1 ? 's' : ''} disponível${filtrados.length !== 1 ? 'is' : ''}`;
  }

  modalList.innerHTML = "";

  filtrados.forEach(curso => {
    const courseItem = document.createElement("div");
    courseItem.className = "course-item";

    const courseName = document.createElement("div");
    courseName.className = "course-name";
    courseName.textContent = curso.nome;

    const courseActions = document.createElement("div");
    courseActions.className = "course-actions";

    const courseBtn = document.createElement("a");
    
    if (curso.nome.toLowerCase().includes('n8n')) {
      courseBtn.href = "player.html";
      courseBtn.target = "_self";
    } else {
      courseBtn.href = curso.link;
      courseBtn.target = "_blank";
      courseBtn.rel = "noopener noreferrer";
    }
    
    courseBtn.className = "course-btn";
    courseBtn.textContent = "Acessar";

    courseActions.appendChild(courseBtn);
    courseItem.appendChild(courseName);
    courseItem.appendChild(courseActions);
    modalList.appendChild(courseItem);
  });
}

function abrirModal(categoria) {
  categoriaAtual = categoria;
  termoBusca = "";
  const modalSearch = document.getElementById("modalSearch");
  modalSearch.value = "";

  atualizarLista();

  const modal = document.getElementById("coursesModal");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  const modal = document.getElementById("coursesModal");
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

async function inicializar() {
  // Aplica cache busting em todas as imagens
  aplicarCacheBusting();
  
  // Inicializa novos componentes
  initNotifications();
  initTabs();
  initStore();
  initProductModal();
  showAdminButton();
  
  await carregarCursos();

const globalSearchInput = document.getElementById('globalSearchInput');
const globalSearchResults = document.getElementById('globalSearchResults');
const clearSearchBtn = document.getElementById('clearSearchBtn');

globalSearchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim();
  
  if (searchTerm.length > 0) {
    clearSearchBtn.style.display = 'flex';
    performGlobalSearch(searchTerm);
  } else {
    clearSearchBtn.style.display = 'none';
    globalSearchResults.classList.remove('active');
    globalSearchResults.innerHTML = '';
  }
});

clearSearchBtn.addEventListener('click', () => {
  globalSearchInput.value = '';
  clearSearchBtn.style.display = 'none';
  globalSearchResults.classList.remove('active');
  globalSearchResults.innerHTML = '';
  globalSearchInput.focus();
});

function performGlobalSearch(searchTerm) {
  const termoLower = searchTerm.toLowerCase();
  const resultados = cursos.filter(curso =>
    curso.nome.toLowerCase().includes(termoLower)
  );

  if (resultados.length === 0) {
    globalSearchResults.innerHTML = `
      <div class="search-no-results">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p><strong>Nenhum curso encontrado</strong><br>Tente buscar com outras palavras-chave</p>
      </div>
    `;
  } else {
    globalSearchResults.innerHTML = resultados.slice(0, 50).map(curso => {
      const isN8n = curso.nome.toLowerCase().includes('n8n');
      const linkHref = isN8n ? 'player.html' : curso.link;
      const linkTarget = isN8n ? '_self' : '_blank';
      const linkRel = isN8n ? '' : 'rel="noopener noreferrer"';
      
      return `
        <div class="search-result-item">
          <div class="search-result-info">
            <div class="search-result-name">${curso.nome}</div>
            <div class="search-result-category">${curso.categoria}</div>
          </div>
          <a href="${linkHref}" target="${linkTarget}" ${linkRel} class="search-result-btn">
            Acessar
          </a>
        </div>
      `;
    }).join('');
  }

  globalSearchResults.classList.add('active');
}

function logout() {
  localStorage.removeItem("logado");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function showAdminButton() {
  const currentUser = localStorage.getItem("currentUser");
  const adminBtn = document.getElementById("adminBtn");
  if (adminBtn) {
    if (currentUser === "admin") {
      adminBtn.style.display = "flex";
    } else {
      adminBtn.style.display = "none";
    }
  }
}

  const moduleCards = document.querySelectorAll(".module-card:not(.tool-card)");
  moduleCards.forEach(card => {
    card.addEventListener("click", () => {
      if (!cursosCarregados) {
        console.warn("Cursos ainda não foram carregados");
        return;
      }
      const categoria = card.getAttribute("data-categoria");
      abrirModal(categoria);
    });
  });

  const modalClose = document.getElementById("modalClose");
  modalClose.addEventListener("click", fecharModal);

  const modalBackdrop = document.querySelector(".modal-backdrop");
  modalBackdrop.addEventListener("click", fecharModal);

  const modalSearch = document.getElementById("modalSearch");
  modalSearch.addEventListener("input", (e) => {
    termoBusca = e.target.value;
    atualizarLista();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("coursesModal");
      if (modal.classList.contains("open")) {
        fecharModal();
      }
    }
  });

  const carousels = document.querySelectorAll(".carousel-container");
  
  carousels.forEach(container => {
    const track = container.querySelector(".carousel-track");
    const btnLeft = container.querySelector(".carousel-btn.left");
    const btnRight = container.querySelector(".carousel-btn.right");

    if (btnRight && track) {
      btnRight.addEventListener("click", (e) => {
        e.preventDefault();
        const firstCard = track.querySelector(".module-card") || track.querySelector(".tool-card");
        const cardWidth = firstCard?.offsetWidth || 280;
        const computedGap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "24");
        const isMobile = window.innerWidth <= 768;
        const scrollAmount = (cardWidth + computedGap) * (isMobile ? 1 : 2);
        const maxScroll = track.scrollWidth - track.clientWidth;
        const targetScroll = Math.min(track.scrollLeft + scrollAmount, maxScroll);
        track.scrollTo({ left: targetScroll, behavior: "smooth" });
      });
    }

    if (btnLeft && track) {
      btnLeft.addEventListener("click", (e) => {
        e.preventDefault();
        const firstCard = track.querySelector(".module-card") || track.querySelector(".tool-card");
        const cardWidth = firstCard?.offsetWidth || 280;
        const computedGap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "24");
        const isMobile = window.innerWidth <= 768;
        const scrollAmount = (cardWidth + computedGap) * (isMobile ? 1 : 2);
        const targetScroll = Math.max(track.scrollLeft - scrollAmount, 0);
        track.scrollTo({ left: targetScroll, behavior: "smooth" });
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializar);
} else {
  inicializar();
}
