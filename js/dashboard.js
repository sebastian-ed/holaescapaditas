let packagesCache = [];
let currentEditingId = null;

function toast(id, message, kind = 'ok') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `form-toast ${kind}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3500);
}

function switchSection(name) {
  const map = { paquetes: 'sectionPaquetes', nuevo: 'sectionNuevo', config: 'sectionConfig' };
  qsa('.snav-item[data-section]').forEach(btn => btn.classList.toggle('active', btn.dataset.section === name));
  qsa('.dash-section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(map[name])?.classList.remove('hidden');
  document.getElementById('dashTitle').textContent = name === 'paquetes' ? 'Mis paquetes' : name === 'nuevo' ? (currentEditingId ? 'Editar paquete' : 'Nuevo paquete') : 'Configuración';
}

function resetForm() {
  currentEditingId = null;
  ['f-id','f-nombre','f-slug','f-destino','f-categoria','f-precio','f-noches','f-badge','f-descripcion','f-descripcionLarga','f-incluye','f-imageUrls'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('f-moneda').value = 'ARS';
  document.getElementById('f-activo').value = 'true';
  document.getElementById('formTitle').textContent = 'Nuevo paquete';
  document.getElementById('btnGuardarText').textContent = 'Guardar paquete';
}

function renderList() {
  const list = document.getElementById('dashPaquetesList');
  const total = packagesCache.length;
  const active = packagesCache.filter(x => x.activo).length;
  document.getElementById('statTotal').textContent = String(total);
  document.getElementById('statActivos').textContent = String(active);
  document.getElementById('statOcultos').textContent = String(total - active);

  if (!total) {
    list.innerHTML = '<div class="empty-state"><h3>No hay paquetes todavía</h3><p>Cargá el primero desde “Nuevo paquete”.</p></div>';
    return;
  }

  list.innerHTML = packagesCache.map(p => {
    const images = parseImageList(p.image_urls);
    const thumb = images[0] || '';
    const price = fmtPrice(p);
    return `
      <div class="dash-paq-item">
        ${thumb ? `<img class="dash-paq-thumb" src="${escapeHtml(thumb)}" alt="${escapeHtml(p.nombre)}">` : `<div class="dash-paq-thumb dash-paq-placeholder">✈️</div>`}
        <div class="dash-paq-info">
          <strong>${escapeHtml(p.nombre)}</strong>
          <span>${escapeHtml(p.destino || '')} · ${Number(p.noches || 1)} noche${Number(p.noches || 1) === 1 ? '' : 's'} · ${escapeHtml(price.symbol)}${escapeHtml(price.value)}</span>
        </div>
        <span class="dash-paq-badge ${p.activo ? 'activo' : 'oculto'}">${p.activo ? 'Activo' : 'Oculto'}</span>
        <div class="dash-paq-actions">
          <button class="btn-edit" data-edit="${p.id}">Editar</button>
          <button class="btn-del" data-delete="${p.id}">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');

  qsa('[data-edit]').forEach(btn => btn.addEventListener('click', () => editPackage(btn.dataset.edit)));
  qsa('[data-delete]').forEach(btn => btn.addEventListener('click', () => deletePackage(btn.dataset.delete)));
}

async function fetchPackages() {
  const { data, error } = await window.supabaseClient
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    toast('formToast', error.message, 'err');
    return;
  }
  packagesCache = data || [];
  renderList();
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function savePackage() {
  const nombre = document.getElementById('f-nombre').value.trim();
  const destino = document.getElementById('f-destino').value.trim();
  const descripcionCorta = document.getElementById('f-descripcion').value.trim();
  const slugField = document.getElementById('f-slug');
  const slug = (slugField.value.trim() || slugify(nombre));

  if (!nombre || !destino || !descripcionCorta || !slug) {
    toast('formToast', 'Completá nombre, destino, descripción corta y slug.', 'err');
    return;
  }

  const payload = {
    nombre,
    slug,
    destino,
    categoria: document.getElementById('f-categoria').value.trim() || 'General',
    precio: Number(document.getElementById('f-precio').value || 0),
    moneda: document.getElementById('f-moneda').value,
    noches: Number(document.getElementById('f-noches').value || 1),
    badge: document.getElementById('f-badge').value.trim(),
    descripcion_corta: descripcionCorta,
    descripcion_larga: document.getElementById('f-descripcionLarga').value.trim(),
    incluye: document.getElementById('f-incluye').value.trim(),
    image_urls: document.getElementById('f-imageUrls').value.trim(),
    activo: document.getElementById('f-activo').value === 'true',
  };

  let response;
  if (currentEditingId) {
    response = await window.supabaseClient.from('packages').update(payload).eq('id', currentEditingId);
  } else {
    response = await window.supabaseClient.from('packages').insert(payload);
  }

  if (response.error) {
    toast('formToast', response.error.message, 'err');
    return;
  }

  toast('formToast', currentEditingId ? 'Paquete actualizado.' : 'Paquete creado.', 'ok');
  resetForm();
  await fetchPackages();
  switchSection('paquetes');
}

function editPackage(id) {
  const item = packagesCache.find(x => String(x.id) === String(id));
  if (!item) return;
  currentEditingId = item.id;
  document.getElementById('formTitle').textContent = 'Editar paquete';
  document.getElementById('btnGuardarText').textContent = 'Guardar cambios';
  document.getElementById('f-id').value = item.id;
  document.getElementById('f-nombre').value = item.nombre || '';
  document.getElementById('f-slug').value = item.slug || '';
  document.getElementById('f-destino').value = item.destino || '';
  document.getElementById('f-categoria').value = item.categoria || '';
  document.getElementById('f-precio').value = item.precio || 0;
  document.getElementById('f-moneda').value = item.moneda || 'ARS';
  document.getElementById('f-noches').value = item.noches || 1;
  document.getElementById('f-badge').value = item.badge || '';
  document.getElementById('f-descripcion').value = item.descripcion_corta || '';
  document.getElementById('f-descripcionLarga').value = item.descripcion_larga || '';
  document.getElementById('f-incluye').value = item.incluye || '';
  document.getElementById('f-imageUrls').value = item.image_urls || '';
  document.getElementById('f-activo').value = item.activo ? 'true' : 'false';
  switchSection('nuevo');
}

async function deletePackage(id) {
  const item = packagesCache.find(x => String(x.id) === String(id));
  if (!item) return;
  if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;
  const { error } = await window.supabaseClient.from('packages').delete().eq('id', id);
  if (error) {
    toast('formToast', error.message, 'err');
    return;
  }
  await fetchPackages();
}

async function loadConfig() {
  const { data, error } = await window.supabaseClient.from('site_config').select('*').eq('id', 1).maybeSingle();
  if (error) return;
  if (!data) return;
  document.getElementById('c-whatsapp').value = data.whatsapp || '';
  document.getElementById('c-mensajeWa').value = data.mensaje_wa || '';
  document.getElementById('c-email').value = data.email || '';
  document.getElementById('c-telefono').value = data.telefono || '';
  document.getElementById('c-instagram').value = data.instagram || '';
}

async function saveConfig() {
  const payload = {
    id: 1,
    whatsapp: document.getElementById('c-whatsapp').value.trim(),
    mensaje_wa: document.getElementById('c-mensajeWa').value.trim(),
    email: document.getElementById('c-email').value.trim(),
    telefono: document.getElementById('c-telefono').value.trim(),
    instagram: document.getElementById('c-instagram').value.trim(),
  };

  const { error } = await window.supabaseClient.from('site_config').upsert(payload);
  if (error) {
    toast('configToast', error.message, 'err');
    return;
  }
  toast('configToast', 'Configuración guardada.', 'ok');
}

async function initDashboard() {
  if (!window.supabaseClient) {
    document.body.innerHTML = '<div class="empty-state" style="padding:4rem"><h3>Falta configurar Supabase</h3><p>Completá js/supabase-config.js antes de usar el panel.</p></div>';
    return;
  }

  const { data } = await window.supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = 'admin.html';
    return;
  }

  qsa('.snav-item[data-section]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.section === 'nuevo' && !currentEditingId) resetForm();
    switchSection(btn.dataset.section);
  }));

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'admin.html';
  });

  document.getElementById('btnGuardar')?.addEventListener('click', savePackage);
  document.getElementById('btnCancelar')?.addEventListener('click', () => {
    resetForm();
    switchSection('paquetes');
  });
  document.getElementById('btnGuardarConfig')?.addEventListener('click', saveConfig);
  document.getElementById('f-nombre')?.addEventListener('blur', () => {
    const slugInput = document.getElementById('f-slug');
    if (!slugInput.value.trim()) slugInput.value = slugify(document.getElementById('f-nombre').value);
  });
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  await Promise.all([fetchPackages(), loadConfig()]);
}

document.addEventListener('DOMContentLoaded', initDashboard);
