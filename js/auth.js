function showLoginAlert(message, type = 'error') {
  const el = document.getElementById('loginAlert');
  if (!el) return;
  el.className = `login-alert ${type}`;
  el.textContent = message;
  el.classList.remove('hidden');
}

async function handleLogin() {
  if (!window.supabaseClient) {
    showLoginAlert('Falta configurar Supabase en js/supabase-config.js.');
    return;
  }

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPwd').value;
  const btn = document.getElementById('btnLogin');
  const btnText = document.getElementById('btnLoginText');
  const btnLoader = document.getElementById('btnLoginLoader');

  if (!email || !password) {
    showLoginAlert('Ingresá email y contraseña.');
    return;
  }

  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btnText.classList.remove('hidden');
  btnLoader.classList.add('hidden');

  if (error) {
    showLoginAlert(error.message);
    return;
  }

  window.location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) {
    showLoginAlert('Falta configurar Supabase en js/supabase-config.js.');
    return;
  }

  const { data } = await window.supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = 'dashboard.html';
    return;
  }

  document.getElementById('btnLogin')?.addEventListener('click', handleLogin);
  document.getElementById('loginPwd')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('loginEmail')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('togglePwd')?.addEventListener('click', () => {
    const input = document.getElementById('loginPwd');
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});
