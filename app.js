/**
 * ESCAPADITAS — App Principal
 * Panel de admin, render de paquetes, filtros, modal y config
 */

/* ===== STORAGE UTILS ===== */
const LS_KEY_PAQUETES = 'escapaditas_paquetes';
const LS_KEY_CONFIG   = 'escapaditas_config';

function cargarPaquetes() {
  const raw = localStorage.getItem(LS_KEY_PAQUETES);
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  // Primera vez: guardar los iniciales
  localStorage.setItem(LS_KEY_PAQUETES, JSON.stringify(PAQUETES_INICIALES));
  return PAQUETES_INICIALES;
}

function guardarPaquetes(lista) {
  localStorage.setItem(LS_KEY_PAQUETES, JSON.stringify(lista));
}

function cargarConfig() {
  const raw = localStorage.getItem(LS_KEY_CONFIG);
  if (raw) { try { return { ...CONFIG_INICIAL, ...JSON.parse(raw) }; } catch(e){} }
  return CONFIG_INICIAL;
}

function guardarConfig(cfg) {
  localStorage.setItem(LS_KEY_CONFIG, JSON.stringify(cfg));
}

/* ===== ESTADO GLOBAL ===== */
let paquetes = cargarPaquetes();
let config   = cargarConfig();
let categoriaActiva = 'todos';
let adminAbierto = false;
let adminTab = 'lista';
let editandoId = null;

/* ===== APLICAR CONFIG AL DOM ===== */
function aplicarConfig() {
  // WhatsApp links
  const waMsg = encodeURIComponent(config.mensajeWa || CONFIG_INICIAL.mensajeWa);
  const waUrl = `https://wa.me/${config.whatsapp}?text=${waMsg}`;
  document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
    if (!el.closest('#adminOverlay')) el.href = waUrl;
  });
  // Email
  const mailEl = document.querySelector('a[href^="mailto"]');
  if (mailEl) mailEl.href = `mailto:${config.email}`;
  const mailP = mailEl ? mailEl.querySelector('p') : null;
  if (mailP) mailP.textContent = config.email;
  // Teléfono
  const telEl = document.getElementById('telefonoContacto');
  if (telEl) telEl.textContent = config.telefono;
  // Instagram
  document.querySelectorAll('a[href*="instagram.com"]').forEach(el => {
    if (!el.closest('#adminOverlay')) el.href = config.instagram;
  });
}

/* ===== CATEGORÍAS ===== */
function getCategorias() {
  const cats = ['todos', ...new Set(paquetes.filter(p=>p.activo).map(p=>p.categoria))];
  return cats;
}

function renderFiltros() {
  const el = document.getElementById('filtros');
  if (!el) return;
  el.innerHTML = getCategorias().map(c =>
    `<button class="filtro-btn${c === categoriaActiva ? ' active' : ''}" data-cat="${c}">${c === 'todos' ? 'Todos' : c}</button>`
  ).join('');
  el.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoriaActiva = btn.dataset.cat;
      renderFiltros();
      renderPaquetes();
    });
  });
}

/* ===== RENDER PAQUETES ===== */
function formatPrecio(precio, moneda) {
  if (moneda === 'USD') return { moneda: 'USD', num: `${precio.toLocaleString('es-AR')}` };
  return { moneda: 'ARS', num: `${precio.toLocaleString('es-AR')}` };
}

function renderPaquetes() {
  const grid  = document.getElementById('paquetesGrid');
  const empty = document.getElementById('paquetesEmpty');
  if (!grid) return;

  const lista = paquetes.filter(p => {
    if (!p.activo) return false;
    if (categoriaActiva === 'todos') return true;
    return p.categoria === categoriaActiva;
  });

  if (lista.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = lista.map(p => {
    const { moneda, num } = formatPrecio(p.precio, p.moneda);
    const badge = p.badge ? `<span class="card-badge${p.badge === 'Oferta' ? ' oferta' : ''}">${p.badge}</span>` : '';
    return `
      <article class="paquete-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Ver detalles: ${p.nombre}">
        <div class="card-img-wrap">
          <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=60'"/>
          ${badge}
        </div>
        <div class="card-body">
          <p class="card-destino">📍 ${p.destino}</p>
          <h3 class="card-title">${p.nombre}</h3>
          <p class="card-desc">${p.descripcion}</p>
          <div class="card-meta">
            <div class="card-precio">
              <span class="precio-desde">Desde</span>
              <span class="precio-num">${moneda === 'USD' ? 'USD' : '$'} ${num}</span>
            </div>
            <span class="card-noches">🌙 ${p.noches} noches</span>
          </div>
          <button class="card-cta-btn" onclick="consultarPaquete('${p.id}',event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Consultar por WhatsApp
          </button>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('.paquete-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-cta-btn')) return;
      abrirModal(card.dataset.id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') abrirModal(card.dataset.id);
    });
  });
}

function consultarPaquete(id, e) {
  e && e.stopPropagation();
  const p = paquetes.find(x => x.id === id);
  if (!p) return;
  const msg = encodeURIComponent(`Hola! Vi el paquete "${p.nombre}" en su web y quisiera más información 🌍`);
  window.open(`https://wa.me/${config.whatsapp}?text=${msg}`, '_blank');
}

/* ===== MODAL ===== */
function abrirModal(id) {
  const p = paquetes.find(x => x.id === id);
  if (!p) return;
  const { moneda, num } = formatPrecio(p.precio, p.moneda);
  const msg = encodeURIComponent(`Hola! Vi el paquete "${p.nombre}" en su web y quisiera más información 🌍`);
  const waUrl = `https://wa.me/${config.whatsapp}?text=${msg}`;
  const incluye = p.incluye.map(i => `<li>${i}</li>`).join('');

  document.getElementById('modalBody').innerHTML = `
    <img class="modal-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=60'"/>
    <div class="modal-content">
      <p class="card-destino">📍 ${p.destino}</p>
      <h2>${p.nombre}</h2>
      <p class="modal-desc">${p.descripcionLarga || p.descripcion}</p>
      <div class="modal-incluye">
        <h4>¿Qué incluye?</h4>
        <ul>${incluye}</ul>
      </div>
      <div class="modal-footer">
        <div class="modal-precio-wrap">
          <div class="card-precio">
            <span class="precio-desde">Desde</span>
            <span class="precio-num">${moneda === 'USD' ? 'USD' : '$'} ${num}</span>
            <span class="precio-moneda">/ persona · ${p.noches} noches</span>
          </div>
        </div>
        <a href="${waUrl}" target="_blank" rel="noopener" class="modal-wa-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  `;
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', cerrarModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) cerrarModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModal();
    if (adminAbierto) cerrarAdmin();
  }
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ===== ADMIN PANEL ===== */
function crearAdminHTML() {
  const overlay = document.createElement('div');
  overlay.id = 'adminOverlay';
  overlay.className = 'admin-overlay hidden';
  overlay.innerHTML = `
    <div class="admin-panel" id="adminPanel">
      <button class="modal-close" id="adminClose" aria-label="Cerrar panel">✕</button>
      <h2>⚙️ Panel de gestión</h2>
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="lista">Paquetes</button>
        <button class="admin-tab" data-tab="nuevo">+ Nuevo paquete</button>
        <button class="admin-tab" data-tab="config">Configuración</button>
      </div>
      <div id="adminContent"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('adminClose').addEventListener('click', cerrarAdmin);
  overlay.addEventListener('click', e => { if (e.target === overlay) cerrarAdmin(); });

  overlay.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      adminTab = tab.dataset.tab;
      overlay.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t === tab));
      if (adminTab !== 'nuevo') editandoId = null;
      renderAdminContent();
    });
  });
}

const ADMIN_FAB_HTML = `
  <button class="admin-fab" id="adminFab" title="Panel de administración" aria-label="Abrir panel admin">⚙️</button>
`;

function crearFab() {
  const el = document.createElement('div');
  el.innerHTML = ADMIN_FAB_HTML;
  document.body.appendChild(el.firstElementChild);
  document.getElementById('adminFab').addEventListener('click', () => {
    pedirPasswordYAbrir();
  });
}

let adminAuth = false;
function pedirPasswordYAbrir() {
  if (adminAuth) { abrirAdmin(); return; }
  const pw = prompt('Ingresá la contraseña de administrador:');
  if (pw === config.adminPassword) {
    adminAuth = true;
    abrirAdmin();
  } else if (pw !== null) {
    alert('Contraseña incorrecta.');
  }
}

function abrirAdmin() {
  adminAbierto = true;
  adminTab = 'lista';
  document.getElementById('adminOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'lista'));
  renderAdminContent();
}

function cerrarAdmin() {
  adminAbierto = false;
  document.getElementById('adminOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderAdminContent() {
  const el = document.getElementById('adminContent');
  if (!el) return;
  if (adminTab === 'lista')   el.innerHTML = renderAdminLista();
  if (adminTab === 'nuevo')   el.innerHTML = renderAdminForm(editandoId);
  if (adminTab === 'config')  el.innerHTML = renderAdminConfig();
  bindAdminEvents();
}

function renderAdminLista() {
  if (paquetes.length === 0) return '<p style="color:var(--muted)">No hay paquetes cargados aún.</p>';
  return `<div class="admin-list">${paquetes.map(p => `
    <div class="admin-item" data-id="${p.id}">
      <img class="admin-item-img" src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/72x56/eee9e0/6b6558?text=✈'"/>
      <div class="admin-item-info">
        <strong>${p.nombre}</strong>
        <span>${p.destino} · ${p.noches}n · ${p.moneda === 'USD' ? 'USD' : '$'} ${p.precio.toLocaleString('es-AR')} ${p.activo ? '✅' : '❌ oculto'}</span>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" data-edit="${p.id}">Editar</button>
        <button class="btn-del" data-del="${p.id}">Eliminar</button>
      </div>
    </div>
  `).join('')}</div>`;
}

function renderAdminForm(id) {
  const p = id ? paquetes.find(x => x.id === id) : null;
  const v = (field, def='') => p ? (p[field] ?? def) : def;
  return `
    <form class="admin-form" id="paqForm" autocomplete="off">
      <div class="form-row">
        <div class="form-group">
          <label>Nombre del paquete *</label>
          <input name="nombre" value="${v('nombre')}" placeholder="Ej: Bariloche Mágico" required/>
        </div>
        <div class="form-group">
          <label>Destino *</label>
          <input name="destino" value="${v('destino')}" placeholder="Ej: Patagonia, Argentina" required/>
        </div>
      </div>
      <div class="form-group">
        <label>Descripción corta (tarjeta) *</label>
        <textarea name="descripcion" rows="2" required>${v('descripcion')}</textarea>
      </div>
      <div class="form-group">
        <label>Descripción larga (detalle del paquete)</label>
        <textarea name="descripcionLarga" rows="4">${v('descripcionLarga')}</textarea>
      </div>
      <div class="form-group">
        <label>URL de imagen</label>
        <input name="imagen" type="url" value="${v('imagen')}" placeholder="https://... (Unsplash, Cloudinary, etc.)"/>
        <span class="form-hint">Usá imágenes de <a href="https://unsplash.com" target="_blank">unsplash.com</a> o subí tus fotos a <a href="https://cloudinary.com" target="_blank">cloudinary.com</a></span>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Precio *</label>
          <input name="precio" type="number" min="0" value="${v('precio', 0)}" required/>
        </div>
        <div class="form-group">
          <label>Moneda</label>
          <select name="moneda">
            <option value="ARS" ${v('moneda','ARS')==='ARS'?'selected':''}>ARS (pesos)</option>
            <option value="USD" ${v('moneda','ARS')==='USD'?'selected':''}>USD (dólares)</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Noches *</label>
          <input name="noches" type="number" min="1" value="${v('noches', 1)}" required/>
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <input name="categoria" value="${v('categoria','Nacional')}" placeholder="Nacional / Internacional / Cruceros..."/>
        </div>
      </div>
      <div class="form-group">
        <label>¿Qué incluye? (separado por comas)</label>
        <input name="incluye" value="${(v('incluye',[]) || []).join(', ')}" placeholder="Vuelos, Hotel, Desayuno, Traslados..."/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Badge / etiqueta</label>
          <input name="badge" value="${v('badge','')}" placeholder="Oferta / Más vendido / Familias..."/>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select name="activo">
            <option value="true" ${v('activo',true)?'selected':''}>Visible en la web</option>
            <option value="false" ${!v('activo',true)?'selected':''}>Oculto</option>
          </select>
        </div>
      </div>
      ${p ? `<input type="hidden" name="id" value="${p.id}"/>` : ''}
      <button type="submit" class="btn-save">${p ? '💾 Guardar cambios' : '➕ Agregar paquete'}</button>
    </form>
  `;
}

function renderAdminConfig() {
  return `
    <form class="config-form" id="configForm">
      <div class="form-group">
        <label>Número de WhatsApp (sin + ni espacios)</label>
        <input name="whatsapp" value="${config.whatsapp}" placeholder="5491100000000"/>
        <span class="form-hint">Código de país + área + número. Ej: 5491100000000</span>
      </div>
      <div class="form-group">
        <label>Mensaje por defecto de WhatsApp</label>
        <input name="mensajeWa" value="${config.mensajeWa}" placeholder="Hola! Quiero consultar..."/>
      </div>
      <div class="form-group">
        <label>Email de contacto</label>
        <input name="email" type="email" value="${config.email}"/>
      </div>
      <div class="form-group">
        <label>Teléfono visible en la web</label>
        <input name="telefono" value="${config.telefono}" placeholder="+54 11 0000-0000"/>
      </div>
      <div class="form-group">
        <label>URL de Instagram</label>
        <input name="instagram" type="url" value="${config.instagram}"/>
      </div>
      <div class="form-group">
        <label>Contraseña del panel admin</label>
        <input name="adminPassword" type="password" value="${config.adminPassword}"/>
        <span class="form-hint">Cambiá esta contraseña para mayor seguridad.</span>
      </div>
      <button type="submit" class="btn-config-save">💾 Guardar configuración</button>
    </form>
  `;
}

function bindAdminEvents() {
  // Editar / eliminar en lista
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      editandoId = btn.dataset.edit;
      adminTab = 'nuevo';
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'nuevo'));
      renderAdminContent();
    });
  });
  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nombre = paquetes.find(p => p.id === btn.dataset.del)?.nombre;
      if (confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
        paquetes = paquetes.filter(p => p.id !== btn.dataset.del);
        guardarPaquetes(paquetes);
        renderFiltros();
        renderPaquetes();
        renderAdminContent();
      }
    });
  });

  // Form paquete
  const paqForm = document.getElementById('paqForm');
  if (paqForm) {
    paqForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(paqForm));
      const paq = {
        id: data.id || `paq-${Date.now()}`,
        nombre: data.nombre.trim(),
        destino: data.destino.trim(),
        descripcion: data.descripcion.trim(),
        descripcionLarga: data.descripcionLarga?.trim() || '',
        imagen: data.imagen?.trim() || '',
        precio: parseFloat(data.precio) || 0,
        moneda: data.moneda || 'ARS',
        noches: parseInt(data.noches) || 1,
        categoria: data.categoria?.trim() || 'General',
        incluye: data.incluye ? data.incluye.split(',').map(s => s.trim()).filter(Boolean) : [],
        badge: data.badge?.trim() || '',
        activo: data.activo === 'true'
      };
      if (data.id) {
        paquetes = paquetes.map(p => p.id === data.id ? paq : p);
      } else {
        paquetes.push(paq);
      }
      guardarPaquetes(paquetes);
      renderFiltros();
      renderPaquetes();
      editandoId = null;
      adminTab = 'lista';
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'lista'));
      renderAdminContent();
      alert(data.id ? '✅ Paquete actualizado.' : '✅ Paquete agregado.');
    });
  }

  // Form config
  const configForm = document.getElementById('configForm');
  if (configForm) {
    configForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(configForm));
      config = { ...config, ...data };
      guardarConfig(config);
      aplicarConfig();
      alert('✅ Configuración guardada.');
    });
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  aplicarConfig();
  renderFiltros();
  renderPaquetes();
  crearAdminHTML();
  crearFab();

  // Scroll animation para cards
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    setTimeout(() => {
      document.querySelectorAll('.paquete-card, .contacto-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        obs.observe(el);
      });
    }, 100);
  }
});

// Exponer globalmente para onclick en HTML generado
window.consultarPaquete = consultarPaquete;
