function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function normalizePhone(phone) {
  return String(phone || '').replace(/\D+/g, '');
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseImageList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || '')
    .split(/\n|,/)
    .map(v => v.trim())
    .filter(Boolean);
}

function fmtPrice(item) {
  const symbol = item.moneda === 'USD' ? 'USD ' : '$ ';
  const value = Number(item.precio || 0).toLocaleString('es-AR');
  return { symbol, value };
}

function setupNavbar() {
  const hamburger = qs('#hamburger');
  const navLinks = qs('#navLinks');
  const navbar = qs('#navbar');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open') ? 'true' : 'false');
    });
  }
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  });
}

function updateContactLinks(config) {
  const phone = normalizePhone(config.whatsapp || '');
  const msg = encodeURIComponent(config.mensaje_wa || 'Hola! Quiero consultar por un paquete.');
  const wa = phone ? `https://wa.me/${phone}?text=${msg}` : '#';

  ['navWaBtn', 'heroCta', 'ctaWa', 'footerWa', 'waFloat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = wa;
  });

  const mail = document.getElementById('ctaMail');
  if (mail) mail.href = `mailto:${config.email || ''}`;

  const emailDisplay = document.getElementById('emailDisplay');
  if (emailDisplay) emailDisplay.textContent = config.email || 'Sin configurar';

  const telDisplay = document.getElementById('telefonoDisplay');
  if (telDisplay) telDisplay.textContent = config.telefono || 'Sin configurar';
}

function showConfigError(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div class="empty-state">
      <h3>Falta conectar Supabase</h3>
      <p>Completá <strong>js/supabase-config.js</strong> con tu URL y tu anon key.</p>
    </div>
  `;
}
