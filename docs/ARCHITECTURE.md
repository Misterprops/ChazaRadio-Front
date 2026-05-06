# Arquitectura de ChazaRadio

## 📻 Descripción General

**ChazaRadio** es una plataforma de radio social para compartir y descubrir contenido de audio. Los usuarios pueden:
- 🎙️ Grabar y subir audios directamente desde el navegador
- ▶️ Reproducir audios de otros usuarios con sistema de likes
- 📱 Interactuar en un feed social (posts con links)
- 🎙️ Crear y gestionar series de podcasts
- 🔐 Autenticarse con verificación por email

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Frontend)                        │
│                    React 19 + TypeScript                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Login    │  │ Emisora  │  │ Perfil   │  │ Red      │         │
│  │ Register │  │ (Player) │  │(Recorder)│  │ Social   │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│         │              │              │           │              │
│         └──────────────┴──────────────┴───────────┘              │
│                   AuthContext (JWT)                              │
│                   api_calls.tsx (HTTP)                           │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    HTTP/REST API (Port 3000)
                             │
┌────────────────────────────┴─────────────────────────────────────┐
│                     SERVIDOR (Backend)                           │
│                    Node.js + Express                             │
│  ┌────────────────────────────────────────────────────┐         │
│  │            conector.js (Router + Middleware)       │         │
│  │  • Autenticación (JWT Bearer Token)                │         │
│  │  • Manejo de uploads (multer)                      │         │
│  │  • CORS y manejo de errores                        │         │
│  └────────────────────────────────────────────────────┘         │
│         │         │         │         │         │                │
│    ┌────┴──┐ ┌───┴──┐ ┌────┴──┐ ┌───┴──┐ ┌────┴──┐            │
│    │User   │ │Audio │ │Like   │ │Posts │ │Podcast│            │
│    │Data   │ │Data  │ │Control│ │      │ │Data   │            │
│    └───┬───┘ └───┬──┘ └───┬───┘ └──┬───┘ └───┬───┘            │
│        │         │        │       │         │                   │
│    ┌───┴─────────┴────────┴───────┴─────────┴───┐              │
│    │   Servicios Compartidos                     │              │
│    │ • tokenServices (JWT gen/validation)        │              │
│    │ • storageServices (Local / Azure Blob)      │              │
│    │ • mail_sender (Nodemailer - Verificación)  │              │
│    │ • cacheServices (LRU cache 180s TTL)       │              │
│    └───┬─────────────────────────────────────────┘              │
│        │                                                         │
│    ┌───┴──────────────────────────────────────┐                │
│    │     MongoDB (Mongoose ORM)                │                │
│    │  ┌────────────────────────────────────┐  │                │
│    │  │ Colecciones:                       │  │                │
│    │  │ • Usuarios (auth + perfil)         │  │                │
│    │  │ • Audios (tracks + likes_count)    │  │                │
│    │  │ • Posts (feed social)              │  │                │
│    │  │ • LikeList (relación user-audio)   │  │                │
│    │  │ • Poadcasts (series de podcasts)   │  │                │
│    │  │ • Verificacion (email codes)       │  │                │
│    │  │ • Registros (queue sin verificar)  │  │                │
│    │  └────────────────────────────────────┘  │                │
│    └────────────────────────────────────────────┘               │
│                                                                   │
│    ┌────────────────────────────────────────┐                   │
│    │   Almacenamiento Externo                │                   │
│    │  • /media (Local - archivos de audio)   │                   │
│    │  • Azure Blob Storage (opcional)        │                   │
│    └────────────────────────────────────────┘                   │
│                                                                   │
│    ┌────────────────────────────────────────┐                   │
│    │   Servicios Externos                    │                   │
│    │  • Gmail SMTP (Nodemailer)              │                   │
│    │  • FFmpeg (procesamiento audio)         │                   │
│    └────────────────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **React** | 19 | Framework UI |
| **TypeScript** | ^5.4 | Tipado estático |
| **Vite** | ^5.0 | Bundler y dev server |
| **React Router** | v7 | Enrutamiento SPA |
| **Tailwind CSS** | ^3 | Estilos utility-first |
| **Web Audio API** | Nativa | Grabación de audio en navegador |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Node.js** | 16+ | Runtime JavaScript |
| **Express** | ^4.x | Framework HTTP |
| **MongoDB** | 5+ | Base de datos NoSQL |
| **Mongoose** | ^7.x | ORM para MongoDB |
| **JWT** | ^9.x | Autenticación sin sesión |
| **multer** | ^1.x | Manejo de uploads |
| **Nodemailer** | ^6.x | Envío de emails |
| **FFmpeg** | (binario) | Procesamiento audio |

### Almacenamiento
- **Local**: Carpeta `/media` en servidor
- **Cloud**: Azure Blob Storage (configurable)

---

## 🔄 Flujos Principales

### 1️⃣ Autenticación

```
Usuario → Formulario → Backend (verify email) → JWT (20min expiry) → localStorage
                                              ↓
                                    AuthContext (auto-renew <5min)
```

**Endpoints**:
- `POST /api/registro` - Crear usuario + enviar código
- `POST /api/verificar` - Validar código de email
- `POST /api/login` - Obtener JWT
- `GET /api/retoken` - Renovar token (protected)

---

### 2️⃣ Reproducción de Audio

```
Usuario abre app → Fetch /api/get_audios (cached 180s) → Lista componente
                                                              ↓
                                                    Usuario selecciona
                                                              ↓
                                                    Reproduce (HTML5 <audio>)
                                                              ↓
                                                    Click Like → /api/like_control
                                                              ↓
                                                    Update contador
```

**Endpoints**:
- `GET /api/get_audios?limit=X&skip=Y` - Lista con paginación
- `POST /api/like_control` - Agregar/quitar like (protected)
- `GET /api/get_likeList` - Ver mis likes

---

### 3️⃣ Carga de Audio

```
Usuario en perfil → Recordar (Web Audio API) → FormData (blob + metadata)
                                                    ↓
                                            POST /api/upload (protected)
                                                    ↓
                                            Backend: multer capture
                                                    ↓
                                            FFmpeg: process audio (opcional)
                                                    ↓
                                            storageServices: save to /media or Azure
                                                    ↓
                                            Mongoose: insert en colección Audios
                                                    ↓
                                            Response: audio URL + metadata
```

**Endpoints**:
- `POST /api/upload` - Subir audio (protected)
- `DELETE /api/delete_audio/:id` - Eliminar (protected, solo dueño)

---

### 4️⃣ Feed Social

```
Usuarios → CREATE → POST /api/upload_post (mensaje + link) (protected)
                                 ↓
                        Mongoose insert Posts
                                 ↓
Usuarios → READ → GET /api/get_posts?page=X (cached 60s)
                                 ↓
                        Mostrar en componente red_social
                                 ↓
Dueño → DELETE → /api/delete_post/:id (protected)
```

**Endpoints**:
- `POST /api/upload_post` - Crear post (protected)
- `GET /api/get_posts?page=1` - Listar posts paginados
- `DELETE /api/delete_post/:id` - Eliminar post (protected)

---

### 5️⃣ Podcasts

```
Usuario → Crear serie → POST /api/upload_poadcast
(titulo, descripcion, episodios)
                                 ↓
                   Backend: Validar creador
                                 ↓
                   MongoDB: upsert documento
                                 ↓
Usuarios → GET /api/get_poadcast - Listar todas
```

**Endpoints**:
- `POST /api/upload_poadcast` - Crear/actualizar podcast (protected)
- `GET /api/get_poadcast` - Listar podcasts

---

## 🔐 Seguridad

### Autenticación
- **Método**: JWT Bearer Token (RFC 7519)
- **Expiración**: 20 minutos
- **Renovación**: Automática si <5 min restante
- **Almacenamiento**: localStorage (cliente)
- **Header**: `Authorization: Bearer <token>`

### Autorización
- **Recursos públicos**: Listar audios, posts, podcasts
- **Recursos protegidos**: Subir audio, crear posts, dar likes
- **Validación**: Middleware en servidor verifica JWT + ownership

### Encriptación
- **Contraseñas**: Guardadas en MongoDB (Mongoose maneja hash básico)
- **Emails**: Verificación vía código temporal (6 dígitos)
- **Transportes**: HTTPS en producción

---

## 📦 Estructura de Carpetas

```
ChazaRadio/
├── ChazaRadio-Front/           # React app
│   ├── src/
│   │   ├── components/         # Componentes funcionales (React)
│   │   ├── elements/           # UI reutilizables (botones, inputs)
│   │   ├── functions/          # api_calls.tsx (cliente HTTP)
│   │   ├── routes/             # Páginas (Login, Emisora, etc)
│   │   ├── assets/             # Imágenes, iconos
│   │   ├── App.tsx             # Root component
│   │   ├── main.tsx            # Entry point
│   │   └── routes.tsx          # Configuración router
│   ├── package.json
│   └── vite.config.ts
│
├── ChazaRadio-API/             # Node.js backend
│   ├── conector.js             # Express app + rutas
│   ├── tokenServices.js        # JWT
│   ├── user_data.js            # Auth endpoints
│   ├── audio_data.js           # Audio CRUD
│   ├── like_control.js         # Sistema likes
│   ├── upload_post.js          # Posts sociales
│   ├── poadcast_data.js        # Podcasts
│   ├── storageServices.js      # File storage abstraction
│   ├── mail_sender.js          # Email verification
│   ├── cacheServices.js        # LRU cache
│   ├── database/
│   │   └── esquemas.js         # Mongoose models
│   ├── media/                  # Carpeta audios (local)
│   ├── package.json
│   └── .env                    # Variables entorno
│
├── ARCHITECTURE.md             # Este archivo
├── WORKFLOWS.md                # Diagramas flujos
├── README.md                   # Índice general
└── radio.liq                   # Config Liquidsoap (radio streaming)
```

---

## 🔄 Ciclo de Vida de una Solicitud

### Ejemplo: Usuario sube un audio

```
CLIENTE (Frontend)
  └─ User clicks "Grabar" → recorder.tsx
     └─ Web Audio API records audio → blob
        └─ User clicks "Subir" → perfil.tsx
           └─ FormData con audio + metadata
              └─ POST /api/upload con JWT header
                 └─ HTTP request enviado
                    │
                    ▼
SERVIDOR (Backend)
  ├─ conector.js recibe POST /api/upload
  ├─ Middleware: valida JWT
  ├─ Middleware: multer captura archivo
  ├─ upload.js ejecuta lógica:
  │  ├─ FFmpeg: procesa audio si es necesario
  │  ├─ storageServices: guarda en /media o Azure
  │  └─ Mongoose: inserta en colección Audios
  ├─ Responde: { success: true, audioId, url }
  │
  └─ MongoDB guarda: { _id, titulo, url, autor, likes_count: 0, ... }
     
CLIENTE recibe respuesta
  └─ Actualiza estado
     └─ Muestra "Audio subido ✓"
        └─ Lista se refresca
           └─ Nuevo audio visible para todos
```

---

## 🚀 Flujo de Inicialización

```
1. Usuario abre app → index.html (carga React)
2. main.tsx renderiza AuthProvider (contexto JWT)
3. App.tsx carga router + layouts
4. authContext verifica localStorage:
   ├─ Token válido → Home
   ├─ Token expirado → Intenta retoken
   └─ Sin token → Login
5. Página se monta → componentes hacen API calls
6. Datos se cachean (LRU 180s en backend)
7. Interfaz interactiva
```

---

## 🔗 Dependencias Entre Componentes

```
AuthContext
  ├─ Login, Register → user_data.js
  ├─ Token storage → localStorage
  └─ Auto-renew → tokenServices.js

Emisora (Player)
  ├─ Lista componente
  ├─ Obtiene audios → audio_data.js
  ├─ Like button → like_control.js
  └─ Cache invalidation

Perfil
  ├─ Recorder → Web Audio API
  ├─ Upload → upload.js
  └─ Delete own audio → audio_data.js

Red Social
  ├─ Listar posts → upload_post.js
  ├─ Crear post → upload_post.js
  └─ Paginación → backend cache

API Calls (api_calls.tsx)
  ├─ Base URL: VITE_APP_API
  ├─ Headers: Authorization JWT
  └─ Todas las funciones se funnelen aquí
```

---

## 📊 Caché y Performance

- **Frontend**: Inmediato (React state)
- **Backend LRU**: 180 segundos TTL para `/api/get_audios`, `/api/get_posts`
- **DB Indexes**: Recomendado en usuarios.email, audios.autor, posts.fecha
- **Gzip**: Habilitado en responses Express

---

## 🔍 Observabilidad

### Logs del Backend
- Requests HTTP (Express middleware)
- Errores de autenticación (tokenServices)
- Upload/download eventos
- DB errors (Mongoose)

### Monitoreo del Frontend
- Errores de red → console.error en api_calls.tsx
- Estado de autenticación → contexto
- Cache hits/misses → (no implementado, pero visible en Network tab)

---

## 🎯 Próximos Pasos

Ver **WORKFLOWS.md** para diagramas detallados de cada flujo principal.  
Ver **BACKEND_SETUP.md** para configuración y variables .env.  
Ver **FRONTEND_SETUP.md** para instalación y desarrollo.  

