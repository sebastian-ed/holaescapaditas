# ✈️ Escapaditas — Web de Paquetes de Viaje

Web profesional, responsive y lista para publicar en **GitHub Pages**.

---

## 🚀 Cómo subir a GitHub Pages

### Paso 1 — Crear repositorio en GitHub
1. Entrá a [github.com](https://github.com) y creá una cuenta (si no tenés).
2. Hacé clic en **"New repository"**.
3. Nombre: `hola-escapaditas.github.io` (o cualquier nombre).
4. Dejalo **público**.
5. Hacé clic en **"Create repository"**.

### Paso 2 — Subir los archivos
**Opción A — Sin instalar nada (más fácil):**
1. En tu nuevo repositorio, hacé clic en **"uploading an existing file"**.
2. Arrastrá todos los archivos y carpetas de esta carpeta.
3. Hacé clic en **"Commit changes"**.

**Opción B — Con Git:**
```bash
git init
git add .
git commit -m "🚀 Primera versión del sitio"
git remote add origin https://github.com/TU_USUARIO/hola-escapaditas.github.io.git
git push -u origin main
```

### Paso 3 — Activar GitHub Pages
1. En el repositorio, andá a **Settings → Pages**.
2. En "Source" elegí **"Deploy from a branch"**.
3. Branch: `main` / Folder: `/ (root)`.
4. Guardá y esperá 1-2 minutos.
5. Tu sitio va a estar en: `https://TU_USUARIO.github.io/NOMBRE_REPO/`

---

## ⚙️ Personalizar antes de publicar

### Cambiar WhatsApp, email y teléfono
Abrí el panel admin con el botón **⚙️** (abajo a la izquierda).
- **Contraseña inicial:** `escapaditas2025`
- Andá a la pestaña **"Configuración"**
- Cambiá el número de WhatsApp, email, teléfono e Instagram
- **¡Cambiá la contraseña del panel!**

### Editar paquetes
- Usá el botón **⚙️** → pestaña **"Paquetes"** para ver, editar o eliminar.
- Usá **"+ Nuevo paquete"** para agregar.
- Los cambios se guardan en el navegador automáticamente.

### Cambiar URL del sitio en el código
Buscá y reemplazá `hola-escapaditas.github.io` con tu URL real en:
- `index.html` (etiquetas og:url, canonical, schema.org)
- `sitemap.xml`
- `robots.txt`

---

## 📁 Estructura de archivos

```
escapaditas/
├── index.html          ← Página principal
├── robots.txt          ← Para Google
├── sitemap.xml         ← Para Google & IA
├── css/
│   └── style.css       ← Todo el estilo
├── js/
│   ├── paquetes.js     ← Paquetes de ejemplo iniciales
│   └── app.js          ← Lógica, panel admin, etc.
└── img/
    └── favicon.svg     ← Ícono del sitio
```

---

## 🔍 SEO — Cómo aparecen en Google y en IA

El sitio ya incluye:
- **Schema.org** `TravelAgency` → Las IAs (ChatGPT, Perplexity, etc.) usan esto.
- **Open Graph** → Previews bonitos en WhatsApp y redes sociales.
- **Sitemap.xml** → Envialo a Google Search Console.
- **robots.txt** → Autoriza a todos los crawlers.
- **Meta description y keywords** optimizados.

### Para acelerar el posicionamiento:
1. **Google Search Console:** Registrá tu sitio en [search.google.com/search-console](https://search.google.com/search-console) y enviá el sitemap.
2. **Google Business Profile:** Si tenés un perfil de empresa, agregá el link de tu web.
3. **Instagram:** Ponele el link de la web en tu bio de @hola.escapaditas.
4. **Actualizá `sitemap.xml`** cada vez que agregues paquetes nuevos (cambiá la fecha `lastmod`).

---

## 💬 Soporte
¿Preguntas? Consultá con el asistente de IA que te generó este sitio.
