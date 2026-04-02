# ⚡ Configuración Rápida con Supabase

## ✅ ¡Tu proyecto ya está configurado con Supabase!

Las credenciales ya están guardadas en el código:
- **Project URL:** `https://eizqjdhuuihczirctsse.supabase.co`
- **API Key:** Configurada en `src/firebase/config.js`

---

## 🔧 PASOS PARA TERMINAR (5 minutos)

### Paso 1: Crear la tabla en Supabase (2 min)

1. Andá a https://app.supabase.com
2. Seleccioná tu proyecto `eizqjdhuuihczirctsse`
3. En el menú izquierdo, andá a **SQL Editor**
4. Hacé clic en **"New Query"**
5. Copiá y pegá el contenido del archivo `supabase.sql`
6. Hacé clic en **"Run"** (o Ctrl+Enter)

¡Listo! Ya tenés la tabla `usuarios` creada.

---

### Paso 2: Crear el Storage Bucket para fotos (1 min)

1. En el menú izquierdo, andá a **Storage**
2. Hacé clic en **"Create bucket"**
3. Nombre: `fotos`
4. Marcá **"Public bucket"**
5. Hacé clic en **"Create bucket"**

---

### Paso 3: Configurar políticas del bucket (1 min)

1. En el bucket `fotos`, hacé clic en **"Policies"**
2. Hacé clic en **"New Policy"**
3. Seleccioná **"For full customization"**
4. Creá esta política:

```sql
-- Política para permitir que cualquiera vea las fotos
CREATE POLICY "Cualquiera puede ver fotos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'fotos');

-- Política para permitir que usuarios suban sus fotos
CREATE POLICY "Usuarios pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fotos');

-- Política para permitir que usuarios editen SUS fotos
CREATE POLICY "Usuarios pueden editar sus fotos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fotos' AND (storage.foldername(name))[1] = auth.uid()::text);
```

O simplemente:
- En la UI, creá una política que permita **SELECT** a **public**
- Y otra que permita **INSERT/UPDATE** a **authenticated**

---

### Paso 4: ¡Probar la aplicación! (1 min)

El servidor de desarrollo ya está corriendo en:
**http://localhost:5173**

1. Abrí esa URL en tu navegador
2. Hacé clic en **"Crear CV Gratis"**
3. Completá el formulario de registro
4. ¡Empezá a crear tu CV!

---

## 🎯 Verificación

Para verificar que todo funciona:

### ✅ Tabla creada
```sql
-- En SQL Editor, ejecutá:
SELECT * FROM usuarios;
```
Debería mostrar la tabla vacía (sin errores).

### ✅ Storage configurado
- En **Storage** → `fotos`, deberías ver el bucket creado.

### ✅ App funcionando
- Podés registrarte, loguearte y editar tu CV.

---

## 🔐 Crear tu cuenta de Administrador

El panel de admin (`/admin`) está restringido a emails `@tucvonline.com`.

**Opción 1:** Usá un email con ese dominio (si tenés)

**Opción 2:** Modificá `src/pages/AdminPanel.jsx`:
```javascript
// Cambiá esta línea:
if (!user.email.includes('@tucvonline.com')) {

// Por:
if (user.email !== 'tu-email@gmail.com') {
```

---

## 📊 Estructura de la Tabla

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID del usuario (de auth.users) |
| `email` | TEXT | Email único |
| `nombre` | TEXT | Nombre del usuario |
| `apellido` | TEXT | Apellido del usuario |
| `telefono` | TEXT | Teléfono de contacto |
| `ubicacion` | TEXT | Ciudad, País |
| `linkedin` | TEXT | URL de LinkedIn |
| `sitio_web` | TEXT | Portafolio/Sitio personal |
| `sobre_mi` | TEXT | Descripción libre |
| `foto_url` | TEXT | URL de la foto de perfil |
| `educacion` | JSONB | Array de estudios |
| `experiencia` | JSONB | Array de trabajos |
| `habilidades` | JSONB | Array de habilidades |
| `visitas` | INTEGER | Contador de visitas al perfil |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

---

## 🚀 Deploy a Producción (Opcional)

Cuando quieras publicar la web:

### Opción A: Vercel (Recomendado)
1. Subí el código a GitHub
2. Andá a https://vercel.com
3. Importá tu repositorio
4. ¡Listo! Deploy automático

### Opción B: Netlify
1. Subí el código a GitHub
2. Andá a https://netlify.com
3. Conectá tu repositorio
4. Comando de build: `npm run build`
5. Publish directory: `dist`

### Opción C: Supabase Hosting (Beta)
- Supabase ahora tiene hosting integrado
- Configurá en **Settings** → **Hosting**

---

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verificá que la API key en `src/firebase/config.js` sea la `anon public`

### Error: "relation usuarios does not exist"
- Ejecutá el SQL de `supabase.sql` en el SQL Editor

### Error: "Unauthorized" al subir fotos
- Verificá que el bucket `fotos` sea público
- Verificá las políticas del bucket

### Error: "User already exists"
- El email ya está registrado en Supabase Auth
- Usá otro email o borrá el usuario en Authentication → Users

---

## 📞 Recursos

- **Supabase Docs:** https://supabase.com/docs
- **SQL Editor:** https://app.supabase.com/project/YOUR_PROJECT/sql
- **Storage:** https://app.supabase.com/project/YOUR_PROJECT/storage

---

**¡Listo! Ya tenés TuCVOnline funcionando con Supabase 🎉**
