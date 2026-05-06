# ChazaRadio Frontend

Cliente React/TypeScript para la plataforma de radio social ChazaRadio.

## 🎯 Descripción

Aplicación web de una sola página (SPA) que permite a los usuarios:
- 🔐 **Autenticación**: Registro con verificación de email, login seguro con JWT
- 🎙️ **Grabar Audios**: Capturar audio del micrófono usando Web Audio API
- ▶️ **Reproducir**: Escuchar audios con sistema de likes en tiempo real
- 📱 **Red Social**: Crear posts, ver feed con paginación
- 🎙️ **Podcasts**: Acceder a series de podcasts

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| React | 19 | Framework UI |
| TypeScript | 5.4+ | Tipado estático |
| Vite | 5+ | Bundler y dev server |
| React Router | v7 | Enrutamiento SPA |
| Tailwind CSS | 3+ | Estilos |
| Web Audio API | Nativa | Grabación de audio |

## 📦 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local
echo "VITE_APP_API=http://localhost:3000" > .env.local

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Abrir navegador
# http://localhost:5173
```

**Requisitos**: Node.js 18+ y npm

## 📖 Documentación

- [FRONTEND_SETUP.md](./docs/FRONTEND_SETUP.md) — Instalación detallada y troubleshooting
- [../ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Arquitectura general del proyecto
- [../API_DOCS.md](./docs/API_DOCS.md) — Documentación de API REST

## 📁 Estructura Principal

```
src/
├── components/          # Componentes React funcionales
│   ├── authContext.tsx  # 🔐 Contexto de autenticación global
│   ├── login.tsx        # Página de login
│   ├── emisora_main.tsx # Página principal (player)
│   ├── perfil.tsx       # Perfil + grabador de audio
│   ├── red_social.tsx   # Feed social
│   └── recorder.tsx     # Componente grabadora Web Audio API
│
├── elements/            # Componentes UI reutilizables
│   ├── button.tsx
│   ├── input.tsx
│   ├── header.tsx
│   └── footer.tsx
│
├── functions/
│   └── api_calls.tsx    # 📡 Cliente HTTP centralizado
│
├── routes/              # Páginas principales
├── App.tsx              # Componente raíz
├── main.tsx             # Entry point
└── routes.tsx           # Configuración de router
```

## 🚀 Scripts Disponibles

```bash
npm run dev       # Inicia servidor development (http://localhost:5173)
npm run build     # Build para producción
npm run preview   # Previsualiza build
npm run lint      # Verifica código (si configurado)
```

## 🔒 Seguridad

- **JWT**: Almacenado en localStorage, incluye expiración de 20 minutos
- **Auto-renovación**: Token se renueva automáticamente si faltan <5 min
- **Headers**: CORS configurado en backend
- **HTTPS**: Requerido en producción (Web Audio API no funciona en HTTP)

## 🔌 Integración Backend

Todas las llamadas API van a través de `src/functions/api_calls.tsx`:

```typescript
// Ejemplo: Subir audio
const res = await api_uploadSounds(formData, token);
if (res.ok) {
  const data = await res.json();
  console.log('Audio subido:', data.audioId);
}
```

**URL Base**: Configurada en `.env.local` → `VITE_APP_API`

## 🌐 Enrutamiento

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Home - Reproductor principal | No |
| `/login` | Página de inicio de sesión | No |
| `/registro` | Página de registro | No |
| `/emisora` | Emisora (reproductor) | No |
| `/perfil` | Perfil del usuario | Sí |

## 🎙️ Características Principales

### Autenticación
- Registro con verificación de email (código 6 dígitos)
- Login seguro con JWT
- Renovación automática de token
- Logout limpio

### Grabación de Audio
- Web Audio API nativa del navegador
- Captura desde micrófono del usuario
- Previsualización de audio local
- Upload a servidor con metadata

### Reproducción
- Player HTML5 integrado
- Sistema de likes con contador
- Lista paginada de audios
- Caché local (180s en backend)

### Red Social
- Crear posts con texto y links
- Feed paginado
- Eliminar posts (solo si eres dueño)
- Ordenado por fecha

## 🔄 Estado Global (AuthContext)

El contexto de autenticación centralizado expone:

```typescript
const { user, token, logToken, logout, loading, reloadToken, checkAuth } = useAuth();
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `user` | `User\|null` | Datos del usuario autenticado |
| `token` | `string\|null` | JWT actual |
| `logToken()` | Function | Guarda un JWT nuevo |
| `logout()` | Function | Cierra sesión |
| `loading` | boolean | Indicador de carga inicial |
| `reloadToken()` | Function | Renueva token si expira pronto |
| `checkAuth()` | Function | Valida sesión al iniciar app |

## 🎨 Estilos

Se utiliza **Tailwind CSS** utility-first:
- Clases directas en JSX (ej: `className="bg-blue-50 text-white"`)
- Configuración en `tailwind.config.js` (si existe)
- Estilos globales en `index.css` y `App.css`

## 🧪 Testing (Futuro)

Recomendaciones para tests:
- **Componentes**: Vitest + React Testing Library
- **E2E**: Playwright o Cypress
- **API Mocking**: MSW (Mock Service Worker)

## 📱 Responsive

La app está diseñada para:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

Usa Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## 🔧 Troubleshooting

| Problema | Solución |
|----------|----------|
| "VITE_APP_API no definida" | Crear `.env.local` con `VITE_APP_API=...` |
| "Micrófono no disponible" | Debe ser localhost o HTTPS en producción |
| "API no responde" | Verificar que backend corre en puerto 3000 |
| "CORS error" | Backend debe tener CORS configurado |

Ver [FRONTEND_SETUP.md](./docs/FRONTEND_SETUP.md) para más detalles.

## 📞 Contacto y Contribuciones

- **Issues**: Reportar en GitHub
- **Pull Requests**: Enviar cambios vía PR
- **Documentación**: Mantener actualizada en ARCHITECTURE.md y WORKFLOWS.md

## 📄 Licencia

[Especificar licencia si existe]

---

**Creado por**: ChazaRadio Team  
**Última actualización**: Abril 2026
