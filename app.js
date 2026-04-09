/**
 * HOLA ESCAPADITAS — app.js
 * Homepage: navbar, filtros, cards, config aplicada
 */

let paquetes = cargarPaquetes();
let config   = cargarConfig();
let catActiva = 'todos';

/* ===== CONFIG ===== */
function aplicarConfig() {
  const waMsg = encodeURIComponent(config.mensajeWa || CONFIG_INICIAL.mensajeWa);
  const waUrl = `https://wa.me/${config.whatsapp}?text=${waMsg}`;

  ['navWaBtn','heroCta','ctaWa','waFloat','footerWa'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = waUrl;
  });
  const mailEl = document.getElementById('ctaMail');
  if (mailEl) mailEl.href = `mailto:${config.email}`;
  const emailD = document.getElementById('emailDisplay');
  if (emailD) emailD.textContent = config.email;
  const telEl = document.getElementById('telefonoDisplay');
  if (telEl) telEl.textContent = config.telefono;
  document.querySelectorAll('a[href*="instagram.com"]').forEach(el => {
    if (!el.closest('.dashboard-body') && !el.closest('.admin-login-body'))
      el.href = config.instagram;
  });
}

/* ===== FILTROS ===== */
function getCats() {
  const cats = ['todos', ...new Set(paquetes.filter(p=>p.activo).map(p=>p.categoria).filter(Boolean))];
  return cats;
}

function renderFiltros() {
  const el = document.getElementById('filtros');
  if (!el) return;
  el.innerHTML = getCats().map(c =>
    `<button class="filtro-btn${c===catActiva?' active':''}" data-cat="${c}">${c==='todos'?'Todos ✨':c}</button>`
  ).join('');
  el.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      catActiva = btn.dataset.cat;
      renderFiltros(); renderPaquetes();
    });
  });
}

/* ===== PAQUETES ===== */
function fmtPrecio(p) {
  const sym = p.moneda === 'USD' ? 'USD ' : '$';
  return { sym, num: p.precio.toLocaleString('es-AR') };
}

function renderPaquetes() {
  const grid  = document.getElementById('paquetesGrid');
  const empty = document.getElementById('paquetesEmpty');
  if (!grid) return;

  const lista = paquetes.filter(p => {
    if (!p.activo) return false;
    return catActiva === 'todos' || p.categoria === catActiva;
  });

  if (!lista.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = lista.map(p => {
    const { sym, num } = fmtPrecio(p);
    const imgs = p.imagenes || (p.imagen ? [p.imagen] : []);
    const imgSrc = imgs[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=60';
    const badge = p.badge
      ? `<span class="card-badge ${p.badge.toLowerCase().replace(/\s/g,'-')}">${p.badge}</span>`
      : '';
    const fotoCount = imgs.length > 1
      ? `<span class="card-foto-count">📷 ${imgs.length}</span>`
      : '';
    return `
      <a class="paquete-card" href="paquete.html?id=${p.id}" aria-label="Ver ${p.nombre}">
        <div class="card-img">
          <img src="${imgSrc}" alt="${p.nombre}" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=60'"/>
          ${badge}${fotoCount}
        </div>
        <div class="card-body">
          <p class="card-cat">${p.categoria || ''}</p>
          <p class="card-destino">📍 ${p.destino}</p>
          <h3 class="card-nombre">${p.nombre}</h3>
          <p class="card-desc">${p.descripcion}</p>
          <div class="card-footer">
            <div class="card-precio-wrap">
              <span class="precio-desde">Desde</span>
              <span class="precio-val"><span class="sym">${sym}</span>${num}</span>
            </div>
            <span class="card-noches">🌙 ${p.noches} noche${p.noches!==1?'s':''}</span>
          </div>
          <button class="card-wa-btn" onclick="consultarWa('${p.id}',event)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Consultar por WhatsApp
          </button>
        </div>
      </a>
    `;
  }).join('');

  // Scroll animations
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.paquete-card').forEach((el, i) => {
      el.style.cssText = `opacity:0;transform:translateY(20px);transition:opacity .5s ${i*.07}s ease,transform .5s ${i*.07}s ease`;
      obs.observe(el);
    });
  }
}

function consultarWa(id, e) {
  e && e.preventDefault();
  const p = paquetes.find(x => x.id === id);
  if (!p) return;
  const msg = encodeURIComponent(`Hola! Vi el paquete "${p.nombre}" en su web y quisiera más información 🌍`);
  window.open(`https://wa.me/${config.whatsapp}?text=${msg}`, '_blank');
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
    });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  aplicarConfig();
  renderFiltros();
  renderPaquetes();
});

window.consultarWa = consultarWa;
