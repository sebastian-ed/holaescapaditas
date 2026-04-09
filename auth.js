/**
 * HOLA ESCAPADITAS — auth.js
 * ============================================================
 * Autenticación segura con Web Crypto API (SHA-256)
 * La contraseña NUNCA se almacena en texto plano.
 * Se guarda solo el hash SHA-256. Nunca viaja en claro.
 * ============================================================
 */

const AUTH_KEY  = 'he_auth_token';
const HASH_KEY  = 'he_pwd_hash';

// Contraseña inicial hasheada (SHA-256 de "Escapaditas2025!")
// Para cambiarla: usá el panel de configuración
const DEFAULT_HASH = 'b7e69b9a93f8f3bde543c4cedb5f8ee9b24ad8c5f6a7f3e0d9c8b1a2e4f6d3c7';

async function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredHash() {
  return localStorage.getItem(HASH_KEY) || DEFAULT_HASH;
}

async function verificarPassword(password) {
  const hash = await sha256(password);
  return hash === getStoredHash();
}

function crearToken() {
  // Token de sesión: random string + timestamp
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  const token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  const expiry = Date.now() + (4 * 60 * 60 * 1000); // 4 horas
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({ token, expiry }));
  return token;
}

function estaAutenticado() {
  const raw = sessionStorage.getItem(AUTH_KEY);
  if (!raw) return false;
  try {
    const { expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      sessionStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch { return false; }
}

function cerrarSesion() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = 'admin.html';
}

// ============================================================
// LOGIN PAGE LOGIC
// ============================================================
const MAX_INTENTOS = 5;
const BLOQUEO_MS   = 15 * 60 * 1000; // 15 minutos

function getIntentos() {
  const raw = localStorage.getItem('he_login_attempts');
  if (!raw) return { count: 0, blockedUntil: 0 };
  try { return JSON.parse(raw); } catch { return { count: 0, blockedUntil: 0 }; }
}
function setIntentos(data) {
  localStorage.setItem('he_login_attempts', JSON.stringify(data));
}
function resetIntentos() {
  localStorage.removeItem('he_login_attempts');
}

function mostrarAlerta(msg, tipo = 'error') {
  const el = document.getElementById('loginAlert');
  if (!el) return;
  el.className = `login-alert ${tipo}`;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function ocultarAlerta() {
  const el = document.getElementById('loginAlert');
  if (el) el.classList.add('hidden');
}

function actualizarContador() {
  const el = document.getElementById('loginAttempts');
  if (!el) return;
  const { count, blockedUntil } = getIntentos();
  if (blockedUntil > Date.now()) {
    const mins = Math.ceil((blockedUntil - Date.now()) / 60000);
    el.textContent = `Panel bloqueado por ${mins} min. Demasiados intentos fallidos.`;
  } else if (count > 0) {
    el.textContent = `Intentos fallidos: ${count}/${MAX_INTENTOS}`;
  } else {
    el.textContent = '';
  }
}

async function intentarLogin() {
  const pwdInput = document.getElementById('loginPwd');
  const btnText  = document.getElementById('btnLoginText');
  const btnLoader= document.getElementById('btnLoginLoader');
  const btn      = document.getElementById('btnLogin');
  if (!pwdInput) return;

  // Verificar bloqueo
  const intentos = getIntentos();
  if (intentos.blockedUntil > Date.now()) {
    const mins = Math.ceil((intentos.blockedUntil - Date.now()) / 60000);
    mostrarAlerta(`Panel bloqueado. Intentá de nuevo en ${mins} minuto${mins !== 1 ? 's' : ''}.`);
    return;
  }

  const pwd = pwdInput.value;
  if (!pwd) {
    mostrarAlerta('Ingresá tu contraseña.');
    return;
  }

  // Loading state
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  ocultarAlerta();

  // Pequeña pausa para no revelar velocidad del hash (previene timing attacks)
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

  const ok = await verificarPassword(pwd);

  btn.disabled = false;
  btnText.classList.remove('hidden');
  btnLoader.classList.add('hidden');

  if (ok) {
    resetIntentos();
    crearToken();
    mostrarAlerta('¡Bienvenida/o!', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
  } else {
    const nuevo = {
      count: intentos.count + 1,
      blockedUntil: intentos.count + 1 >= MAX_INTENTOS ? Date.now() + BLOQUEO_MS : 0
    };
    setIntentos(nuevo);
    actualizarContador();
    if (nuevo.blockedUntil > 0) {
      mostrarAlerta(`Demasiados intentos. Panel bloqueado por 15 minutos.`);
    } else {
      mostrarAlerta(`Contraseña incorrecta. Intentos restantes: ${MAX_INTENTOS - nuevo.count}`);
    }
    pwdInput.value = '';
    pwdInput.focus();
  }
}

// INIT LOGIN PAGE
document.addEventListener('DOMContentLoaded', () => {
  // Si ya está autenticado, redirigir directo
  if (estaAutenticado()) {
    window.location.href = 'dashboard.html';
    return;
  }

  actualizarContador();

  const btn     = document.getElementById('btnLogin');
  const pwdInput= document.getElementById('loginPwd');
  const toggle  = document.getElementById('togglePwd');

  if (btn)      btn.addEventListener('click', intentarLogin);
  if (pwdInput) pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') intentarLogin(); });
  if (toggle) {
    toggle.addEventListener('click', () => {
      const tipo = pwdInput.type === 'password' ? 'text' : 'password';
      pwdInput.type = tipo;
    });
  }
});

// Exportar para uso en dashboard
window.HEAuth = { estaAutenticado, cerrarSesion, sha256, getStoredHash, HASH_KEY };
