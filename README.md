# ✈️ Hola Escapaditas — Web completa

Web profesional, moderna y lista para GitHub Pages.

---

## 📁 Estructura de archivos

```
holaescapaditas/
├── index.html         ← Página principal
├── paquete.html       ← Página de detalle de cada paquete
├── admin.html         ← Login del panel de administración
├── dashboard.html     ← Panel de gestión (paquetes + config)
├── robots.txt         ← Para Google (bloquea admin)
├── sitemap.xml        ← Para Google & IAs
├── css/
│   └── style.css      ← Todo el diseño
├── js/
│   ├── paquetes.js    ← Datos iniciales y funciones de storage
│   ├── app.js         ← Lógica del sitio principal
│   ├── detalle.js     ← Lógica de la página de paquete
│   ├── auth.js        ← Autenticación segura (SHA-256)
│   └── dashboard.js   ← Panel de administración
└── img/
    └── favicon.svg    ← Ícono del sitio
```

---

## 🚀 Cómo subir a GitHub Pages

### Paso 1 — Crear repositorio
1. Entrá a [github.com](https://github.com) → New repository
2. Nombre: `hola-escapaditas.github.io` (o cualquier nombre)
3. Público → Create repository

### Paso 2 — Subir archivos (sin instalar nada)
1. Hacé clic en "uploading an existing file"
2. Arrastrá la carpeta completa (con subcarpetas css/, js/, img/)
3. Commit changes ✓

### Paso 3 — Activar Pages
1. Settings → Pages
2. Source: Deploy from branch → main → / (root)
3. Guardar. En 1-2 min el sitio está online.

---

## 🔒 Seguridad del panel de admin

La contraseña **NUNCA se guarda en texto plano**. El sistema usa:
- **SHA-256** (Web Crypto API nativa del navegador) para hashear la contraseña
- **Tokens de sesión** aleatorios que expiran en 4 horas
- **Bloqueo automático** tras 5 intentos fallidos (15 minutos)
- El archivo `robots.txt` bloquea el indexado de `/admin.html` y `/dashboard.html`

### Contraseña inicial
```
Escapaditas2025!
```
**⚠️ Cambiala inmediatamente** desde el panel → Configuración → Cambiar contraseña.

### Para cambiar la contraseña inicial en el código (opcional)
Si querés cambiar el hash del default antes de subir el sitio:
1. Abrí la consola del navegador (F12)
2. Ejecutá:
   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('TuNuevaPassword'))
     .then(b => console.log(Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')))
   ```
3. Copiá el resultado y reemplazá `DEFAULT_HASH` en `js/auth.js`

---

## ⚙️ Panel de administración

Accedé desde: `tu-sitio.github.io/admin.html`

### Paquetes
- Ver, editar y eliminar paquetes existentes
- Crear nuevos paquetes con todos los campos
- **Subir múltiples fotos** arrastrando archivos o pegando URLs
- La primera foto es la portada de la tarjeta

### Fotos
Tenés 3 formas de agregar fotos:
1. **Arrastrá** archivos desde tu computadora al área de upload
2. **Seleccioná** archivos con el selector
3. **Pegá URLs** de imágenes (Unsplash, Cloudinary, etc.)

Para fotos gratis y de alta calidad: [unsplash.com](https://unsplash.com)
Para subir tus propias fotos: [cloudinary.com](https://cloudinary.com) (gratis hasta 25GB)

### Configuración
- Cambiar número de WhatsApp, email, teléfono, Instagram
- Cambiar la contraseña del panel

---

## 🔍 SEO y posicionamiento en Google e IA

El sitio incluye:
- **Schema.org TravelAgency** → ChatGPT, Perplexity y Google lo usan para entender tu negocio
- **Open Graph** → Previews correctos en WhatsApp y redes sociales
- **robots.txt** → Protege el panel admin e invita a Google a indexar el sitio
- **sitemap.xml** → Le dice a Google qué páginas indexar

### Pasos para posicionarte rápido
1. **Google Search Console** → [search.google.com/search-console](https://search.google.com/search-console)
   - Registrá tu URL
   - Enviá el sitemap (tu-sitio.github.io/sitemap.xml)
2. **Ponele el link a tu web en la bio de Instagram** @hola.escapaditas
3. **Actualizá la URL** en index.html, sitemap.xml y robots.txt con tu URL real

---

## 💬 Soporte
¿Preguntas? Consultá con el asistente de IA que generó este sitio.
