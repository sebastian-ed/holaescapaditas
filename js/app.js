let allPackages = [];
let activeCategory = 'Todos';
let siteConfig = {};

async function loadConfig() {
  if (!window.supabaseClient) return {};
  const { data } = await window.supabaseClient
    .from('site_config')
    .select('whatsapp, mensaje_wa, email, telefono, instagram')
    .eq('id', 1)
    .maybeSingle();
  return data || {};
}

async function loadPackages() {
  const grid = document.getElementById('paquetesGrid');
  const empty = document.getElementById('paquetesEmpty');

  if (!window.supabaseClient) {
    showConfigError('paquetesGrid');
    if (empty) empty.classList.add('hidden');
    return;
  }

  const { data, error } = await window.supabaseClient
    .from('packages_public')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    grid.innerHTML = `<div class="empty-state"><h3>No se pudieron cargar los paquetes</h3><p>${escapeHtml(error.message)}</p></div>`;
    return;
  }

  allPackages = data || [];
  renderFilters();
  renderPackages();
}

function renderFilters() {
  const wrap = document.getElementById('filtros');
  if (!wrap) return;
  const cats = ['Todos', ...new Set(allPackages.map(p => p.categoria).filter(Boolean))];
  wrap.innerHTML = cats.map(cat => `
    <button class="filtro-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
  `).join('');
  qsa('.filtro-btn', wrap).forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderPackages();
    });
  });
}

function packageCard(p) {
  const images = parseImageList(p.image_urls);
  const img = images[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80';
  const badgeClass = (p.badge || '').toLowerCase().includes('oferta') ? 'oferta' : ((p.badge || '').toLowerCase().includes('famil') ? 'familias' : '');
  const price = fmtPrice(p);
  const phone = normalizePhone(siteConfig.whatsapp || '');
  const waMsg = encodeURIComponent(`Hola! Quiero consultar por el paquete "${p.nombre}".`);
  const waLink = phone ? `https://wa.me/${phone}?text=${waMsg}` : '#';

  return `
    <article class="paquete-card">
      <a href="paquete.html?id=${encodeURIComponent(p.slug)}" class="card-link-wrap">
        <div class="card-img">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(p.nombre)}" loading="lazy" />
          ${p.badge ? `<span class="card-badge ${badgeClass}">${escapeHtml(p.badge)}</span>` : ''}
          ${images.length > 1 ? `<span class="card-foto-count">📷 ${images.length}</span>` : ''}
        </div>
        <div class="card-body">
          <p class="card-cat">${escapeHtml(p.categoria || 'Paquete')}</p>
          <p class="card-destino">📍 ${escapeHtml(p.destino || '')}</p>
          <h3 class="card-nombre">${escapeHtml(p.nombre)}</h3>
          <p class="card-desc">${escapeHtml(p.descripcion_corta || '')}</p>
          <div class="card-footer">
            <div class="card-precio-wrap">
              <span class="precio-desde">Precio por persona desde</span>
              <span class="precio-val"><span class="sym">${escapeHtml(price.symbol)}</span>${escapeHtml(price.value)}</span>
            </div>
            <div class="card-noches">${Number(p.noches || 1)} noche${Number(p.noches || 1) === 1 ? '' : 's'}</div>
          </div>
        </div>
      </a>
      <a class="card-wa-btn" href="${waLink}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
    </article>
  `;
}

function renderPackages() {
  const grid = document.getElementById('paquetesGrid');
  const empty = document.getElementById('paquetesEmpty');
  if (!grid) return;

  const filtered = activeCategory === 'Todos'
    ? allPackages
    : allPackages.filter(p => p.categoria === activeCategory);

  grid.innerHTML = filtered.map(packageCard).join('');
  empty?.classList.toggle('hidden', filtered.length > 0);
}

document.addEventListener('DOMContentLoaded', async () => {
  setupNavbar();
  siteConfig = await loadConfig();
  updateContactLinks(siteConfig);
  await loadPackages();
});
