/**
 * HOLA ESCAPADITAS — auth.js
 * Autenticación local del panel.
 * Sin contraseñas hardcodeadas en el repositorio.
 */

const AUTH_KEY  = 'he_auth_token';
const HASH_KEY  = 'he_pwd_hash';
const MAX_INTENTOS = 5;
const BLOQUEO_MS   = 15 * 60 * 1000;

async function sha256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredHash() {
  return localStorage.getItem(HASH_KEY) || '';
}

function existePassword() {
  return !!getStoredHash();
}

async function guardarPasswordNueva(password) {
  const hash = await sha256(password);
  localStorage.setItem(HASH_KEY, hash);
  return hash;
}

async function verificarPassword(password) {
  const storedHash = getStoredHash();
  if (!storedHash) return false;
  const hash = await sha256(password);
  return hash === storedHash;
}

function crearToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  const token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  const expiry = Date.now() + (4 * 60 * 60 * 1000);
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
  } catch {
    return false;
  }
}

function cerrarSesion() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = 'admin.html';
}

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
  if (!existePassword()) {
    el.textContent = 'Primer acceso: definí una contraseña para habilitar el panel.';
    return;
  }
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

function configurarVista() {
  const isSetup = !existePassword();
  const title = document.getElementById('loginTitle');
  const subtitle = document.getElementById('loginSubtitle');
  const pwdLabel = document.getElementById('pwdLabel');
  const pwdInput = document.getElementById('loginPwd');
  const confirmGroup = document.getElementById('confirmGroup');
  const btnText = document.getElementById('btnLoginText');

  if (title) title.textContent = isSetup ? 'Crear acceso admin' : 'Panel de gestión';
  if (subtitle) subtitle.textContent = isSetup
    ? 'Definí una contraseña inicial para habilitar el panel privado.'
    : 'Ingresá tu contraseña para continuar';
  if (pwdLabel) pwdLabel.textContent = isSetup ? 'Nueva contraseña' : 'Contraseña';
  if (pwdInput) pwdInput.placeholder = isSetup ? 'Mínimo 8 caracteres' : '••••••••';
  if (btnText) btnText.textContent = isSetup ? 'Crear acceso' : 'Ingresar al panel';
  if (confirmGroup) confirmGroup.classList.toggle('hidden', !isSetup);
}

async function intentarLogin() {
  const pwdInput = document.getElementById('loginPwd');
  const pwdConfirm = document.getElementById('loginPwdConfirm');
  const btnText  = document.getElementById('btnLoginText');
  const btnLoader= document.getElementById('btnLoginLoader');
  const btn      = document.getElementById('btnLogin');
  if (!pwdInput || !btn || !btnText || !btnLoader) return;

  const isSetup = !existePassword();

  if (!isSetup) {
    const intentos = getIntentos();
    if (intentos.blockedUntil > Date.now()) {
      const mins = Math.ceil((intentos.blockedUntil - Date.now()) / 60000);
      mostrarAlerta(`Panel bloqueado. Intentá de nuevo en ${mins} minuto${mins !== 1 ? 's' : ''}.`);
      return;
    }
  }

  const pwd = pwdInput.value.trim();
  if (!pwd) {
    mostrarAlerta(isSetup ? 'Definí una contraseña.' : 'Ingresá tu contraseña.');
    return;
  }

  if (isSetup) {
    const confirm = pwdConfirm?.value.trim() || '';
    if (pwd.length < 8) {
      mostrarAlerta('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (pwd !== confirm) {
      mostrarAlerta('Las contraseñas no coinciden.');
      return;
    }
  }

  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  ocultarAlerta();

  await new Promise(r => setTimeout(r, 400 + Math.random() * 250));

  if (isSetup) {
    await guardarPasswordNueva(pwd);
    resetIntentos();
    crearToken();
    mostrarAlerta('Acceso admin creado correctamente.', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
  } else {
    const ok = await verificarPassword(pwd);
    if (ok) {
      resetIntentos();
      crearToken();
      mostrarAlerta('Ingreso correcto.', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
    } else {
      const intentos = getIntentos();
      const nuevo = {
        count: intentos.count + 1,
        blockedUntil: intentos.count + 1 >= MAX_INTENTOS ? Date.now() + BLOQUEO_MS : 0
      };
      setIntentos(nuevo);
      actualizarContador();
      if (nuevo.blockedUntil > 0) {
        mostrarAlerta('Demasiados intentos. Panel bloqueado por 15 minutos.');
      } else {
        mostrarAlerta(`Contraseña incorrecta. Intentos restantes: ${MAX_INTENTOS - nuevo.count}`);
      }
      pwdInput.value = '';
      pwdInput.focus();
    }
  }

  btn.disabled = false;
  btnText.classList.remove('hidden');
  btnLoader.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  if (estaAutenticado() && existePassword()) {
    window.location.href = 'dashboard.html';
    return;
  }

  configurarVista();
  actualizarContador();

  const btn = document.getElementById('btnLogin');
  const pwdInput = document.getElementById('loginPwd');
  const pwdConfirm = document.getElementById('loginPwdConfirm');
  const toggle = document.getElementById('togglePwd');
  const toggleConfirm = document.getElementById('togglePwdConfirm');

  if (btn) btn.addEventListener('click', intentarLogin);
  if (pwdInput) pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') intentarLogin(); });
  if (pwdConfirm) pwdConfirm.addEventListener('keydown', e => { if (e.key === 'Enter') intentarLogin(); });
  if (toggle && pwdInput) {
    toggle.addEventListener('click', () => {
      pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
    });
  }
  if (toggleConfirm && pwdConfirm) {
    toggleConfirm.addEventListener('click', () => {
      pwdConfirm.type = pwdConfirm.type === 'password' ? 'text' : 'password';
    });
  }
});

window.HEAuth = { estaAutenticado, cerrarSesion, sha256, getStoredHash, guardarPasswordNueva, HASH_KEY, existePassword };
