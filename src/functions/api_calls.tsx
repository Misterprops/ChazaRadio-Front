/**
 * @file api_calls.tsx
 * @description Cliente HTTP centralizado para todas las llamadas API en ChazaRadio
 * 
 * Este archivo contiene funciones wrapper alrededor de fetch() que:
 * - Apuntan a la API del backend (URL desde VITE_APP_API)
 * - Manejan headers automáticamente (Content-Type, Authorization)
 * - Encapsulan Request/Response para consistencia
 * - Se utilizan desde componentes React para operaciones de usuario
 * 
 * Patrón de respuesta:
 * - Retorna Response object de fetch
 * - Componente debe hacer .json() o .text() y verificar .ok
 * 
 * @author ChazaRadio Team
 * @version 1.0
 */

/**
 * URL base de la API backend
 * @type {string}
 * @description Se obtiene de variable de entorno VITE_APP_API
 * @example
 * // .env.local
 * VITE_APP_API=http://localhost:3000
 */
const API = import.meta.env.VITE_APP_API;

// ============================================================================
// 🔐 AUTENTICACIÓN (Login, Registro, Verificación)
// ============================================================================

/**
 * Inicia sesión con email/usuario y contraseña
 * 
 * @async
 * @param {string} user - Email o username del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { token: "jwt...", user: {...} }
 *   - .ok === false (400): Contraseña incorrecta
 *   - .ok === false (401): Usuario no verificado
 *   - .ok === false (404): Usuario no existe
 * 
 * @description
 * Endpoint: POST /api/login
 * - Valida credenciales contra base de datos
 * - Si es correcto: genera JWT (20min expiry)
 * - Si usuario no está verificado: retorna 401 (debe verificar email)
 * - Respuesta: { token, user: { id, correo, nombre, rol } }
 * 
 * @example
 * const res = await api_login('usuario@email.com', 'miContraseña');
 * if (res.ok) {
 *   const data = await res.json();
 *   const { token, user } = data;
 *   logToken(token); // Guarda en localStorage
 * } else if (res.status === 401) {
 *   setNeedVerification(true);
 * }
 */
export const api_login = async (user: string, password: string) => {
    const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: user,
            password: password
        })
    });
    return res
}

/**
 * Verifica un código de email para completar registro o login
 * 
 * @async
 * @param {string} id - Email o username del usuario
 * @param {string} codigo - Código de 6 dígitos recibido por email
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: Usuario verificado exitosamente
 *   - .ok === false (400): Código inválido o expirado
 * 
 * @description
 * Endpoint: POST /api/verificar
 * - Valida que el código coincida con el guardado en BD
 * - Verifica que el código no haya expirado (TTL 15min)
 * - Si es correcto: marca usuario como verificado
 * - Si es incorrecto: usuario puede intentar nuevamente
 * 
 * @example
 * const res = await api_validar('usuario@email.com', '123456');
 * if (res.ok) {
 *   console.log('Email verificado!');
 *   // Proceder a login
 * } else {
 *   alert('Código incorrecto');
 * }
 */
export const api_validar = async (id: string, codigo: string) => {
    const res = await fetch(`${API}/api/verificar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            codigo: codigo
        })
    });
    return res;
}

/**
 * Reenvía el código de verificación por email
 * 
 * @async
 * @param {string} id - Email o username del usuario
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: Código reenviado exitosamente
 *   - .ok === false: Error al enviar email
 * 
 * @description
 * Endpoint: POST /api/recode
 * - Genera un nuevo código de 6 dígitos
 * - Elimina código anterior
 * - Envía nuevo código por email vía Nodemailer (Gmail SMTP)
 * - TTL: 15 minutos desde reenvío
 * 
 * @example
 * const res = await api_codigo('usuario@email.com');
 * if (res.ok) {
 *   alert('Código reenviado al email');
 * }
 */
export const api_codigo = async (id: string) => {
    const res = await fetch(`${API}/api/recode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    });
    return res;
}

/**
 * Registra un nuevo usuario en la plataforma
 * 
 * @async
 * @param {string} user - Nombre de usuario (username)
 * @param {string} password - Contraseña en texto plano
 * @param {string} mail - Email del usuario (debe ser único)
 * @param {string} id - Identificador único (puede ser username o id custom)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: Usuario creado, email de verificación enviado
 *   - .ok === false (409): Email o username ya existe
 *   - .ok === false (500): Error en servidor
 * 
 * @description
 * Endpoint: POST /api/registro
 * - Valida que email y username sean únicos
 * - Crea documento en colección Registros (no verificado aún)
 * - Genera código de verificación de 6 dígitos
 * - Envía código por email vía Nodemailer
 * - Usuario debe verificar email antes de poder hacer login
 * 
 * @example
 * const res = await api_registrar('juanperez', 'MiPass123!', 'juan@email.com', 'juan@email.com');
 * if (res.ok) {
 *   alert('Registrado! Verifica tu email');
 *   // Mostrar formulario de verificación
 * } else if (res.status === 409) {
 *   alert('Email ya registrado');
 * }
 */
export const api_registrar = async (user: string, password: string, mail: string, id: string) => {
    const res = await fetch(`${API}/api/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: user,
            password: password,
            email: mail,
            id: id
        })
    });
    return res;
}

/**
 * Valida que un JWT sea válido con el backend
 * 
 * @async
 * @param {string} token - JWT a validar
 * @returns {Promise<boolean>} true si token es válido, false si es inválido/expirado
 * 
 * @description
 * Endpoint: GET /api/verify (protegido)
 * - Envía token en header Authorization: Bearer {token}
 * - Backend valida la firma del JWT
 * - Backend verifica expiración
 * - Usado al iniciar la app para restaurar sesión
 * 
 * @example
 * const isValid = await api_checkAuth(storedToken);
 * if (isValid) {
 *   // Token aún válido, mantener sesión
 * } else {
 *   // Token inválido, ir a login
 * }
 */
export const api_checkAuth = async (token: string) => {
    const res = await fetch(`${API}/api/verify`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) {
        return false;
    }
    return true;
}

/**
 * Renueva un JWT que está a punto de expirar
 * 
 * @async
 * @param {string|null} token - JWT actual a renovar
 * @returns {Promise<string|null>} JWT nuevo si es exitoso, null si falla
 * 
 * @description
 * Endpoint: POST /api/retoken (protegido)
 * - Envía token antiguo en header Authorization
 * - Backend valida el token
 * - Backend genera nuevo JWT (20min expiry a partir de ahora)
 * - Usado por authContext cuando quedan <5 min para expirar
 * - No requiere credenciales nuevamente
 * 
 * @example
 * const newToken = await api_reloadAuth(currentToken);
 * if (newToken) {
 *   logToken(newToken); // Actualiza localStorage
 * } else {
 *   logout(); // Token renovación falló, ir a login
 * }
 */
export const api_reloadAuth = async (token: string | null) => {
    if (!token) return null
    const res = await fetch(`${API}/api/retoken`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) return null
    return res;
}

// ============================================================================
// 🎙️ PODCASTS
// ============================================================================

/**
 * Obtiene todas las series de podcasts disponibles
 * 
 * @async
 * @returns {Promise<Array>} Array de podcasts con serie, autores, episodios, etc
 * 
 * @description
 * Endpoint: POST /api/get_poadcast (público, sin autenticación)
 * - Retorna todas las series de podcasts de la plataforma
 * - Cacheado en backend (180s TTL)
 * - Estructura de podcast: { _id, serie, autores, episodios: [...], ... }
 * 
 * @example
 * const podcasts = await api_poadcasts();
 * podcasts.forEach(podcast => {
 *   console.log(`${podcast.serie} por ${podcast.autores}`);
 * });
 */
export const api_poadcasts = async () => {
    const res = await fetch(`${API}/api/get_poadcast`, {
        method: "POST"
    });

    return res;
}

/**
 * Publica o actualiza una serie de podcast
 * 
 * @async
 * @param {string} serie - Nombre/título de la serie de podcast
 * @param {string} autores - Autor(es) del podcast
 * @param {string} url - URL del audio/episodio
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: Podcast creado/actualizado
 *   - .ok === false (401): Token inválido/expirado
 * 
 * @description
 * Endpoint: POST /api/upload_poadcast (protegido)
 * - Requiere autenticación (JWT)
 * - Crea nueva serie o actualiza existente (upsert)
 * - Almacena creador, titulo, autores, episodios, etc.
 * - Invalida caché de podcasts
 * 
 * @example
 * const res = await api_publicarPoadcast(
 *   'Mi Podcast Favorito',
 *   'Juan Pérez',
 *   'https://example.com/episode1.mp3',
 *   userToken
 * );
 * if (res.ok) {
 *   alert('Podcast publicado!');
 * }
 */
export const api_publicarPoadcast = async (serie: string, autores: string, url: string, token: string) => {
    const res = await fetch(`${API}/api/upload_poadcast`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            serie: serie,
            autores: autores,
            url: url
        })
    });

    return res;
}

// ============================================================================
// 🎵 AUDIOS / PISTAS
// ============================================================================

/**
 * Sube un archivo de audio a la plataforma
 * 
 * @async
 * @param {FormData} formData - FormData con archivo y metadatos
 *   - campo 'file': Blob de audio (webm, mp3, wav, etc)
 *   - campo 'titulo': Título del audio
 *   - opcionales: 'descripcion', 'duracion', etc
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { audioId, url, titulo, autor, ... }
 *   - .ok === false (401): Token inválido
 *   - .ok === false (413): Archivo excede límite de tamaño
 * 
 * @description
 * Endpoint: POST /api/upload (protegido)
 * - Requiere autenticación
 * - Captura archivo con multer middleware
 * - FFmpeg procesa audio si es necesario
 * - Almacena en /media (local) o Azure Blob (configurable)
 * - Inserta documento en BD colección Audios
 * - Invalida caché de audios
 * 
 * @example
 * const formData = new FormData();
 * formData.append('file', audioBlob, 'mi-audio.webm');
 * formData.append('titulo', 'Mi primer podcast');
 * 
 * const res = await api_uploadSounds(formData, userToken);
 * if (res.ok) {
 *   const data = await res.json();
 *   console.log('Audio subido:', data.url);
 * }
 */
export const api_uploadSounds = async (formData: FormData, token: string) => {
    const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
            // Note: No incluir Content-Type, fetch lo establece automáticamente para FormData
        },
        body: formData
    });
    return res
}

/**
 * Obtiene la lista de todos los audios disponibles en la plataforma
 * 
 * @async
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { audios: [...], total, skip, limit }
 *   - Cada audio: { _id, titulo, url, autor, likes_count, fecha, ... }
 * 
 * @description
 * Endpoint: POST /api/get_audios (público)
 * - Retorna audios paginados (default: limit=10, skip=0)
 * - Cacheado en backend (180s TTL) para performance
 * - Incluye contador de likes por audio
 * - Ordenado por fecha descendente
 * 
 * @example
 * const res = await api_getAudios();
 * if (res.ok) {
 *   const data = await res.json();
 *   console.log(`${data.audios.length} audios cargados`);
 *   console.log(`Total en BD: ${data.total}`);
 * }
 */
export const api_getAudios = async () => {
    const res = await fetch(`${API}/api/get_audios`, {
        method: "POST"
    });
    return res
}

/**
 * Obtiene la lista de audios que el usuario actual ha likeado
 * 
 * @async
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { likeList: [...] } array de IDs de audios likeados
 *   - .ok === false (401): Token inválido
 * 
 * @description
 * Endpoint: POST /api/get_likeList (protegido)
 * - Requiere autenticación
 * - Busca en colección LikeList todos los registros del usuario
 * - Retorna lista de IDs de audios
 * - Útil para marcar UI (mostrar corazón lleno si ya likeó)
 * 
 * @example
 * const res = await api_getLikes(userToken);
 * if (res.ok) {
 *   const data = await res.json();
 *   const likedAudioIds = data.likeList;
 *   // Marcar en UI los audios que el usuario likeó
 * }
 */
export const api_getLikes = async (token: string) => {
    const res = await fetch(`${API}/api/get_likeList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return res
}

/**
 * Agrega o quita un like a un audio (toggle)
 * 
 * @async
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @param {string} url - URL o ID del audio (identificador único)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { action: 'liked'|'unliked', likes_count: number }
 *   - .ok === false (401): Token inválido
 *   - .ok === false (404): Audio no existe
 * 
 * @description
 * Endpoint: POST /api/like_control (protegido)
 * - Requiere autenticación
 * - Valida si usuario ya likeó este audio
 * - Si NO likeó: inserta registro en LikeList, incrementa likes_count
 * - Si YA likeó: elimina registro, decrementa likes_count
 * - Invalida caché de audios
 * - Respuesta incluye acción realizada y likes_count actualizado
 * 
 * @example
 * const res = await api_likeControl(userToken, 'audio-id-123');
 * if (res.ok) {
 *   const data = await res.json();
 *   if (data.action === 'liked') {
 *     console.log('❤️ Likeado! Total likes:', data.likes_count);
 *   } else {
 *     console.log('💔 Like removido. Total likes:', data.likes_count);
 *   }
 * }
 */
export const api_likeControl = async (token: string, url: string) => {
    const res = await fetch(`${API}/api/like_control`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            url: url
        })
    });
    return res
}

/**
 * Elimina un audio subido por el usuario
 * 
 * @async
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @param {string} audioId - ID del audio a eliminar
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: Audio eliminado exitosamente
 *   - .ok === false (401): Token inválido
 *   - .ok === false (403): No eres el dueño del audio
 *   - .ok === false (404): Audio no existe
 * 
 * @description
 * Endpoint: DELETE /api/delete_audio (protegido)
 * - Requiere autenticación
 * - Verifica que user_id == audio.autor (solo dueño puede eliminar)
 * - Elimina archivo de almacenamiento (/media o Azure)
 * - Elimina documento de BD
 * - Elimina todos los likes asociados
 * - Invalida caché
 * 
 * @example
 * const res = await api_borrarAudio(userToken, 'audio-id-123');
 * if (res.ok) {
 *   alert('Audio eliminado');
 *   // Refresca lista
 * } else if (res.status === 403) {
 *   alert('No puedes eliminar audios ajenos');
 * }
 */
export const api_borrarAudio = async (token: string, audioId: string) => {
    const res = await fetch(`${API}/api/delete_audio`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            audioId: audioId
        })
    });
    return res;
}

// ============================================================================
// 📱 POSTS / FEED SOCIAL
// ============================================================================

/**
 * Obtiene posts del feed social con paginación
 * 
 * @async
 * @param {number} page - Número de página (página 1 = registros 0-9, página 2 = 10-19, etc)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { posts: [...], total, page, hasMore }
 *   - Cada post: { _id, contenido, link, autor, likes, fecha, ... }
 * 
 * @description
 * Endpoint: POST /api/get_posts (público)
 * - Paginación: limit=10, skip=(page-1)*10
 * - Cacheado en backend (60s TTL)
 * - Ordenado por fecha descendente (más recientes primero)
 * - Incluye información del autor (nombre, avatar)
 * - hasMore: boolean para saber si hay más posts
 * 
 * @example
 * const res = await api_getPosts(1); // Primera página
 * if (res.ok) {
 *   const data = await res.json();
 *   console.log(`${data.posts.length} posts en página 1`);
 *   if (data.hasMore) {
 *     // Mostrar botón "Cargar más"
 *   }
 * }
 */
export const api_getPosts = async (page: number) => {
    const res = await fetch(`${API}/api/get_posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            page: page
        })
    });
    return res;
}

/**
 * Publica un nuevo post en el feed social
 * 
 * @async
 * @param {string} mensaje - Contenido del post (máx ~500 caracteres)
 * @param {string} link - URL opcional (ej: link a YouTube, Spotify, etc)
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: { postId, post }
 *   - .ok === false (401): Token inválido
 *   - .ok === false (400): Mensaje vacío
 * 
 * @description
 * Endpoint: POST /api/upload_post (protegido)
 * - Requiere autenticación
 * - Valida que el mensaje no esté vacío
 * - Inserta documento en colección Posts
 * - Campos: contenido, link, autor (user_id), fecha (now), likes: 0
 * - Invalida caché de posts
 * - Respuesta incluye ID del post creado
 * 
 * @example
 * const res = await api_uploadPost(
 *   'Escucha mi último podcast! 🎙️',
 *   'https://youtube.com/watch?v=...',
 *   userToken
 * );
 * if (res.ok) {
 *   const data = await res.json();
 *   console.log('Post publicado:', data.postId);
 *   // Agregar post al feed (optimistic update)
 * }
 */
export const api_uploadPost = async (mensaje: string, link: string, token: string) => {
    const res = await fetch(`${API}/api/upload_post`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mensaje: mensaje,
            link: link
        })
    });
    return res;
}

/**
 * Elimina un post del feed social (solo si es el dueño)
 * 
 * @async
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @param {string} postId - ID del post a eliminar
 * @returns {Promise<Response>} Response de fetch
 *   - .ok === true: Post eliminado exitosamente
 *   - .ok === false (401): Token inválido
 *   - .ok === false (403): No eres el dueño del post
 *   - .ok === false (404): Post no existe
 * 
 * @description
 * Endpoint: DELETE /api/delete_post (protegido)
 * - Requiere autenticación
 * - Verifica que user_id == post.autor (solo dueño puede eliminar)
 * - Elimina documento de colección Posts
 * - Invalida caché
 * 
 * @example
 * const res = await api_borrarPost(userToken, 'post-id-123');
 * if (res.ok) {
 *   alert('Post eliminado');
 *   // Refresca feed
 * } else if (res.status === 403) {
 *   alert('No puedes eliminar posts ajenos');
 * }
 */
export const api_borrarPost = async (token: string, postId: string) => {
    const res = await fetch(`${API}/api/delete_post`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postId: postId
        })
    });
    return res;
}