# Hola Escapaditas — versión con Supabase

Esta versión ya no usa `localStorage` como base real. Ahora:
- el público lee paquetes desde Supabase
- el admin entra con email + contraseña de Supabase Auth
- los cambios quedan persistidos y visibles para todos
- no hay contraseñas hardcodeadas en GitHub

## Estructura

- `index.html` → home pública
- `paquete.html` → detalle de paquete
- `admin.html` → login admin
- `dashboard.html` → panel de gestión
- `css/style.css` → estilos
- `js/supabase-config.js` → pegás URL y anon key
- `js/supabase-client.js` → inicializa Supabase
- `js/common.js` → utilidades compartidas
- `js/app.js` → home pública
- `js/detalle.js` → detalle de paquete
- `js/auth.js` → login
- `js/dashboard.js` → CRUD admin
- `sql/schema.sql` → tablas, RLS y datos iniciales

## Cómo dejarlo operativo

### 1. Crear proyecto en Supabase
- Creá un proyecto nuevo
- Andá a **SQL Editor**
- Ejecutá completo `sql/schema.sql`

### 2. Crear usuario admin
- En Supabase: **Authentication > Users > Add user**
- Creá el email y contraseña del admin

### 3. Copiar credenciales públicas
- En **Project Settings > API**
- Copiá:
  - Project URL
  - anon public key

### 4. Completar configuración del front
Editá `js/supabase-config.js` y pegá:

```js
window.SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
window.SUPABASE_ANON_KEY = 'TU_ANON_KEY';
```

### 5. Subir a GitHub Pages o Netlify
Subí todo el contenido de esta carpeta.

## Observaciones importantes

- Esta versión usa **URLs de imágenes**, no subida de archivos a storage.
- Es deliberado: te deja operativo más rápido y con menos puntos de falla.
- Si después querés, se puede migrar a **Supabase Storage** o **Cloudinary**.

## Qué evita esta arquitectura

- que el sitio dependa de un navegador específico
- que se pierdan paquetes al limpiar caché
- que GitHub te marque una contraseña en el repo
- que el panel funcione como maqueta en vez de sistema real

## Qué no hace todavía

- recuperación de contraseña custom
- roles granulares tipo editor/superadmin
- subida directa de archivos al storage

Eso se puede agregar después. Primero conviene que el core funcione.
