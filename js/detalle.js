async function loadPackageDetail() {
  const main = document.getElementById('detalleMain');
  if (!window.supabaseClient) {
    showConfigError('detalleMain');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id');
  if (!slug) {
    main.innerHTML = `<div class="empty-state"><h3>Paquete no encontrado</h3><p>El enlace no es válido.</p></div>`;
    return;
  }

  const [{ data: cfg }, { data, error }] = await Promise.all([
    window.supabaseClient.from('site_config').select('whatsapp, mensaje_wa, email, telefono, instagram').eq('id', 1).maybeSingle(),
    window.supabaseClient.from('packages_public').select('*').eq('slug', slug).maybeSingle(),
  ]);

  updateContactLinks(cfg || {});

  if (error || !data) {
    main.innerHTML = `<div class="empty-state"><h3>Paquete no encontrado</h3><p>Puede haber sido ocultado o eliminado.</p></div>`;
    return;
  }

  renderDetail(data, cfg || {});
}

function renderDetail(p, config) {
  const main = document.getElementById('detalleMain');
  const images = parseImageList(p.image_urls);
  const hero = images[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80';
  const items = parseImageList(p.incluye);
  const price = fmtPrice(p);
  const phone = normalizePhone(config.whatsapp || '');
  const waMsg = encodeURIComponent(`Hola! Vi el paquete "${p.nombre}" y quiero más información.`);
  const waLink = phone ? `https://wa.me/${phone}?text=${waMsg}` : '#';

  main.innerHTML = `
    <div class="detalle-hero">
      <img class="detalle-hero-img" id="heroImg" src="${escapeHtml(hero)}" alt="${escapeHtml(p.nombre)}" />
      <div class="detalle-hero-overlay"></div>
      <div class="detalle-hero-info">
        <a href="index.html#paquetes" class="detalle-back">← Volver a paquetes</a>
        ${p.categoria ? `<p class="detalle-cat">${escapeHtml(p.categoria)}</p>` : ''}
        <h1 class="detalle-title">${escapeHtml(p.nombre)}</h1>
        <p class="detalle-destino">📍 ${escapeHtml(p.destino || '')}</p>
      </div>
    </div>

    ${images.length > 1 ? `<div class="detalle-galeria">${images.map((img, i) => `<button class="galeria-thumb ${i === 0 ? 'active' : ''}" data-src="${escapeHtml(img)}"><img src="${escapeHtml(img)}" alt="Foto ${i + 1}" /></button>`).join('')}</div>` : ''}

    <div class="detalle-body">
      <div class="detalle-content">
        <h3>Sobre este paquete</h3>
        ${(p.descripcion_larga || p.descripcion_corta || '').split('\n').filter(Boolean).map(par => `<p>${escapeHtml(par)}</p>`).join('')}
        ${items.length ? `<h3 style="margin-top:2rem">¿Qué incluye?</h3><div class="incluye-grid">${items.map(i => `<span class="incluye-item">✓ ${escapeHtml(i)}</span>`).join('')}</div>` : ''}
      </div>
      <aside class="detalle-sidebar">
        <div class="precio-card">
          <p class="desde">Precio por persona desde</p>
          <p class="precio-grande">${escapeHtml(price.symbol)}${escapeHtml(price.value)}</p>
          <p class="precio-info">🌙 ${Number(p.noches || 1)} noche${Number(p.noches || 1) === 1 ? '' : 's'}</p>
          <div class="detalle-noches">${Number(p.noches || 1)} noche${Number(p.noches || 1) === 1 ? '' : 's'} · ${escapeHtml(p.destino || '')}</div>
          <a href="${waLink}" target="_blank" rel="noopener" class="btn-consultar">Consultar por WhatsApp</a>
          <a href="mailto:${escapeHtml(config.email || '')}?subject=${encodeURIComponent(`Consulta: ${p.nombre}`)}" class="btn-consultar-mail">Consultar por email</a>
        </div>
      </aside>
    </div>
  `;

  document.title = `${p.nombre} | Hola Escapaditas`;
  qsa('.galeria-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const heroImg = document.getElementById('heroImg');
      if (heroImg) heroImg.src = btn.dataset.src;
      qsa('.galeria-thumb').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  loadPackageDetail();
});
