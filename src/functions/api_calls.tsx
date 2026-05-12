/**
 * @file api_calls.tsx
 * @remarks Cliente HTTP centralizado para todas las llamadas API en ChazaRadio
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

/**
 * Sube un archivo de audio a la plataforma
 * 
 * @param {FormData} formData - FormData con archivo y metadatos
 *   - campo 'audio': Blob de audio (webm, mp3, mpeg) y nombre temporal del archivo
 *   - campo 'data': Metadata del audio
 * @param {string} token - JWT del usuario autenticado
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Mensaje de Audio subido
 *  - 400: Mensaje de Datos inconsistentes
 *  - 401: Mensaje de Usuario no verificado
 *  - 500: Mensaje de Error de servidor
 * 
 * @remarks
 * Endpoint: POST /api/upload (protegido)
 * - Requiere autenticación
 * - Valida datos
 * - Almacena el archivo
 * - Inserta documento en BD colección Audios
 * 
 * @example
 * const formData = new FormData();
 * formData.append('file': audioBlob, 'titulo': 'MiPrimerPodcastPorUsuario.mpeg');
 * formData.append('titulo': 'Mi primer podcast', tipo: "cancion", autor: usuario);
 * 
 * const res = await api_uploadSounds(formData, userToken);
 * return res
 */
export const api_uploadSounds = async (formData: FormData, token: string) => {
    //Sube la pista
    const res = await fetch(`${API}/api/upload`, {
        //Metodo REST
        method: "POST",
        //Credenciales del usuario
        headers: {
            'Authorization': `Bearer ${token}`
            // Nota: No incluir Content-Type, fetch lo establece automáticamente para FormData
        },
        //Datos de la pista
        body: formData
    });
    return res
}

/**
 * Obtiene la lista de todos los audios disponibles en la plataforma
 * 
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Lista de audios
 *  - 500: Mensaje de Error de servidor
 * 
 * @remarks
 * Endpoint: POST /api/get_audios (público)
 * - Retorna la lista de audios
 * - Cacheado en backend
 * - Incluye contador de likes por audio
 * - Ordenado en backend
 * 
 * @example
 * const res = await api_getAudios();
 * const data = await res.json();
 */
export const api_getAudios = async () => {
    //Obtiene la lista de audios
    const res = await fetch(`${API}/api/get_audios`, {
        //Metodo REST
        method: "POST"
    });
    return res
}

/**
 * Elimina un audio subido por el usuario
 * 
 * @param {string} token - JWT del usuario autenticado
 * @param {string} audioId - ID del audio a eliminar
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Pista deshabilitada correctamente
 *  - 400: Datos inconsistentes
 *  - 401: Usuario no verificado
 *  - 403: Usuario no habilitado para eliminar el audio
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: DELETE /api/delete_audio (protegido)
 * - Requiere autenticación
 * - Verifica que el usuario sea el creador del audio
 * - Deshabilita el audio
 * - Actualiza el cache
 * 
 * @example
 * const res = await api_borrarAudio(userToken, 'audio-id-123');
 * alert('Audio eliminado');
 */
export const api_borrarAudio = async (token: string, audioId: string) => {
    //Deshabilita la pista de audio
    const res = await fetch(`${API}/api/delete_audio`, {
        //Metodo REST
        method: "POST",
        headers: {
            //Credenciales de usuario
            'Authorization': `Bearer ${token}`,
            //Estructura de los datos a enviar
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //Id del audio a eliminar
            audioId: audioId
        })
    });
    return res;
}

/**
 * Agrega o quita un like a un audio
 * 
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @param {string} url - URL del audio
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Listado de likes del usuario actualizado
 *  - 400: Datos inconsistentes
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/like_control (protegido)
 * - Requiere autenticación
 * - Valida si usuario ya dio like al video
 *   - Si no dio like: Agrega el registro a la base de datos
 *   - Si ya dio like: Elimina el registro de la base de datos
 * - Devuelve el listado actualizado de likes
 * 
 * @example
 * const res = await api_likeControl(userToken, '/audios/audio-id-123.mp3');
 * return res //Listado nuevo
 */
export const api_likeControl = async (token: string, url: string) => {
    //Registra o elimina su like
    const res = await fetch(`${API}/api/like_control`, {
        //Metodo REST
        method: 'POST',
        headers: {
            //Estructura de los datos a enviar
            'Content-Type': 'application/json',
            //Credenciales del usuario
            'Authorization': `Bearer ${token}`
        },
        //Url de la pista
        body: JSON.stringify({
            url: url
        })
    });
    return res
}

/**
 * Obtiene la lista de audios que el usuario actual ha likeado
 * 
 * @param {string} token - JWT del usuario autenticado (protegido)
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Listado de likes del usuario
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/get_likeList (protegido)
 * - Requiere autenticación
 * - Retorna el listado de likes del usuario
 * - Obtiene la lista al cargar la interfaz
 * 
 * @example
 * const res = await api_getLikes(userToken);
 * return res
 */
export const api_getLikes = async (token: string) => {
    //Obtiene la lista de likes del usuario
    const res = await fetch(`${API}/api/get_likeList`, {
        //Metodo REST
        method: 'POST',
        headers: {
            //Credenciales del usuario
            'Authorization': `Bearer ${token}`
        }
    });
    return res
}

/**
 * Reenvía el código de verificación por email
 * 
 * @param {string} id - Código del usuario
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Código reenviado
 *  - 400: Datos invalidos
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/recode (público)
 * - Valida los datos del usuario
 * - Valida la ultima solicitud de código
 * - Genera un nuevo código de 6 dígitos
 * - Envía nuevo código por email vía Nodemailer (Gmail SMTP)
 * 
 * @example
 * const res = await api_codigo('0000000000');
 * return res
 */
export const api_codigo = async (id: string) => {
    //Solicitud de código
    const res = await fetch(`${API}/api/recode`, {
        //Metodo REST
        method: 'POST',
        headers: {
            //Estructura de los datos
            'Content-Type': 'application/json'
        },
        //Id del usuario
        body: JSON.stringify({
            id: id
        })
    });
    return res;
}

/**
 * Verifica el código de verificación
 * 
 * @param {string} id - Id del usuario
 * @param {string} codigo - Código de 6 dígitos recibido por email
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Usuario verificado
 *  - 400: Datos invalidos
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/verificar
 * - Valida que el código coincida con el guardado en BD
 * - Verifica que el código no haya expirado
 *   - Si es correcto: marca usuario como verificado
 * 
 * @example
 * const res = await api_validar('0000000000', '123456');
 * return res
 */
export const api_validar = async (id: string, codigo: string) => {
    //Verifica el código del usuario
    const res = await fetch(`${API}/api/verificar`, {
        //Metodo REST
        method: 'POST',
        //Estructura de los datos
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //Id del usuario
            id: id,
            //Código de verificación
            codigo: codigo
        })
    });
    return res;
}

/**
 * Publica o actualiza una serie de podcast
 * 
 * @param {string} serie - Nombre de la serie de podcast
 * @param {string} autores - Autor(es) del podcast
 * @param {string} url - URL del episodio
 * @param {string} token - JWT del usuario autenticado
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Usuario verificado
 *  - 400: Datos invalidos
 *  - 401: Usuario no verificado
 *  - 403: Usuario no coincide con el creador
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/upload_poadcast (protegido)
 * - Requiere autenticación (JWT)
 * - Crea nueva serie o actualiza existente
 * 
 * @example
 * const res = await api_publicarPoadcast(
 *   serie: 'Mi Podcast',
 *   autores: 'Usuario',
 *   url: 'https://youtube.com/episodio1',
 *   userToken
 * );
 * return res
 */
export const api_publicarPoadcast = async (serie: string, autores: string, url: string, token: string) => {
    //Sube el poadcast
    const res = await fetch(`${API}/api/upload_poadcast`, {
        //Metodo REST
        method: "POST",
        headers: {
            //Credenciales del usuario
            Authorization: `Bearer ${token}`,
            //Estructura de los datos
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //Nombre del poadcast
            serie: serie,
            //Autores del poadcast
            autores: autores,
            //Url del capitulo
            url: url
        })
    });

    return res;
}

/**
 * Obtiene todas las series de podcasts
 * 
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Listado de poadcasts
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/get_poadcast (público)
 * - Retorna todas las series de podcasts de la plataforma
 * 
 * @example
 * const podcasts = await api_poadcasts();
 * return res
 */
export const api_poadcasts = async () => {
    //Consulta de poadcasts
    const res = await fetch(`${API}/api/get_poadcast`, {
        //Metodo REST
        method: "POST"
    });

    return res;
}

/**
 * Publica un nuevo post en el feed social
 * 
 * @param {string} mensaje - Contenido del post (máx 500 caracteres)
 * @param {string} link - URL opcional (Link a youtube o url de una imagen)
 * @param {string} token - JWT del usuario autenticado
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Post publicado
 *  - 400: Datos invalidos
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/upload_post (protegido)
 * - Requiere autenticación
 * - Valida que exita un mensaje o una url
 * - Inserta el post en la Base de datos
 * 
 * @example
 * const res = await api_uploadPost(
 *   'Escucha mi último podcast!',
 *   'https://youtube.com/video',
 *   userToken
 * );
 * return res
 */
export const api_uploadPost = async (mensaje: string, link: string, token: string) => {
    //Publica el post
    const res = await fetch(`${API}/api/upload_post`, {
        //Metodo REST
        method: "POST",
        headers: {
            //Credenciales del usuario
            'Authorization': `Bearer ${token}`,
            //Estructura de los datos
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //Mensaje del post
            mensaje: mensaje,
            //Url del post
            link: link
        })
    });
    return res;
}

/**
 * Elimina un post del feed (Solo el dueño del post)
 * 
 * @param {string} token - JWT del usuario autenticado
 * @param {string} postId - ID del post a eliminar
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Post eliminado
 *  - 400: Datos invalidos
 *  - 401: Usuario no verificado
 *  - 403: Usuario no coincide con el creador
 *  - 500: Error interno del servidor
 * @remarks
 * Endpoint: DELETE /api/delete_post (protegido)
 * - Requiere autenticación
 * - Verifica que el usuario sea el mismo creador del post
 * - Inhabilita el post
 * 
 * @example
 * const res = await api_borrarPost(userToken, 'post123af1');
 * return res
 */
export const api_borrarPost = async (token: string, postId: string) => {
    //Borra el post
    const res = await fetch(`${API}/api/delete_post`, {
        //Metodo REST
        method: "POST",
        headers: {
            //Credenciales del usuario
            'Authorization': `Bearer ${token}`,
            //Estructura de los datos
            'Content-Type': 'application/json'
        },
        //Id del post
        body: JSON.stringify({
            postId: postId
        })
    });
    return res;
}

/**
 * Obtiene posts segun su paginación
 * 
 * @param {string} token - JWT del usuario autenticado
 * @param {number} page - Número de página (página 1 = registros 0-9)
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Lista de posts
 *  - 400: Datos invalidos
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/get_posts (privado)
 * Obtiene los posts de la pagina (Definida por un salto y limite)
 * 
 * @example
 * const res = await api_getPosts(1); // Primera página
 * return res
 */
export const api_getPosts = async (page: number, token: string) => {
    //Obtiene los posts de una pagina
    const res = await fetch(`${API}/api/get_posts`, {
        //Metodo REST
        method: 'POST',
        headers: {
            //Credenciales del usuario
            'Authorization': `Bearer ${token}`,
            //Estructura de los datos
            'Content-Type': 'application/json'
        },
        //Pagina de posts
        body: JSON.stringify({
            page: page
        })
    });
    return res;
}

/**
 * Registra un nuevo usuario en la plataforma
 * 
 * @param {string} user - Nombre de usuario (username)
 * @param {string} password - Contraseña
 * @param {string} mail - Email del usuario (Correo institucional)
 * @param {string} id - Código institucional
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Usuario registrado
 *  - 400: Datos invalidos
 *  - 403: Usuario o correo ya registrados
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/registro (publico)
 * - Valida que email y username sean únicos
 * - Crea el usuario (Sin verificar)
 * - Genera código de verificación de 6 dígitos
 * - Envía código por email vía Nodemailer
 * 
 * @example
 * const res = await api_registrar('usuario', 'contraseña', 'usuario@udistrital', '0000000000');
 * return res
 */
export const api_registrar = async (user: string, password: string, mail: string, id: string) => {
    //Registra el usuario
    const res = await fetch(`${API}/api/registro`, {
        //Metodo REST
        method: 'POST',
        //Estructura de los datos
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //Nombre del usuario
            user: user,
            //Contraseña
            password: password,
            //Correo institucional
            email: mail,
            //Código institucional
            id: id
        })
    });
    return res;
}

/**
 * Inicia sesión con código y contraseña
 * 
 * @param {string} user - Código institucional
 * @param {string} password - Contraseña
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Inicio de sesión
 *  - 400: Datos invalidos
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/login (publico)
 * - Valida credenciales contra base de datos
 * - Si el usuario esta verificado, genera su JWT
 * - Si el usuario no esta verificado, le pide el código de verificación
 * 
 * @example
 * const res = await api_login('0000000000', 'Contraseña');
 * return res
 */
export const api_login = async (user: string, password: string) => {
    //Verifica el inicio de sesión del usuario
    const res = await fetch(`${API}/api/login`, {
        //Metodo REST
        method: 'POST',
        //Estructura de los datos
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //Código universitario
            id: user,
            //Contraseña
            password: password
        })
    });
    return res
}

/**
 * Valida que un JWT sea válido con el backend
 * 
 * @param {string} token - JWT a validar
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Token válido
 *  - 401: Token inválido
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: GET /api/verify (protegido)
 * - Valida el estado del token en el BackEnd
 * 
 * @example
 * const res = await api_checkAuth(storedToken);
 * return res
 */
export const api_checkAuth = async (token: string) => {
    //Verificación del token
    const res = await fetch(`${API}/api/verify`, {
        //Credenciales del usuario
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res
}

/**
 * Renueva un JWT que está a punto de expirar
 * 
 * @param {string|null} token - JWT actual a renovar
 * @returns {Promise<Response>} Response de fetch
 *  - 200 (.ok): Nuevo token generado
 *  - 401: Usuario no verificado
 *  - 500: Error interno del servidor
 * 
 * @remarks
 * Endpoint: POST /api/retoken (protegido)
 * - Envia el token actual para verificar su estado
 * - Genera un nuevo token
 * 
 * @example
 * const res = await api_reloadAuth(currentToken);
 * return res
 */
export const api_reloadAuth = async (token: string | null) => {
    //Genera un nuevo token
    const res = await fetch(`${API}/api/retoken`, {
        //Metodo REST
        method: 'POST',
        headers: {
            //Credenciales del usuario
            Authorization: `Bearer ${token}`
        }
    })
    return res;

}
