(function () {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  function looksConfigured(value) {
    return value && !String(value).includes('PEGA_AQUI');
  }

  window.isSupabaseConfigured = function () {
    return looksConfigured(url) && looksConfigured(key);
  };

  if (!window.isSupabaseConfigured()) {
    window.supabaseClient = null;
    return;
  }

  window.supabaseClient = window.supabase.createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
})();
