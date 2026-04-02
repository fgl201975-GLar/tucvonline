# 🚀 TuCVOnline - Portal de Currículums Online

Plataforma moderna para crear y gestionar currículums vitae online con panel de administración.

**Backend:** Supabase (PostgreSQL, Auth, Storage) - **Sin tarjeta de crédito requerida**

---

## 🎯 Características

- ✅ **Landing Page** atractiva y responsive
- ✅ **Registro/Login** con email y contraseña
- ✅ **Editor de CV** multi-paso intuitivo
- ✅ **Perfiles públicos** compartibles
- ✅ **Panel de Administración** con búsqueda y filtros
- ✅ **Subida de fotos** de perfil
- ✅ **Diseño moderno** con TailwindCSS
- ✅ **100% Gratis** - Sin necesidad de tarjeta de crédito

---

## 📋 Requisitos

1. Node.js instalado (v16 o superior)
2. Cuenta de Supabase (gratis en https://supabase.com)

---

## 🔧 Instalación y Configuración

### Paso 1: Instalar dependencias

```bash
cd TuCVOnline
npm install
```

### Paso 2: Configurar Supabase

**Las credenciales YA ESTÁN configuradas** para el proyecto:
- **Project URL:** `https://eizqjdhuuihczirctsse.supabase.co`

Solo faltan 3 pasos rápidos:

#### 2.1 Crear la tabla de usuarios

1. Andá a https://app.supabase.com
2. Seleccioná tu proyecto
3. Andá a **SQL Editor** → **New Query**
4. Copiá y pegá el contenido de `supabase.sql`
5. Ejecutá el script

#### 2.2 Crear bucket para fotos

1. Andá a **Storage**
2. Creá un bucket llamado: `fotos`
3. Marcá **"Public bucket"**

#### 2.3 Configurar políticas del bucket

En el bucket `fotos`, creá políticas para:
- **SELECT:** Público (cualquiera puede ver fotos)
- **INSERT/UPDATE:** Usuarios autenticados

**Ver instrucciones completas en:** `SUPABASE_CONFIG.md`

---

### Paso 3: Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
TuCVOnline/
├── src/
│   ├── firebase/
│   │   └── config.js       # Configuración de Supabase
│   ├── pages/
│   │   ├── Landing.jsx     # Página principal
│   │   ├── Login.jsx       # Login
│   │   ├── Register.jsx    # Registro
│   │   ├── Dashboard.jsx   # Panel de usuario
│   │   ├── ProfileEditor.jsx # Editor de CV
│   │   ├── AdminPanel.jsx  # Panel de admin
│   │   └── PublicProfile.jsx # Perfil público
│   ├── App.jsx             # Rutas de la app
│   ├── main.jsx            # Entry point
│   └── index.css           # Estilos Tailwind
├── supabase.sql            # Script para crear tablas
├── SUPABASE_CONFIG.md      # Guía completa de Supabase
├── MARKETING.md            # Estrategia de marketing
└── package.json
```

---

## 🎨 Páginas de la Aplicación

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Landing** | `/` | Página principal informativa |
| **Login** | `/login` | Inicio de sesión |
| **Registro** | `/register` | Crear nueva cuenta |
| **Dashboard** | `/dashboard` | Panel de usuario |
| **Editor CV** | `/profile/edit` | Formulario multi-paso para crear CV |
| **Perfil Público** | `/profile/:userId` | CV visible públicamente |
| **Admin Panel** | `/admin` | Panel de administración (restringido) |

---

## 🔐 Panel de Administración

Para acceder al panel de admin, tu email debe terminar en `@tucvonline.com`.

**Características del Admin:**
- 📊 Estadísticas generales de usuarios
- 🔍 Búsqueda por nombre, email, habilidades
- 👥 Lista completa de CVs registrados
- ✅ Estado de cada CV (completo/incompleto)
- 🔗 Acceso directo a perfiles públicos
- 📧 Contacto directo con usuarios

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| **React 19** | Framework UI |
| **Vite** | Build tool |
| **TailwindCSS 3** | Estilos modernos |
| **Supabase** | Backend completo |
| └─ Auth | Autenticación |
| └─ PostgreSQL | Base de datos |
| └─ Storage | Archivos/fotos |
| **React Router v7** | Navegación |

---

## 📊 Base de Datos

### Tabla: `usuarios`

```sql
usuarios (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  nombre TEXT,
  apellido TEXT,
  telefono TEXT,
  ubicacion TEXT,
  linkedin TEXT,
  sitio_web TEXT,
  sobre_mi TEXT,
  foto_url TEXT,
  educacion JSONB,
  experiencia JSONB,
  habilidades JSONB,
  visitas INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

Los campos `educacion`, `experiencia` y `habilidades` son JSONB para flexibilidad.

---

## 🚀 Deploy a Producción

### Opción A: Vercel (Recomendado)

1. Subí el código a GitHub
2. Andá a https://vercel.com
3. Importá tu repositorio
4. ¡Listo!

### Opción B: Netlify

1. Subí el código a GitHub
2. Andá a https://netlify.com
3. Conectá tu repositorio
4. Build command: `npm run build`
5. Publish directory: `dist`

### Build local

```bash
npm run build
# Los archivos estáticos estarán en /dist
```

---

## 📈 Marketing y Crecimiento

Leé el archivo `MARKETING.md` para una estrategia completa que incluye:

- ✅ SEO y posicionamiento en Google
- ✅ Estrategia en redes sociales
- ✅ Partnerships con universidades y empresas
- ✅ Programa de referidos
- ✅ Presupuesto estimado

---

## 🆘 Solución de Problemas

### Error: "Invalid API key"
- Verificá que estás usando la clave `anon public` de Supabase

### Error: "relation usuarios does not exist"
- Ejecutá el script `supabase.sql` en el SQL Editor de Supabase

### Error: "Unauthorized" al subir fotos
- Verificá que el bucket `fotos` sea público
- Verificá las políticas de seguridad del bucket

### Error: "User already exists"
- El email ya está registrado
- Usá otro email o eliminá el usuario en Authentication → Users

---

## 📚 Documentación Adicional

| Archivo | Descripción |
|---------|-------------|
| `SUPABASE_CONFIG.md` | Guía paso a paso de Supabase |
| `MARKETING.md` | Estrategia de marketing completa |
| `PROYECTO_LISTO.md` | Resumen del proyecto |
| `supabase.sql` | Script de base de datos |

---

## 💡 Próximos Pasos

### Fase 2 (Próximamente)
- [ ] CVs en PDF descargable
- [ ] Plantillas personalizables
- [ ] Sistema de valoraciones
- [ ] Ofertas de empleo
- [ ] Notificaciones por email

### Fase 3 (Futuro)
- [ ] App móvil
- [ ] IA para mejorar CVs
- [ ] Video CVs
- [ ] Integración con LinkedIn

---

## 🎉 ¡Listo!

Tu plataforma de currículums está lista para usar.

**Seguí los pasos en `SUPABASE_CONFIG.md` para terminar la configuración en 5 minutos.**

---

**Hecho con ❤️ para Uruguay**

*Sin necesidad de tarjeta de crédito - 100% Gratis*
