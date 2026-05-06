# Guía de Setup - ChazaRadio Frontend

## 📋 Requisitos Previos

- **Node.js**: 18.x o superior ([descargar](https://nodejs.org/))
- **npm**: Incluido con Node.js (verificar con `npm --version`)
- **Git**: Para clonar el repositorio

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

```bash
# En carpeta ChazaRadio-Front/
npm install
```

Esto instalará:
- React 19
- TypeScript
- Vite (bundler)
- React Router (enrutamiento)
- Tailwind CSS (estilos)

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` en `ChazaRadio-Front/`:

```bash
# .env.local
VITE_APP_API=http://localhost:3000
```

**Nota**: 
- En desarrollo local: `http://localhost:3000`
- En producción: URL del backend en Azure/servidor

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Salida esperada:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Abre http://localhost:5173 en tu navegador.

## 📁 Estructura de Carpetas

```
src/
├── components/
│   ├── authContext.tsx       # 🔐 Contexto de autenticación global
│   ├── login.tsx             # 📝 Página de inicio de sesión
│   ├── register.tsx          # 📝 Página de registro (si existe)
│   ├── emisora_main.tsx      # 🎙️ Página principal (player)
│   ├── lista.tsx             # 📊 Componente de lista de audios
│   ├── perfil.tsx            # 👤 Perfil del usuario + grabador
│   ├── recorder.tsx          # 🎤 Componente de grabación
│   ├── red_social.tsx        # 📱 Feed social (posts)
│   ├── social_base.tsx       # 📱 Base para posts
│
├── elements/
│   ├── button.tsx            # 🔘 Botón reutilizable
│   ├── input.tsx             # 📥 Input reutilizable
│   ├── header.tsx            # 📌 Header
│   ├── footer.tsx            # 📌 Footer
│
├── functions/
│   └── api_calls.tsx         # 📡 Cliente HTTP centralizado
│
├── routes/
│   ├── home.tsx              # 🏠 Página inicio
│   ├── emisora.tsx           # 🎙️ Emisora (reproducción)
│   ├── log_access.tsx        # 🔓 Acceso login
│   ├── reg_access.tsx        # 🔓 Acceso registro
│
├── assets/                   # 🖼️ Imágenes, iconos
├── App.tsx                   # ⚙️ Componente root
├── App.css                   # 🎨 Estilos globales
├── main.tsx                  # 🎯 Entry point
├── index.css                 # 🎨 Estilos base
└── routes.tsx                # 🗺️ Configuración de rutas
```

## 🏗️ Build para Producción

```bash
npm run build
```

Salida:
```
ChazaRadio-Front/dist/  # Carpeta para desplegar
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
```

Desplegar contenido de `dist/` en servidor HTTP (Nginx, Azure Static Web Apps, etc).

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor dev en http://localhost:5173

# Build
npm run build            # Compila para producción en dist/

# Preview
npm run preview          # Vista previa del build (antes de desplegar)

# Lint
npm run lint             # Verifica formato y errores (si está configurado)

# Type checking
npx tsc --noEmit         # Verifica tipos TypeScript sin compilar
```

## 🔧 Configuración

### Vite (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy para desarrollo (opcional):
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // }
  }
})
```

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    // ... más opciones
  }
}
```

### Tailwind (tailwind.config.js - si está configurado)
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { /* ... */ },
  plugins: [],
}
```

## 🔌 Variables de Entorno

### .env.local (local development)
```
# Backend API URL
VITE_APP_API=http://localhost:3000

# Opcional: otros
VITE_LOG_LEVEL=debug
```

### .env.production (cuando se compila)
```
VITE_APP_API=https://charada-api.azurewebsites.net
```

**Nota**: Vite solo carga variables que empiezan con `VITE_` en el frontend

## 🎯 Flujo de Desarrollo Típico

1. **Clonar/pullReaC cambios**
   ```bash
   git clone <repo>
   cd ChazaRadio-Front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear rama de feature**
   ```bash
   git checkout -b feature/mi-feature
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Hacer cambios en archivos** (se actualizan en vivo)
   ```bash
   # Abrir http://localhost:5173
   # Editar archivos en src/
   # Los cambios se reflejan automáticamente (HMR - Hot Module Replacement)
   ```

6. **Compilar y verificar antes de commit**
   ```bash
   npm run build
   npm run preview
   # Verificar que no hay errores
   ```

7. **Commit y push**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/mi-feature
   ```

## 🐛 Troubleshooting

### Error: "Can't find VITE_APP_API"
**Solución**: Crear `.env.local` con `VITE_APP_API=http://localhost:3000`

### Error: "Micrófono no disponible"
**Causas**:
- No estás en HTTPS (excepto localhost)
- El navegador no permitió acceso al micrófono
- Microáfono no conectado

**Solución**: En desarrollo local, localhost funciona. En producción, se debe usar HTTPS.

### Error: "API not responding"
**Verificar**:
- Backend está corriendo en puerto 3000
- `VITE_APP_API` apunta a la URL correcta
- No hay CORS bloqueando (backend debe tener CORS configurado)

### HMR (Hot Module Replacement) no funciona
**Solución**: Actualizar Vite
```bash
npm install --save-dev vite@latest
npm run dev
```

### Lentitud en desarrollo
**Solución**: 
```bash
npm run dev -- --host  # Si accedes desde otra máquina
```

## 📖 Documentación Adicional

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Deploy

### Azure Static Web Apps
```bash
npm run build
# Desplegar contenido de dist/ en Azure
```

### Vercel
```bash
vercel
```

### GitHub Pages
```bash
npm run build
# Desplegar dist/ a rama gh-pages
```

## 💡 Tips de Desarrollo

- **Modo debug**: Abre DevTools (F12) → Console para ver logs
- **Network**: Mira las llamadas API en Network tab → verifica CORS, headers
- **React DevTools**: Instala extensión de React DevTools en navegador
- **Error boundaries**: Envolve componentes en error boundary para capturar errores
- **Lazy loading**: Usa `React.lazy()` para code splitting

## 📞 Soporte

Reportar errores o preguntas:
- Issues en GitHub
- Discord/Slack del equipo
- Email del mantenedor

