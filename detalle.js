/**
 * HOLA ESCAPADITAS — detalle.js
 * Página de detalle de paquete con galería de fotos
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  aplicarConfig();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { mostrarError(); return; }

  const p = cargarPaquetes().find(x => x.id === id);
  if (!p || !p.activo) { mostrarError(); return; }

  renderDetalle(p);
});

function mostrarError() {
  const main = document.getElementById('detalleMain');
  if (!main) return;
  main.innerHTML = `
    <div style="text-align:center;padding:6rem 1.5rem;max-width:500px;margin:0 auto">
      <p style="font-size:3rem;margin-bottom:1rem">🗺️</p>
      <h2 style="font-family:var(--font-serif);font-size:1.8rem;margin-bottom:.75rem">Paquete no encontrado</h2>
      <p style="color:var(--muted);margin-bottom:2rem">El paquete que buscás no existe o fue desactivado.</p>
      <a href="index.html#paquetes" class="btn-primary" style="display:inline-flex">Ver todos los paquetes</a>
    </div>
  `;
}

function renderDetalle(p) {
  const config = cargarConfig();
  const imgs = p.imagenes || (p.imagen ? [p.imagen] : []);
  const imgPrincipal = imgs[0] || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80';

  const { sym, num } = fmtPrecioDetalle(p);

  const incluye = (p.incluye || []).map(item =>
    `<span class="incluye-item">✓ ${item}</span>`
  ).join('');

  const galeria = imgs.length > 1
    ? `<div class="detalle-galeria" id="detalleGaleria">
        ${imgs.map((img, i) => `
          <div class="galeria-thumb${i===0?' active':''}" data-idx="${i}" data-src="${img}">
            <img src="${img}" alt="Foto ${i+1}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=60'"/>
          </div>
        `).join('')}
      </div>`
    : '';

  const waMsg = encodeURIComponent(`Hola! Vi el paquete "${p.nombre}" en su web y quisiera más información 🌍`);
  const waUrl = `https://wa.me/${config.whatsapp}?text=${waMsg}`;

  const desc = (p.descripcionLarga || p.descripcion || '')
    .split('\n').map(l => l.trim() ? `<p>${l}</p>` : '').join('');

  const main = document.getElementById('detalleMain');
  main.innerHTML = `
    <!-- HERO -->
    <div class="detalle-hero">
      <img class="detalle-hero-img" id="heroImg" src="${imgPrincipal}" alt="${p.nombre}"
           onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80'"/>
      <div class="detalle-hero-overlay"></div>
      <div class="detalle-hero-info">
        <a href="index.html#paquetes" class="detalle-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          Volver a paquetes
        </a>
        ${p.categoria ? `<p class="detalle-cat">📍 ${p.categoria}</p>` : ''}
        <h1 class="detalle-title">${p.nombre}</h1>
        <p class="detalle-destino">📍 ${p.destino}</p>
      </div>
    </div>

    <!-- GALERÍA THUMBNAILS -->
    ${galeria}

    <!-- BODY -->
    <div class="detalle-body">
      <div class="detalle-content">
        <h3>Sobre este paquete</h3>
        ${desc}

        ${p.incluye && p.incluye.length ? `
          <h3 style="margin-top:2rem">¿Qué incluye?</h3>
          <div class="incluye-grid">${incluye}</div>
        ` : ''}
      </div>

      <aside class="detalle-sidebar">
        <div class="precio-card">
          <p class="desde">Precio por persona desde</p>
          <p class="precio-grande">${sym}${num}</p>
          <p class="precio-info">🌙 ${p.noches} noche${p.noches!==1?'s':''}</p>

          <div class="detalle-noches">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            ${p.noches} noche${p.noches!==1?'s':''} · ${p.destino}
          </div>

          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-consultar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Consultar por WhatsApp
          </a>
          <a href="mailto:${config.email}?subject=Consulta: ${encodeURIComponent(p.nombre)}" class="btn-consultar-mail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Consultar por email
          </a>
        </div>
      </aside>
    </div>
  `;

  // SEO dinámico
  document.title = `${p.nombre} | Hola Escapaditas`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = p.descripcion;

  // WA float
  const waFloat = document.getElementById('waFloat');
  if (waFloat) waFloat.href = waUrl;

  // Galería interactiva
  if (imgs.length > 1) {
    document.querySelectorAll('.galeria-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const heroImg = document.getElementById('heroImg');
        if (heroImg) {
          heroImg.style.opacity = '0';
          heroImg.style.transition = 'opacity .2s ease';
          setTimeout(() => {
            heroImg.src = thumb.dataset.src;
            heroImg.style.opacity = '1';
          }, 200);
        }
        document.querySelectorAll('.galeria-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }
}

function fmtPrecioDetalle(p) {
  const sym = p.moneda === 'USD' ? 'USD ' : '$\u00A0';
  return { sym, num: p.precio.toLocaleString('es-AR') };
}
