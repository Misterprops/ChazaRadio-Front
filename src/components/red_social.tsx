import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../elements/button";
import { useAuth } from "../functions/authContext";
import { api_borrarPost, api_getPosts, api_uploadPost } from "../functions/api_calls";
import { useNavigate } from "react-router";

/**
 * Tipo que define el formato de los posts
 * @typedef {Object} post
 * @property {string} id - Id del creador
 * @property {string} mensaje - Mensaje del post
 * @property {string} link - Url del post
 * @property {string} tipo - Tipo de url del post (Vacio, Imagen, Video)
 * @property {boolean} enabled - Indicador de post activo
 * @property {string} _id - Id del post
 */
type post = {
    id: string,
    mensaje: string,
    link: string,
    nombre: string,
    tipo: string,
    enabled: boolean,
    _id: string
}

/**
 * Vista de la red social (Publicaciones).
 * 
 * @remarks
 * Depende de servicios backend para:
 * - Obtención de posts
 * - Publicación de posts
 * - Eliminación de posts
 * Funcionalidades:
 * - Crear posts
 * - Mostrar posts paginados
 * - Carga infinita (IntersectionObserver)
 * - Eliminar posts
 * 
 * @returns {JSX.Element} Componente visual de la red social
 */
export function Red_social() {
    //Referencia de posts obtenidos
    const didFetch = useRef(false);
    //Mensaje del post
    const [mensaje, setMensaje] = useState("");
    //Url del post
    const [link, setLink] = useState("");
    //Listado de posts
    const [publicacion, setPublicion] = useState<post[]>([])
    //Identificador de Imagen o Video
    const [frame, setFrame] = useState(false)
    //Pagina de posts
    const [page, setPage] = useState(1);
    //Indicador de carga de posts
    const [loading, setLoading] = useState(false);
    //Indicador de posts por mostrar
    const [hasMore, setHasMore] = useState(true);
    //Referencia del ultimo post actual
    const observer = useRef<IntersectionObserver | null>(null);
    //Credenciales de usuario del authContext
    const { user, token, checkAuth } = useAuth();
    const load = useAuth().loading
    //Hook de redirección
    const navigate = useNavigate();

    /**
     * Obtiene posts desde backend con paginación.
     * 
     * @returns {Promise<void>}
     * @internal
     * @remarks
     * - Solicita los posts al back
     * - Debe ser un usuario autenticado
     */
    const fetchPosts = async () => {
        try {
            if (load) return;
            if (token && await checkAuth()) {
                //No avanza si el estado de carga esta activo y hay posts por mostrar
                if (loading || !hasMore) return;

                //Marca el estado de carga como activo
                setLoading(true);

                //Obtiene los posts del API
                const res = await api_getPosts(page, token);
                const data = await res.json();
                //Guarda unicamente los posts habilitados
                const post: post[] = data.filter((post: post) => post.enabled);
                //Verifica si hay errores en el back
                if (!res.ok) {
                    return alert(data.error);
                }
                //Verifica la cantidad de posts obtenidos
                if (data.length === 0) {
                    //Si es 0, marca que no hay maas posts disponibles
                    setHasMore(false);
                } else {
                    //Si no lo es, agrega los nuevos posts al listado actual de posts
                    setPublicion(prev => [...prev, ...post]);
                    //Aumenta la pagina
                    setPage(prev => prev + 1);
                }
                //Marca el estado de carga como inhactivo
                setLoading(false);
            } else {
                //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
                alert("Sesion caducada");
                navigate("/Login")
            }
        } catch (error) {
            alert("Error al obtener los posts")
        }
    };

    /**
     * Crea una referencia para el ultimo post.
     * 
     * @param {HTMLLIElement | null} node - Ultimo elemento LI de la lista de posts
     * @returns {Promise<void>}
     * @internal
     */
    const lastPostRef = useCallback((node: HTMLLIElement | null) => {
        //No avanza si el estado de carga esta activo
        if (loading) return;

        //Elimina la referencia del ultimo elemento de la lista de posts
        if (observer.current) observer.current.disconnect();

        //Genera una nueva referencia
        observer.current = new IntersectionObserver(entries => {
            //Verifica que la referencia se activo y hay mas posts disponibles
            if (entries[0].isIntersecting && hasMore) {
                //Obtiene los nuevos posts
                fetchPosts();
            }
        });

        //Si el elemento existe, procede a observarlo
        if (node) observer.current.observe(node);
        //Se actualiza si alguno de los parametros cambia
    }, [loading, hasMore]);

    /**
     * Hook que se ejecuta al montar el componente
     * Verifica que no hay posts obtenidos para obtenerlos
     */
    useEffect(() => {
        if (load) return;
        //Verifica que no hay posts
        if (didFetch.current) return;
        //Obtiene posts
        fetchPosts();
        //Marca la referencia como true
        didFetch.current = true;
    }, [load, token]);

    /**
     * Verifica que la url de video sea valida y de youtube
     * 
     * @param {string} url - Url a verificar
     * @returns {boolean}
     * @internal
     */
    const isValidURL = (url: string) => {
        try {
            //Verifica que la url sea valida
            new URL(url);
            //Verifica que la url sea de youtube y este marcada como video
            if ((url.includes("youtube") || url.includes("youtu.be")) || frame) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    };

    /**
     * Verifica el tamaño del texto
     * 
     * @param {string} texto - texto a verificar
     * @returns {boolean}
     * @internal
     */
    const maxLength = (texto: string) => {
        return texto.length > 500 ? false : true
    }

    /**
     * Publica un nuevo post.
     * 
     * @returns {Promise<void>}
     * @internal
     * 
     * @remarks
     * - Valida los datos de la url, mensaje y usuario
     * - Llama al back para subir el nuevo post
     */
    const publicar = async () => {
        try {
            //Valida el tamaño del mensaje y url
            if (maxLength(mensaje) || maxLength(link)) {
                //Verifica si es un video o si su url es de youtube
                if (isValidURL(link)) {
                    //Verifica el estado del usuario
                    if (token && await checkAuth()) {
                        //Sube el posts
                        const res = await api_uploadPost(mensaje, link, token)
                        const data = await res.json()
                        //Valida que el posts se ha publicado
                        if (res.ok) {
                            alert(data.msg || "Post publicado");
                            setMensaje("");
                            setLink("")
                        } else {
                            alert(data.error || "Error al publicar el post");
                        }
                    } else {
                        //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
                        alert("Sesion caducada");
                        navigate("/Login")
                    }
                } else {
                    alert("El url no es valido")
                }
            } else {
                alert("Se excedio el maximo de caracteres")
            }
        } catch (error) {
            alert("Error al subir el post");
        }
    }

    /**
     * Elimina un post del usuario.
     * 
     * @param {string} postId
     * @returns {Promise<void>}
     * @internal
     * @remarks
     * - Requiere un usuario autenticado
     * - Envia el post al API para validar su dueño
     * - Elimina el post y lo remueve de la intefaz
     */
    const borrar = async (postId: string) => {
        try {
            //Verifica el estado del usuario
            if (token && await checkAuth()) {
                //Llama al API para borrar el post
                const res = await api_borrarPost(token, postId);
                const data = await res.json()
                //Valida el estado de la respuesta
                if (res.ok) {
                    //Avisa que elimino el post
                    alert(data.msg || "Post eliminado");
                    //Remueve el post de la interfaz
                    setPublicion(prev => prev.filter(post => post._id !== postId));
                } else {
                    alert(data.error || "Error al publicar el post");
                }
            } else {
                //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
                alert("Sesion caducada");
                navigate("/Login")
            }
        } catch (error) {
            alert("Error al borrar el post");
        }
    }

    //Interfaz de la red social
    return (
        <div className="flex items-center w-full pl-4 pr-4 justify-center flex-col">
            {/*Valida el usuario*/}
            {user ?
                //Muestrael nombre del usuario
                <div className="flex w-full justify-end">
                    <span className="text-medium wrap-break-word">{user.nombre}</span>
                </div>
                :
                //Muestra un placeholder
                <div className="flex w-full justify-end">
                    <span className="text-medium wrap-break-word">Name</span>
                </div>
            }

            <div className="w-full">
                {/*Formulario de publicación de posts*/}
                <form className="flex flex-col w-full items-center" onSubmit={(e) => { e.preventDefault(); setFrame(!frame) }}>
                    {/*Mensaje del post*/}
                    <textarea className="bg-fuchsia-300 w-full mb-2 resize-none" maxLength={500} rows={5} placeholder="Escribe tu mensaje" value={mensaje} onChange={(e) => { setMensaje(e.target.value) }} />
                    {/*Url del post*/}
                    <textarea className="bg-fuchsia-300 w-full mb-2 resize-none" maxLength={500} rows={2} placeholder="Comparte tu contenido" value={link} onChange={(e) => { setLink(e.target.value) }} />
                    <div className="flex justify-center mt-2 w-full">
                        {/*Valida que hay una url*/}
                        {(link && frame) ? (
                            //Modo video
                            <div className="flex flex-col items-center w-full">
                                {/*Cambio a modo imagen*/}
                                <Button>
                                    Imagen
                                </Button>
                                {/*Frame del video*/}
                                <iframe className="w-full" src={link} />
                            </div>
                        ) : (link && !frame) ? (
                            //Modo imagen
                            <div className="flex flex-col items-center w-full">
                                {/*Cambio a modo video*/}
                                <Button>
                                    Video
                                </Button>
                                {/*Imagen*/}
                                <img src={link} className="w-full md:w-1/2" />
                            </div>
                            //Modo vacio
                        ) : <></>}
                    </div>
                </form>
                {/*Boton de publicar*/}
                <form className="flex flex-col w-full items-center" onSubmit={(e) => { e.preventDefault(); publicar() }}>
                    <Button>Publicar</Button>
                </form>
            </div>
            {/*Lista de posts*/}
            <ul className="flex flex-col w-full">
                {publicacion.map((post, idx) => {
                    {/*Verificación de ultimo post*/ }
                    if (idx === publicacion.length - 1) {
                        return (
                            //Ultimo post con su referencia
                            <li ref={lastPostRef} key={post._id} className="mt-4">
                                <form className="grid grid-cols-1 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); borrar(post._id) }}>
                                    {/*Mensaje del post*/}
                                    <span className="col-span-1 text-medium wrap-break-word">{post.mensaje}</span>
                                    {/*Autor del post*/}
                                    <span className="col-span-1 text-medium text-right wrap-break-word">By: {post.nombre}</span>
                                    {/*Interfaz del contenido segun su tipo*/}
                                    {//Post sin url
                                        post.tipo === "vacio" ? <></>
                                            //Post con video
                                            : (post.tipo === "video" ?
                                                <div className="col-span-1 md:col-span-2 w-full md:aspect-6/2">
                                                    {/*Video*/}
                                                    <iframe className="size-full md:col-span-2" src={post.link} />
                                                </div> :
                                                //Post con imagen
                                                <div className="w-full col-span-1 md:col-span-2 flex justify-center">
                                                    {/*Imagen*/}
                                                    <img src={post.link} className="md:w-2/3 h-fit md:aspect-4/2" />
                                                </div>)}
                                    {/*Verificación de creador del post*/}
                                    {user && post.id === user.id ?
                                        //Boton de borrar post
                                        <div className="col-span-1 w-full md:col-span-2">
                                            <Button>Delete</Button>
                                        </div> : <></>}
                                </form>
                            </li>
                        );
                    } else {
                        return (
                            //Posts sin referencia
                            <li key={post._id} className="mt-4">
                                <form className="grid grid-cols-1 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); borrar(post._id) }}>
                                    {/*Mensaje del post*/}
                                    <span className="col-span-1 text-medium wrap-break-word">{post.mensaje}</span>
                                    {/*Autor del post*/}
                                    <span className="col-span-1 text-medium text-right wrap-break-word">By: {post.nombre}</span>
                                    {/*Interfaz del contenido segun su tipo*/}
                                    {//Post sin url
                                        post.tipo === "vacio" ? <></>
                                            //Post con video
                                            : (post.tipo === "video" ?
                                                <div className="col-span-1 md:col-span-2 w-full md:aspect-6/2">
                                                    {/*Video*/}
                                                    <iframe className="size-full md:col-span-2" src={post.link} />
                                                </div> :
                                                //Post con imagen
                                                <div className="w-full col-span-1 md:col-span-2 flex justify-center">
                                                    {/*Imagen*/}
                                                    <img src={post.link} className="md:w-2/3 h-fit md:aspect-4/2" />
                                                </div>)}
                                    {/*Verificación de creador del post*/}
                                    {user && post.id === user.id ?
                                        //Boton de borrar post
                                        <div className="col-span-1 w-full md:col-span-2">
                                            <Button>Delete</Button>
                                        </div> : <></>}
                                </form>
                            </li>
                        );
                    }
                })}
            </ul>

        </div>
    );
}