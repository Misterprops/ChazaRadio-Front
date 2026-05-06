# Guía de Uso de API ChazaRadio

Ejemplos prácticos para usar la API REST de ChazaRadio con `curl`, JavaScript/Fetch y Postman.

## 📍 Base URL

```
Desarrollo:  http://localhost:3000
Producción:  https://charada-api.azurewebsites.net
```

**Headers requeridos**:
```
Content-Type: application/json
Authorization: Bearer {token}  # Para endpoints protegidos
```

---

## 🔐 AUTENTICACIÓN

### 1. Registrar Usuario

Crea una nueva cuenta y envía código de verificación por email.

**Endpoint**: `POST /api/registro`

#### cURL
```bash
curl -X POST http://localhost:3000/api/registro \
  -H "Content-Type: application/json" \
  -d '{
    "user": "juanperez",
    "password": "MiPassword123!",
    "email": "juan@example.com",
    "id": "juan@example.com"
  }'
```

#### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3000/api/registro', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: 'juanperez',
    password: 'MiPassword123!',
    email: 'juan@example.com',
    id: 'juan@example.com'
  })
});

const data = await response.json();
console.log(data);
// { success: true, mensaje: "Registrado! Verifica tu email" }
```

#### Postman
1. **Method**: POST
2. **URL**: `{{base_url}}/api/registro`
3. **Body** (JSON):
```json
{
  "user": "juanperez",
  "password": "MiPassword123!",
  "email": "juan@example.com",
  "id": "juan@example.com"
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "mensaje": "Registrado! Verifica tu email"
}
```

**Error** (409 - Email ya existe):
```json
{
  "error": "Email ya registrado"
}
```

---

### 2. Verificar Email

Valida el código de 6 dígitos recibido por email.

**Endpoint**: `POST /api/verificar`

#### cURL
```bash
curl -X POST http://localhost:3000/api/verificar \
  -H "Content-Type: application/json" \
  -d '{
    "id": "juan@example.com",
    "codigo": "123456"
  }'
```

#### JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/verificar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'juan@example.com',
    codigo: '123456'
  })
});

const data = await response.json();
if (response.ok) {
  console.log('Email verificado!');
} else {
  console.error('Código inválido');
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true
}
```

---

### 3. Iniciar Sesión (Login)

Obtiene JWT token para hacer operaciones autenticadas.

**Endpoint**: `POST /api/login`

#### cURL
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "juan@example.com",
    "password": "MiPassword123!"
  }'
```

#### JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'juan@example.com',
    password: 'MiPassword123!'
  })
});

const data = await response.json();
// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
//   "user": {
//     "id": "juan@example.com",
//     "nombre": "Juan Pérez",
//     "correo": "juan@example.com",
//     "rol": "usuario"
//   }
// }

// Guardar token
localStorage.setItem('authToken', data.token);
```

**Respuesta exitosa** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpAZS5jb20iLCJub21icmUiOiJKdWFuIiwicm9sIjoicwB1YXJpbyIsImV4cCI6MTcwNTQyMDAwMH0.abc123",
  "user": {
    "id": "juan@example.com",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "rol": "usuario"
  }
}
```

**Error** (401 - No verificado):
```json
{
  "error": "Usuario no verificado"
}
```

---

### 4. Validar Token

Verifica que el JWT sea válido (sin expirar).

**Endpoint**: `GET /api/verify` (protegido)

#### cURL
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:3000/api/verify \
  -H "Authorization: Bearer $TOKEN"
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/verify', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (response.ok) {
  console.log('Token válido');
} else {
  console.log('Token inválido o expirado');
}
```

**Respuesta exitosa** (200):
```json
{
  "valid": true
}
```

---

### 5. Renovar Token

Obtiene un nuevo JWT si el anterior aún es válido.

**Endpoint**: `POST /api/retoken` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/retoken \
  -H "Authorization: Bearer $TOKEN"
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/retoken', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

const newTokenData = await response.json();
// { "token": "new_jwt..." }

localStorage.setItem('authToken', newTokenData.token);
```

---

## 🎵 AUDIOS

### 1. Subir Audio (Protected)

Sube un archivo de audio grabado o procesado.

**Endpoint**: `POST /api/upload` (protegido)

#### cURL
```bash
TOKEN="your_jwt_token"

curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "audio=@/path/to/audio.webm" \
  -F "titulo=Mi primer podcast"
```

#### JavaScript (Web Audio API)
```javascript
const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('titulo', 'Mi primer podcast');

const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const data = await response.json();
console.log('Audio subido:', data.audioId, data.url);
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "audioId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "url": "/media/audio_1705314600.webm",
  "titulo": "Mi primer podcast"
}
```

---

### 2. Listar Audios

Obtiene lista paginada de todos los audios.

**Endpoint**: `POST /api/get_audios` (público)

#### cURL
```bash
curl -X POST http://localhost:3000/api/get_audios \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 10,
    "skip": 0
  }'
```

#### JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/get_audios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    limit: 10,
    skip: 0
  })
});

const data = await response.json();
console.log(`${data.audios.length} audios de ${data.total} total`);

// Mostrar en UI
data.audios.forEach(audio => {
  console.log(`${audio.titulo} por ${audio.autor} (${audio.likes_count} likes)`);
  // <audio src={audio.url} controls></audio>
});
```

**Respuesta** (200):
```json
{
  "audios": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "titulo": "Mi primer podcast",
      "url": "/media/audio_1705314600.webm",
      "autor": "juan@example.com",
      "likes_count": 5,
      "duracion": 125.5,
      "fecha": "2024-01-15T11:30:00Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "titulo": "React Hooks Tutorial",
      "url": "/media/audio_1705314800.webm",
      "autor": "maria@example.com",
      "likes_count": 12,
      "duracion": 240,
      "fecha": "2024-01-16T14:22:00Z"
    }
  ],
  "total": 150
}
```

---

### 3. Eliminar Audio (Protected)

Solo el dueño del audio puede eliminarlo.

**Endpoint**: `POST /api/delete_audio` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/delete_audio \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audioId": "65f1a2b3c4d5e6f7g8h9i0j2"
  }'
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/delete_audio', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    audioId: '65f1a2b3c4d5e6f7g8h9i0j2'
  })
});

if (response.ok) {
  console.log('Audio eliminado');
} else if (response.status === 403) {
  console.error('No eres el dueño');
}
```

**Respuesta exitosa** (200):
```json
{
  "success": true
}
```

---

## ❤️ LIKES

### 1. Dar/Quitar Like (Protected)

Toggle like en un audio (si ya likeó, quita; sino, agrega).

**Endpoint**: `POST /api/like_control` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/like_control \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "/media/audio_1705314600.webm"
  }'
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');
const audioUrl = '/media/audio_1705314600.webm';

const response = await fetch('http://localhost:3000/api/like_control', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: audioUrl })
});

const data = await response.json();
// { "action": "liked", "likes_count": 6 }
// O: { "action": "unliked", "likes_count": 5 }

console.log(`${data.action}! Total: ${data.likes_count}`);
```

**Respuesta** (200):
```json
{
  "action": "liked",
  "likes_count": 6
}
```

---

### 2. Obtener Mis Likes (Protected)

Lista los IDs de audios que el usuario ha likeado.

**Endpoint**: `POST /api/get_likeList` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/get_likeList \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/get_likeList', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
// { "likeList": ["65f1a2b3c4d5e6f7g8h9i0j2", "65f1a2b3c4d5e6f7g8h9i0j3"] }

const likedAudioIds = data.likeList;
// Usar para marcar en UI: ❤️ vs 🤍
```

**Respuesta** (200):
```json
{
  "likeList": [
    "65f1a2b3c4d5e6f7g8h9i0j2",
    "65f1a2b3c4d5e6f7g8h9i0j3",
    "65f1a2b3c4d5e6f7g8h9i0j4"
  ]
}
```

---

## 📱 POSTS

### 1. Crear Post (Protected)

Publica un nuevo post en el feed social.

**Endpoint**: `POST /api/upload_post` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/upload_post \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mensaje": "Escucha mi último podcast! 🎙️",
    "link": "https://youtube.com/watch?v=abc123"
  }'
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/upload_post', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mensaje: 'Escucha mi último podcast! 🎙️',
    link: 'https://youtube.com/watch?v=abc123'
  })
});

const data = await response.json();
console.log('Post creado:', data.postId);
```

**Respuesta** (200):
```json
{
  "success": true,
  "postId": "65f1a2b3c4d5e6f7g8h9i0j5"
}
```

---

### 2. Listar Posts

Obtiene posts del feed social con paginación.

**Endpoint**: `POST /api/get_posts` (público)

#### cURL
```bash
curl -X POST http://localhost:3000/api/get_posts \
  -H "Content-Type: application/json" \
  -d '{ "page": 1 }'
```

#### JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/get_posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ page: 1 })
});

const data = await response.json();

data.posts.forEach(post => {
  console.log(`${post.autor_nombre}: ${post.contenido}`);
  if (post.link) console.log(`Link: ${post.link}`);
});

if (data.hasMore) {
  console.log('Hay más posts (página siguiente disponible)');
}
```

**Respuesta** (200):
```json
{
  "posts": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "contenido": "Escucha mi último podcast! 🎙️",
      "link": "https://youtube.com/watch?v=abc123",
      "autor": "juan@example.com",
      "autor_nombre": "Juan Pérez",
      "fecha": "2024-01-17T09:15:00Z",
      "likes": 10
    }
  ],
  "total": 234,
  "page": 1,
  "hasMore": true
}
```

---

### 3. Eliminar Post (Protected)

Solo el dueño del post puede eliminarlo.

**Endpoint**: `POST /api/delete_post` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/delete_post \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "65f1a2b3c4d5e6f7g8h9i0j5"
  }'
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/delete_post', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    postId: '65f1a2b3c4d5e6f7g8h9i0j5'
  })
});

if (response.ok) {
  console.log('Post eliminado');
}
```

---

## 🎙️ PODCASTS

### 1. Crear Podcast (Protected)

Publica una nueva serie de podcast o agrega episodios.

**Endpoint**: `POST /api/upload_poadcast` (protegido)

#### cURL
```bash
TOKEN="..."

curl -X POST http://localhost:3000/api/upload_poadcast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serie": "Tech Talk 2024",
    "autores": "Juan Pérez",
    "url": "https://example.com/episode1.mp3"
  }'
```

#### JavaScript
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('http://localhost:3000/api/upload_poadcast', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    serie: 'Tech Talk 2024',
    autores: 'Juan Pérez',
    url: 'https://example.com/episode1.mp3'
  })
});

const data = await response.json();
console.log(data.success ? 'Podcast publicado' : 'Error');
```

---

### 2. Listar Podcasts

Obtiene todas las series de podcasts disponibles.

**Endpoint**: `POST /api/get_poadcast` (público)

#### cURL
```bash
curl -X POST http://localhost:3000/api/get_poadcast
```

#### JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/get_poadcast', {
  method: 'POST'
});

const data = await response.json();

data.forEach(podcast => {
  console.log(`${podcast.nombre} por ${podcast.autores}`);
  console.log(`Episodios: ${podcast.capitulo.length}`);
  
  podcast.capitulo.forEach((ep, i) => {
    console.log(`  EP ${i + 1}: ${ep.url}`);
  });
});
```

**Respuesta** (200):
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "nombre": "Tech Talk 2024",
    "autores": "Juan Pérez",
    "capitulo": [
      {
        "creacion": "2024-01-10T08:00:00Z",
        "url": "https://example.com/episode1.mp3"
      },
      {
        "creacion": "2024-01-17T08:00:00Z",
        "url": "https://example.com/episode2.mp3"
      }
    ]
  }
]
```

---

## 🔧 Configuración en Postman

### Importar OpenAPI

1. Abre Postman
2. Click en "Import"
3. Selecciona "Link"
4. Pega: `file:///path/to/ChazaRadio/openapi.yaml`
5. Click "Import"

### Configurar Variables de Entorno

1. Click en "Environments"
2. Crear "ChazaRadio-Dev"
3. Agregar variables:

```
base_url: http://localhost:3000
token: (se llena después de login)
```

### Workflow en Postman

1. **Registro**: POST `/api/registro`
2. **Verificación**: POST `/api/verificar` (usar código del email)
3. **Login**: POST `/api/login` → Copiar token
4. **Variables**: Pegar token en variable {{token}}
5. **Audios**: GET `/api/get_audios`
6. **Upload**: POST `/api/upload` (con token)

---

## ⚠️ Códigos de Error Comunes

| Código | Significado | Solución |
|--------|------------|----------|
| 400 | Bad Request | Revisa JSON, parámetros requeridos |
| 401 | Unauthorized | Token inválido, expirado o falta Authorization header |
| 403 | Forbidden | No eres el dueño del recurso |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Email/username ya existe |
| 413 | Payload Too Large | Archivo muy grande |
| 500 | Server Error | Error en backend, revisar logs |

---

## 💡 Tips & Tricks

### Guardar Token Automáticamente
```javascript
// Después de login
localStorage.setItem('token', data.token);

// Para siguiente request
const token = localStorage.getItem('token');
headers: { 'Authorization': `Bearer ${token}` }
```

### Manejo de Errores
```javascript
async function apiCall(url, options = {}) {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    console.error(`Error ${response.status}:`, error.error || error);
    throw error;
  }
  
  return response.json();
}

// Uso
try {
  const data = await apiCall(url, { headers: {...} });
} catch (error) {
  // Maneja error
}
```

### Paginación
```javascript
async function fetchAllPosts() {
  let page = 1;
  let allPosts = [];
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch('http://localhost:3000/api/get_posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page })
    });
    
    const data = await response.json();
    allPosts = [...allPosts, ...data.posts];
    hasMore = data.hasMore;
    page++;
  }
  
  return allPosts;
}
```

---

**Última actualización**: Abril 2026

