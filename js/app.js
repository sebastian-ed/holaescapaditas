/**
 * HOLA ESCAPADITAS — app.js
 * Lógica principal del sitio público
 */

let filtroActual = 'Todos';

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function aplicarConfig() {
  const config = cargarConfig();
  const msgBase = config.mensajeWa || 'Hola! Vi su web y quiero consultar sobre paquetes de viaje 🌍';
  const waUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msgBase)}`;

  ['navWaBtn', 'heroCta', 'ctaWa', 'footerWa', 'waFloat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = waUrl;
  });

  const ctaMail = document.getElementById('ctaMail');
  const emailDisplay = document.getElementById('emailDisplay');
  if (ctaMail) ctaMail.href = `mailto:${config.email}`;
  if (emailDisplay) emailDisplay.textContent = config.email || 'sin configurar';

  const telefonoDisplay = document.getElementById('telefonoDisplay');
  if (telefonoDisplay) telefonoDisplay.textContent = config.telefono || 'sin configurar';
}

function fmtPrecio(p) {
  const sym = p.moneda === 'USD' ? 'USD ' : '$ ';
  return `${sym}${Number(p.precio || 0).toLocaleString('es-AR')}`;
}

function normalizarBadge(badge = '') {
  return badge.toLowerCase().trim().replace(/\s+/g, '-');
}

function renderFiltros(paquetes) {
  const wrap = document.getElementById('filtros');
  if (!wrap) return;

  const categorias = ['Todos', ...new Set(paquetes.map(p => (p.categoria || 'General').trim()).filter(Boolean))];

  wrap.innerHTML = categorias.map(cat => `
    <button class="filtro-btn ${cat === filtroActual ? 'active' : ''}" data-cat="${escapeHtml(cat)}">
      ${escapeHtml(cat)}
    </button>
  `).join('');

  wrap.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroActual = btn.dataset.cat;
      renderFiltros(paquetes);
      renderPaquetes();
    });
  });
}

function renderPaquetes() {
  const all = cargarPaquetes().filter(p => p.activo);
  const grid = document.getElementById('paquetesGrid');
  const empty = document.getElementById('paquetesEmpty');
  if (!grid) return;

  renderFiltros(all);

  const lista = filtroActual === 'Todos'
    ? all
    : all.filter(p => (p.categoria || 'General').trim() === filtroActual);

  if (!lista.length) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }

  empty?.classList.add('hidden');

  grid.innerHTML = lista.map(p => {
    const imgs = p.imagenes || (p.imagen ? [p.imagen] : []);
    const thumb = imgs[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80';
    const badgeClass = normalizarBadge(p.badge);
    const waMsg = `Hola! Vi el paquete \"${p.nombre}\" en su web y quisiera más información 🌍`;
    const waUrl = `https://wa.me/${cargarConfig().whatsapp}?text=${encodeURIComponent(waMsg)}`;

    return `
      <a class="paquete-card" href="paquete.html?id=${encodeURIComponent(p.id)}" aria-label="Ver ${escapeHtml(p.nombre)}">
        <div class="card-img">
          <img src="${thumb}" alt="${escapeHtml(p.nombre)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80'"/>
          ${p.badge ? `<span class="card-badge ${badgeClass}">${escapeHtml(p.badge)}</span>` : ''}
          ${imgs.length > 1 ? `<span class="card-foto-count">📸 ${imgs.length}</span>` : ''}
        </div>
        <div class="card-body">
          <div class="card-cat">${escapeHtml(p.categoria || 'General')}</div>
          <div class="card-destino">📍 ${escapeHtml(p.destino || '')}</div>
          <h3 class="card-nombre">${escapeHtml(p.nombre)}</h3>
          <p class="card-desc">${escapeHtml(p.descripcion || '')}</p>
          <div class="card-footer">
            <div class="card-precio-wrap">
              <span class="precio-desde">Desde</span>
              <span class="precio-val">${fmtPrecioHtml(p)}</span>
            </div>
            <span class="card-noches">${Number(p.noches || 1)} noche${Number(p.noches || 1) !== 1 ? 's' : ''}</span>
          </div>
          <span class="card-wa-btn" data-wa-link="${waUrl}">Consultar por WhatsApp</span>
        </div>
      </a>
    `;
  }).join('');

  grid.querySelectorAll('[data-wa-link]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      window.open(btn.dataset.waLink, '_blank', 'noopener');
    });
  });
}

function fmtPrecioHtml(p) {
  const val = Number(p.precio || 0).toLocaleString('es-AR');
  return p.moneda === 'USD'
    ? `<span class="sym">USD </span>${val}`
    : `<span class="sym">$ </span>${val}`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  aplicarConfig();
  renderPaquetes();
});

window.initNavbar = initNavbar;
window.aplicarConfig = aplicarConfig;
window.renderPaquetes = renderPaquetes;
