/**
 * HOLA ESCAPADITAS — dashboard.js
 * Panel de administración completo
 */

/* ===== AUTH GUARD ===== */
// Verificar sesión antes de cargar
(function() {
  const raw = sessionStorage.getItem('he_auth_token');
  if (!raw) { window.location.href = 'admin.html'; return; }
  try {
    const { expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { sessionStorage.removeItem('he_auth_token'); window.location.href = 'admin.html'; }
  } catch { window.location.href = 'admin.html'; }
})();

/* ===== ESTADO ===== */
let paquetes   = cargarPaquetes();
let config     = cargarConfig();
let seccionActual = 'paquetes';
let editandoId = null;
let fotosActuales = []; // Array de {tipo:'url'|'base64', src:string}

/* ===== NAVEGACIÓN ===== */
function irA(seccion) {
  seccionActual = seccion;
  document.querySelectorAll('.snav-item').forEach(b => b.classList.toggle('active', b.dataset.section === seccion));
  document.querySelectorAll('.dash-section').forEach(s => s.classList.add('hidden'));
  const map = { paquetes: 'sectionPaquetes', nuevo: 'sectionNuevo', config: 'sectionConfig' };
  document.getElementById(map[seccion])?.classList.remove('hidden');

  const titulos = { paquetes: 'Mis paquetes', nuevo: editandoId ? 'Editar paquete' : 'Nuevo paquete', config: 'Configuración' };
  document.getElementById('dashTitle').textContent = titulos[seccion] || 'Panel';

  if (seccion === 'nuevo' && !editandoId) limpiarForm();
  if (seccion === 'config') cargarFormConfig();
  if (seccion === 'paquetes') renderListaPaquetes();
}

/* ===== LISTA PAQUETES ===== */
function renderListaPaquetes() {
  const el = document.getElementById('dashPaquetesList');
  if (!el) return;

  const total   = paquetes.length;
  const activos = paquetes.filter(p=>p.activo).length;
  document.getElementById('statTotal').textContent   = total;
  document.getElementById('statActivos').textContent = activos;
  document.getElementById('statOcultos').textContent = total - activos;

  if (!total) {
    el.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted)">No hay paquetes todavía. ¡Creá el primero!</div>`;
    return;
  }

  el.innerHTML = paquetes.map(p => {
    const imgs = p.imagenes || (p.imagen ? [p.imagen] : []);
    const thumb = imgs[0] || '';
    return `
      <div class="dash-paq-item">
        ${thumb
          ? `<img class="dash-paq-thumb" src="${thumb}" alt="${p.nombre}"
                  onerror="this.style.display='none'">`
          : `<div class="dash-paq-thumb" style="display:flex;align-items:center;justify-content:center;background:var(--bg2);font-size:1.5rem">✈️</div>`
        }
        <div class="dash-paq-info">
          <strong>${p.nombre}</strong>
          <span>${p.destino} · ${p.noches} noche${p.noches!==1?'s':''} · ${p.moneda==='USD'?'USD':'$'} ${p.precio?.toLocaleString('es-AR')||0}</span>
        </div>
        <span class="dash-paq-badge ${p.activo?'activo':'oculto'}">${p.activo?'✓ Activo':'Oculto'}</span>
        <div class="dash-paq-actions">
          <button class="btn-edit" onclick="editarPaquete('${p.id}')">Editar</button>
          <button class="btn-del"  onclick="eliminarPaquete('${p.id}')">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ===== FORM PAQUETE ===== */
function limpiarForm() {
  editandoId = null;
  fotosActuales = [];
  ['f-id','f-nombre','f-destino','f-categoria','f-precio','f-noches','f-badge','f-descripcion','f-descripcionLarga','f-incluye'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const moneda = document.getElementById('f-moneda');
  if (moneda) moneda.value = 'ARS';
  const activo = document.getElementById('f-activo');
  if (activo) activo.value = 'true';
  renderFotoPreview();
  document.getElementById('formTitle').textContent = 'Nuevo paquete';
  document.getElementById('btnGuardarText').textContent = 'Guardar paquete';
}

function editarPaquete(id) {
  editandoId = id;
  const p = paquetes.find(x => x.id === id);
  if (!p) return;

  irA('nuevo');
  document.getElementById('formTitle').textContent = 'Editar paquete';
  document.getElementById('btnGuardarText').textContent = 'Guardar cambios';
  document.getElementById('f-id').value = p.id;
  document.getElementById('f-nombre').value = p.nombre || '';
  document.getElementById('f-destino').value = p.destino || '';
  document.getElementById('f-categoria').value = p.categoria || '';
  document.getElementById('f-precio').value = p.precio || '';
  document.getElementById('f-moneda').value = p.moneda || 'ARS';
  document.getElementById('f-noches').value = p.noches || '';
  document.getElementById('f-badge').value = p.badge || '';
  document.getElementById('f-descripcion').value = p.descripcion || '';
  document.getElementById('f-descripcionLarga').value = p.descripcionLarga || '';
  document.getElementById('f-incluye').value = (p.incluye || []).join(', ');
  document.getElementById('f-activo').value = p.activo ? 'true' : 'false';

  const imgs = p.imagenes || (p.imagen ? [p.imagen] : []);
  fotosActuales = imgs.map(src => ({ tipo: 'url', src }));
  renderFotoPreview();
}

function eliminarPaquete(id) {
  const p = paquetes.find(x => x.id === id);
  if (!confirm(`¿Eliminar "${p?.nombre}"? Esta acción no se puede deshacer.`)) return;
  paquetes = paquetes.filter(x => x.id !== id);
  guardarPaquetes(paquetes);
  renderListaPaquetes();
  showToast('formToast', '✓ Paquete eliminado.', 'ok');
}

function guardarPaquete() {
  const nombre = document.getElementById('f-nombre')?.value?.trim();
  const destino = document.getElementById('f-destino')?.value?.trim();
  const precio = parseFloat(document.getElementById('f-precio')?.value) || 0;
  const noches = parseInt(document.getElementById('f-noches')?.value) || 1;
  const descripcion = document.getElementById('f-descripcion')?.value?.trim();

  if (!nombre || !destino || !descripcion) {
    showToast('formToast', '⚠️ Completá los campos obligatorios: nombre, destino y descripción.', 'err');
    return;
  }

  const id = document.getElementById('f-id')?.value || `paq-${Date.now()}`;
  const imagenes = fotosActuales.map(f => f.src);

  const paq = {
    id,
    nombre,
    destino,
    categoria: document.getElementById('f-categoria')?.value?.trim() || 'General',
    precio,
    moneda: document.getElementById('f-moneda')?.value || 'ARS',
    noches,
    badge: document.getElementById('f-badge')?.value?.trim() || '',
    descripcion,
    descripcionLarga: document.getElementById('f-descripcionLarga')?.value?.trim() || '',
    incluye: (document.getElementById('f-incluye')?.value || '').split(',').map(s=>s.trim()).filter(Boolean),
    imagenes,
    // compatibilidad con campo imagen viejo
    imagen: imagenes[0] || '',
    activo: document.getElementById('f-activo')?.value === 'true'
  };

  if (editandoId) {
    paquetes = paquetes.map(p => p.id === editandoId ? paq : p);
  } else {
    paquetes.push(paq);
  }
  guardarPaquetes(paquetes);
  showToast('formToast', editandoId ? '✓ Paquete actualizado.' : '✓ Paquete creado.', 'ok');
  editandoId = null;
  setTimeout(() => irA('paquetes'), 900);
}

/* ===== FOTOS ===== */
function renderFotoPreview() {
  const grid = document.getElementById('fotoPreviewGrid');
  if (!grid) return;
  grid.innerHTML = fotosActuales.map((f, i) => `
    <div class="foto-preview-item${i===0?' portada':''}">
      <img src="${f.src}" alt="Foto ${i+1}"
           onerror="this.src='https://via.placeholder.com/80x60/f2f0ec/8b8580?text=✈'"/>
      ${i===0 ? '<span class="portada-label">PORTADA</span>' : ''}
      <button class="foto-remove" onclick="removerFoto(${i})" title="Quitar foto">✕</button>
    </div>
  `).join('');
}

function removerFoto(idx) {
  fotosActuales.splice(idx, 1);
  renderFotoPreview();
}

function agregarFotoUrl(url) {
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    alert('Ingresá una URL válida (debe empezar con http:// o https://)'); return;
  }
  fotosActuales.push({ tipo: 'url', src: url });
  renderFotoPreview();
}

function procesarArchivos(files) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) { alert(`"${file.name}" no es una imagen.`); return; }
    if (file.size > MAX_SIZE) { alert(`"${file.name}" supera los 5MB.`); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      fotosActuales.push({ tipo: 'base64', src: e.target.result });
      renderFotoPreview();
    };
    reader.readAsDataURL(file);
  });
}

/* ===== CONFIG ===== */
function cargarFormConfig() {
  document.getElementById('c-whatsapp').value  = config.whatsapp  || '';
  document.getElementById('c-mensajeWa').value = config.mensajeWa || '';
  document.getElementById('c-email').value     = config.email     || '';
  document.getElementById('c-telefono').value  = config.telefono  || '';
  document.getElementById('c-instagram').value = config.instagram || '';
  ['c-pwdActual','c-pwdNueva','c-pwdConfirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

async function guardarConfigAdmin() {
  const pwdActual  = document.getElementById('c-pwdActual')?.value || '';
  const pwdNueva   = document.getElementById('c-pwdNueva')?.value  || '';
  const pwdConfirm = document.getElementById('c-pwdConfirm')?.value || '';

  // Si quieren cambiar contraseña
  if (pwdNueva || pwdActual || pwdConfirm) {
    if (!pwdActual) { showToast('configToast', '⚠️ Ingresá la contraseña actual.', 'err'); return; }
    if (pwdNueva !== pwdConfirm) { showToast('configToast', '⚠️ Las contraseñas nuevas no coinciden.', 'err'); return; }
    if (pwdNueva.length < 8) { showToast('configToast', '⚠️ La nueva contraseña debe tener al menos 8 caracteres.', 'err'); return; }

    // Verificar contraseña actual
    const hashActual = await sha256dash(pwdActual);
    const storedHash = localStorage.getItem('he_pwd_hash') || '';
    if (hashActual !== storedHash) { showToast('configToast', '⚠️ La contraseña actual es incorrecta.', 'err'); return; }

    // Guardar nueva contraseña hasheada
    const hashNuevo = await sha256dash(pwdNueva);
    localStorage.setItem('he_pwd_hash', hashNuevo);
  }

  config = {
    ...config,
    whatsapp:  document.getElementById('c-whatsapp')?.value?.trim()  || config.whatsapp,
    mensajeWa: document.getElementById('c-mensajeWa')?.value?.trim() || config.mensajeWa,
    email:     document.getElementById('c-email')?.value?.trim()     || config.email,
    telefono:  document.getElementById('c-telefono')?.value?.trim()  || config.telefono,
    instagram: document.getElementById('c-instagram')?.value?.trim() || config.instagram,
  };
  guardarConfig(config);
  showToast('configToast', '✓ Configuración guardada.', 'ok');
}

async function sha256dash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

/* ===== TOAST ===== */
function showToast(id, msg, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `form-toast ${tipo}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar nav
  document.querySelectorAll('.snav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => irA(btn.dataset.section));
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('he_auth_token');
    window.location.href = 'admin.html';
  });

  // Sidebar toggle mobile
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  // Guardar paquete
  document.getElementById('btnGuardar')?.addEventListener('click', guardarPaquete);
  document.getElementById('btnCancelar')?.addEventListener('click', () => {
    editandoId = null; irA('paquetes');
  });

  // Guardar config
  document.getElementById('btnGuardarConfig')?.addEventListener('click', guardarConfigAdmin);

  // Fotos: drag & drop
  const drop = document.getElementById('fotoDrop');
  if (drop) {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.background = 'rgba(76,110,245,.07)'; });
    drop.addEventListener('dragleave', () => { drop.style.background = ''; });
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.style.background = '';
      procesarArchivos(e.dataTransfer.files);
    });
  }

  // Fotos: selector
  document.getElementById('fotoSelectBtn')?.addEventListener('click', () => {
    document.getElementById('fotoInput')?.click();
  });
  document.getElementById('fotoInput')?.addEventListener('change', e => {
    procesarArchivos(e.target.files);
    e.target.value = '';
  });

  // Fotos: URL
  document.getElementById('fotoUrlAdd')?.addEventListener('click', () => {
    const url = document.getElementById('fotoUrlInput')?.value?.trim();
    if (url) { agregarFotoUrl(url); document.getElementById('fotoUrlInput').value = ''; }
  });
  document.getElementById('fotoUrlInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = e.target.value.trim();
      if (url) { agregarFotoUrl(url); e.target.value = ''; }
    }
  });

  // Render inicial
  renderListaPaquetes();
});

// Exponer para onclicks inline
window.editarPaquete  = editarPaquete;
window.eliminarPaquete= eliminarPaquete;
window.removerFoto    = removerFoto;
