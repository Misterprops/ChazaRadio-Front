# ChazaRadio - Documentación Completa

> Plataforma de radio social donde usuarios pueden grabar, compartir audios y conectar con otros creadores de contenido.

## 🎯 Índice de Documentación

### 📋 Inicio Rápido

**¿Acabas de llegar?** Empieza aquí:

1. **Para entender el proyecto**:
   - Lee [ARCHITECTURE.md](./ARCHITECTURE.md) — Descripción del stack, diagrama de arquitectura
   - Lee [WORKFLOWS.md](./WORKFLOWS.md) — Flujos principales con diagramas

2. **Para desarrollar Frontend**:
   - Ve a [ChazaRadio-Front/README.md](../README.md)
   - Sigue [ChazaRadio-Front/FRONTEND_SETUP.md](./FRONTEND_SETUP.md)

3. **Para desarrollar Backend**:
   - Ve a [ChazaRadio-API/README.md](../../ChazaRadio-API/README.md)
   - Sigue [ChazaRadio-API/BACKEND_SETUP.md](../../ChazaRadio-API/docs/BACKEND_SETUP.md)

4. **Para usar la API**:
   - Lee [API_DOCS.md](./API_DOCS.md) — Ejemplos con curl y JavaScript
   - Abre [openapi.yaml](./typedoc/index.html) — Especificación OpenAPI (importar en Swagger UI)
   - Consulta [ChazaRadio-API/database-schema.md](../../ChazaRadio-API/docs/database-schema.md) — Estructura BD

---

## 📁 Estructura del Proyecto

```
ChazaRadio/
│
├── 📖 DOCUMENTACIÓN (raíz)
│   ├── README.md                    ← Estás aquí
│   ├── ARCHITECTURE.md              ← Stack, diagrama, componentes
│   ├── WORKFLOWS.md                 ← Flujos con diagramas mermaid
│   ├── API_DOCS.md                  ← Ejemplos de endpoints
│   └── openapi.yaml                 ← Especificación OpenAPI 3.0
│
├── 🎨 Frontend (React + TypeScript)
│   ├── ChazaRadio-Front/
│   │   ├── README.md                ← Descripción frontend
│   │   ├── FRONTEND_SETUP.md        ← Instalación y setup
│   │   ├── src/
│   │   │   ├── components/          ← Componentes React
│   │   │   ├── functions/api_calls.tsx
│   │   │   ├── elements/            ← UI reutilizable
│   │   │   ├── routes/              ← Páginas
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── routes.tsx
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── 📍 Puertos:
│       └── http://localhost:5173 (dev server)
│
├── 🖥️ Backend (Node.js + Express)
│   ├── ChazaRadio-API/
│   │   ├── README.md                ← Descripción backend
│   │   ├── BACKEND_SETUP.md         ← Instalación y setup
│   │   ├── database-schema.md       ← Colecciones MongoDB
│   │   ├── conector.js              ← Entry point, rutas
│   │   ├── conectordb.js            ← Conexión MongoDB
│   │   ├── tokenServices.js         ← JWT
│   │   ├── user_data.js             ← Auth endpoints
│   │   ├── audio_data.js            ← Audio CRUD
│   │   ├── like_control.js          ← Sistema likes
│   │   ├── upload_post.js           ← Posts sociales
│   │   ├── poadcast_data.js         ← Podcasts
│   │   ├── mail_sender.js           ← Emails
│   │   ├── storageServices.js       ← Almacenamiento
│   │   ├── database/esquemas.js     ← Modelos Mongoose
│   │   ├── media/                   ← Audios almacenados
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── .gitignore
│   │
│   └── 📍 Puertos:
│       └── http://localhost:3000 (API REST)
│
├── 🗄️ Base de Datos (MongoDB)
│   ├── Usuarios
│   ├── Audios
│   ├── Posts
│   ├── LikeList
│   ├── Poadcasts
│   ├── Verificacion
│   └── Registros
│
└── 📝 Otros
    └── radio.liq (config Liquidsoap)
```

---

## 🚀 Guía por Rol

### 👨‍💻 Developer Frontend

**Inicio rápido**:
```bash
cd ChazaRadio-Front
npm install
echo "VITE_APP_API=http://localhost:3000" > .env.local
npm run dev
# Abre http://localhost:5173
```

**Recursos**:
- [FRONTEND_SETUP.md](./ChazaRadio-Front/FRONTEND_SETUP.md) — Instalación completa
- [ChazaRadio-Front/README.md](./ChazaRadio-Front/README.md) — Descripción componentes
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Entender flujos

**Stack**: React 19, TypeScript, Tailwind CSS, React Router, Web Audio API

---

### 👨‍💻 Developer Backend

**Inicio rápido**:
```bash
cd ChazaRadio-API
npm install
# Editar .env con credenciales
npm start
# Servidor en http://localhost:3000
```

**Recursos**:
- [BACKEND_SETUP.md](./ChazaRadio-API/BACKEND_SETUP.md) — Variables .env, MongoDB, instalación
- [ChazaRadio-API/README.md](./ChazaRadio-API/README.md) — Descripción endpoints
- [database-schema.md](./ChazaRadio-API/database-schema.md) — Colecciones, índices, queries
- [openapi.yaml](./openapi.yaml) — Especificación API

**Stack**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer

---

### 🧪 QA / Tester

**Herramientas**:
- **Postman** o **Thunder Client** para testing manual
- **Network tab** en DevTools para debugging
- **MongoDB Compass** para inspeccionar BD

**Recursos**:
- [API_DOCS.md](./API_DOCS.md) — Ejemplos de requests/responses
- [openapi.yaml](./openapi.yaml) — Importar en Postman/Swagger UI
- [WORKFLOWS.md](./WORKFLOWS.md) — Entender flujos

**Casos de prueba** (ver API_DOCS.md):
- Autenticación: registro, login, verificación
- Audios: subir, listar, dar like, eliminar
- Posts: crear, listar, eliminar
- Edge cases: token expirado, archivo muy grande, etc.

---

### 📊 DevOps / Infrastructure

**Setup**:
- MongoDB: Local o Atlas (cloud)
- Node.js: Versión 16+
- Frontend: Nginx, Azure Static Web Apps, Vercel
- Backend: Azure App Service, Heroku, VPS

**Variables de entorno**:
- Frontend: `.env.local` con `VITE_APP_API`
- Backend: `.env` con `URI`, `JWT_SECRET`, `EMAIL_*`

**Deployment** (ver BACKEND_SETUP.md):
- Frontend: `npm run build` → desplegar carpeta `dist/`
- Backend: `git push` o `npm start` en servidor

---

### 📖 Technical Writer / Documentador

**Recursos a mantener**:
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Actualizar si cambia stack
- [WORKFLOWS.md](./WORKFLOWS.md) — Agregar nuevos flujos si hay features
- [API_DOCS.md](./API_DOCS.md) — Mantener ejemplos sincronizados
- [openapi.yaml](./openapi.yaml) — Especificación authoritative

**Convenciones**:
- Documentar en español
- Incluir ejemplos de código
- Usar diagramas mermaid para flujos
- Mantener links actualizados

---

## 🔄 Flujos Principales

### 1. Autenticación

```
Registro → Email Verification (código) → Login → JWT Token → App
```

Ver [WORKFLOWS.md](./WORKFLOWS.md#1️⃣-flujo-de-autenticación) para detalles.

### 2. Carga de Audio

```
Grabación (Web Audio API) → Upload → Storage → DB → Lista para todos
```

Ver [WORKFLOWS.md](./WORKFLOWS.md#2️⃣-flujo-de-carga-de-audio) para detalles.

### 3. Reproducción & Likes

```
Fetch audios → Listar → Reproducir → Like/Unlike → Contador actualiza
```

Ver [WORKFLOWS.md](./WORKFLOWS.md#3️⃣-flujo-de-reproducción-y-likes) para detalles.

### 4. Feed Social

```
Crear post → Almacenar → Fetch paginado → Mostrar → Eliminar si dueño
```

Ver [WORKFLOWS.md](./WORKFLOWS.md#4️⃣-flujo-de-feed-social) para detalles.

---

## 🔌 API REST

**Base URL**: 
- Desarrollo: `http://localhost:3000`
- Producción: `https://charada-api.azurewebsites.net`

**Autenticación**: JWT Bearer Token (20 min expiry)

**Headers requeridos**:
- `Content-Type: application/json` (para JSON)
- `Authorization: Bearer {token}` (para endpoints protegidos)

**Ejemplos**: Ver [API_DOCS.md](./API_DOCS.md)

**Especificación completa**: [openapi.yaml](./openapi.yaml) (importar en Swagger UI)

### Endpoints Resumen

| Categoría | Método | Path | Protegido |
|-----------|--------|------|-----------|
| **Auth** | POST | `/api/login` | No |
| | POST | `/api/registro` | No |
| | POST | `/api/verificar` | No |
| | GET | `/api/verify` | Sí |
| **Audios** | POST | `/api/upload` | Sí |
| | GET | `/api/get_audios` | No |
| | DELETE | `/api/delete_audio` | Sí |
| **Likes** | POST | `/api/like_control` | Sí |
| | GET | `/api/get_likeList` | Sí |
| **Posts** | POST | `/api/upload_post` | Sí |
| | GET | `/api/get_posts` | No |
| | DELETE | `/api/delete_post` | Sí |
| **Podcasts** | POST | `/api/upload_poadcast` | Sí |
| | GET | `/api/get_poadcast` | No |

---

## 🗄️ Base de Datos

**Sistema**: MongoDB (NoSQL)

**Colecciones principales**:
- `Usuarios` — Cuentas de usuario
- `Audios` — Archivos de audio subidos
- `Posts` — Feed social
- `LikeList` — Relación usuario-audio
- `Poadcasts` — Series de podcasts

**Documentación detallada**: [database-schema.md](./ChazaRadio-API/database-schema.md)

---

## 🔐 Seguridad

### Autenticación
- ✅ JWT con expiración 20 minutos
- ✅ Renovación automática (<5 min)
- ✅ Verificación de email con código
- ✅ Contraseñas hasheadas (bcryptjs)

### Validación
- ✅ Middleware de autenticación
- ✅ Validación de input
- ✅ Verificación de ownership
- ✅ CORS configurado

### Producción
- ⚠️ Usar HTTPS obligatorio
- ⚠️ JWT_SECRET debe ser secret strong
- ⚠️ Verificar variables de entorno
- ⚠️ Habilitar rate limiting

---

## 📊 Stack Tecnológico Completo

### Frontend
- React 19
- TypeScript 5.4+
- Vite 5+
- React Router v7
- Tailwind CSS 3+
- Web Audio API (nativo)

### Backend
- Node.js 16+
- Express 5.x
- MongoDB 5+
- Mongoose 7+
- JWT
- Nodemailer
- FFmpeg
- Multer

### DevOps
- Git & GitHub
- Docker (opcional)
- Azure App Service / Heroku / VPS
- GitHub Actions (CI/CD)

---

## 🧪 Testing

### Frontend
```bash
cd ChazaRadio-Front
npm run dev      # Dev server
npm run build    # Build
npm run preview  # Previsualiza build
```

### Backend
```bash
cd ChazaRadio-API
npm start        # Servidor
# Testing manual con Postman/Thunder Client
```

### API Testing con cURL
```bash
# Listar audios
curl http://localhost:3000/api/get_audios

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"id":"user@email.com","password":"pass"}'
```

---

## 🚀 Deployment

### Frontend
```bash
npm run build
# Desplegar contenido de dist/ en Nginx / Azure Static Web Apps / Vercel
```

### Backend
```bash
# En Azure App Service / Heroku / VPS
git push <remote> main
# O: npm start
```

Ver secciones de deployment en [BACKEND_SETUP.md](./ChazaRadio-API/BACKEND_SETUP.md) y [FRONTEND_SETUP.md](./ChazaRadio-Front/FRONTEND_SETUP.md)

---

## 🐛 Troubleshooting

### Problema Común: "Cannot find module 'express'"
**Solución**: 
```bash
cd ChazaRadio-API
npm install
```

### Problema Común: "VITE_APP_API is not defined"
**Solución**:
```bash
cd ChazaRadio-Front
echo "VITE_APP_API=http://localhost:3000" > .env.local
npm run dev
```

### Problema Común: "MongoDB connection failed"
**Solución**:
```bash
# Verificar MongoDB está corriendo
mongod
# O usar MongoDB Atlas (cloud)
```

Ver más en [BACKEND_SETUP.md](./ChazaRadio-API/BACKEND_SETUP.md#-troubleshooting)

---

## 📚 Recursos Externos

- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

---

## 🤝 Contribuciones

### Cómo reportar bugs
1. Ve a GitHub Issues
2. Describe el problema
3. Incluye pasos para reproducir
4. Adjunta logs si es posible

### Cómo proponer features
1. Abre un issue
2. Describe la feature
3. Explica el caso de uso
4. Espera feedback

### Cómo hacer un PR
1. Fork el repositorio
2. Crea rama: `git checkout -b feature/mi-feature`
3. Commit cambios: `git commit -am 'Add mi-feature'`
4. Push a rama: `git push origin feature/mi-feature`
5. Abre Pull Request

---

## 📋 Checklist de Setup Inicial

**Backend**:
- [ ] Clonar repositorio
- [ ] `npm install` en ChazaRadio-API/
- [ ] Crear `.env` con variables
- [ ] Iniciar MongoDB
- [ ] `npm start`
- [ ] Verificar `http://localhost:3000`

**Frontend**:
- [ ] `npm install` en ChazaRadio-Front/
- [ ] Crear `.env.local` con `VITE_APP_API`
- [ ] `npm run dev`
- [ ] Abrir `http://localhost:5173`

**Testing**:
- [ ] Abrir DevTools (F12)
- [ ] Hacer login
- [ ] Subir audio
- [ ] Dar like
- [ ] Crear post

---

## 📞 Contacto

- **Bugs**: GitHub Issues
- **Email**: team@charada.com
- **Discord**: [link]
- **Documentación**: Ver [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📄 Licencia

MIT License - Abierto para uso y modificación

---

## 🎉 Bienvenido a ChazaRadio

¡Gracias por contribuir! Si tienes dudas:
1. Busca en la documentación
2. Abre un issue en GitHub
3. Contacta al equipo

**Última actualización**: Abril 2026  
**Versión**: 1.0.0

