# 🚀 Guía de Configuración de TuCVOnline

## Paso 1: Configurar Firebase Console

### 1.1 Crear proyecto en Firebase
1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombre: `TuCVOnline` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### 1.2 Habilitar Authentication
1. En el menú lateral, ve a **Compilación** → **Authentication**
2. Haz clic en "Comenzar"
3. Ve a la pestaña **Sign-in method**
4. Haz clic en **Correo electrónico/contraseña**
5. Activa la primera opción: "Correo electrónico y contraseña"
6. Haz clic en "Guardar"

### 1.3 Crear base de datos Firestore
1. En el menú lateral, ve a **Compilación** → **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona **Comenzar en modo de prueba** (luego configuraremos las reglas)
4. Elige una ubicación: **us-central** (o la más cercana)
5. Haz clic en "Habilitar"

### 1.4 Configurar Firebase Storage
1. En el menú lateral, ve a **Compilación** → **Storage**
2. Haz clic en "Comenzar"
3. Selecciona **Comenzar en modo de prueba**
4. Elige la misma ubicación que Firestore
5. Haz clic en "Listo"

### 1.5 Obtener configuración de Firebase
1. Haz clic en el ícono de engranaje (Configuración del proyecto)
2. Baja hasta la sección "Tus apps"
3. Haz clic en el ícono **Web** (</>)
4. Registra la app con el nombre "TuCVOnline Web"
5. Copia el `firebaseConfig` que aparece

## Paso 2: Configurar el Proyecto Local

### 2.1 Crear archivo .env
En la carpeta `TuCVOnline`, crea un archivo llamado `.env`:

```bash
cd TuCVOnline
copy .env.example .env
```

### 2.2 Pegar configuración en .env
Abre el archivo `.env` y pega tus datos:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=tucvonline-XXXXX.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tucvonline-XXXXX
VITE_FIREBASE_STORAGE_BUCKET=tucvonline-XXXXX.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 2.3 Instalar dependencias
```bash
npm install
```

### 2.4 Probar el proyecto
```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Paso 3: Desplegar Reglas de Seguridad

### 3.1 Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

### 3.2 Iniciar sesión en Firebase
```bash
firebase login
```

### 3.3 Inicializar Firebase en el proyecto
```bash
firebase init
```

Selecciona:
- **Firestore**
- **Hosting**
- **Storage**

Configuración:
- Firestore: Usa `firestore.rules` existente
- Hosting: `dist` como directorio público
- Storage: Usa `storage.rules` existente

### 3.4 Desplegar reglas
```bash
firebase deploy --only firestore:rules,storage:rules
```

## Paso 4: Crear tu cuenta de Administrador

### 4.1 Registrarse en la aplicación
1. Con la app corriendo (`npm run dev`)
2. Ve a http://localhost:5173
3. Haz clic en "Crear CV Gratis"
4. Regístrate con tu email (ej: tuemail@tucvonline.com)

### 4.2 Acceder al panel de admin
El panel de admin está accesible si tu email termina en `@tucvonline.com`.

Para cambiar esto, edita `src/App.jsx`:
```javascript
if (requireAdmin && !user.email.includes('@tucvonline.com')) {
```

Cambia el dominio o la lógica según necesites.

## Paso 5: Deploy a Producción

### 5.1 Construir el proyecto
```bash
npm run build
```

### 5.2 Desplegar a Firebase Hosting
```bash
firebase deploy --only hosting
```

Te dará una URL como: `https://tucvonline-XXXXX.web.app`

## ✅ ¡Listo!

Tu aplicación está funcionando. Ahora puedes:

1. **Registrarte** y crear tu perfil
2. **Completar tu CV** con foto, experiencia, educación
3. **Compartir tu perfil** con el link público
4. **Acceder al panel de admin** para ver todos los CVs

## 🔧 Solución de Problemas

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Ve a Firebase Console → Authentication → Settings
- Agrega tu dominio a "Dominios autorizados"

### Error: "Missing or insufficient permissions"
- Despliega las reglas: `firebase deploy --only firestore:rules`

### Error: "Network Error" al subir fotos
- Verifica que Storage esté habilitado
- Despliega las reglas de Storage

## 📞 Soporte

Si tienes problemas, revisa:
- La consola del navegador (F12)
- La consola de Firebase Console
- El README.md para más detalles
