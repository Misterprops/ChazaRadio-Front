const API = import.meta.env.VITE_APP_API;

//Llamadas de login y register
//Login only
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

//Login y register
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

//Login y register
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

//Register only
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

//Funcion para validar el token - recibe el token y devuelve un booleano
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

//Funcion para recargar el token
export const api_reloadAuth = async (token: string | null) => {
    if (!token) return null
    const res = await fetch(`${API}/api/retoken`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) return null
    return await res.json();

}

//Emisora poadcasts
export const api_poadcasts = async () => {
    try {
        const res = await fetch(`${API}/api/get_poadcast`, {
            method: "POST"
        });

        return await res.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

//Emisora publicar poadcast
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

//Subida de pistas de audio en perfil
export const api_uploadSounds = async (formData: FormData, token: string) => {
    const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return res
}

//Obtener la lista de canciones
export const api_getAudios = async () => {
    const res = await fetch(`${API}/api/get_audios`, {
        method: "POST"
    });
    return res
}

//Obtener los likes de las canciones
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

//Controlar manejo de likes
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