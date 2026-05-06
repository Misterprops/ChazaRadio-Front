import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../elements/button";
import { useAuth } from "./authContext";
import { api_borrarPost, api_getPosts, api_uploadPost } from "../functions/api_calls";

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
 * Componente de publicaciones (feed).
 * 
 * Funcionalidades:
 * - Crear posts
 * - Mostrar posts paginados
 * - Carga infinita (IntersectionObserver)
 * - Eliminar posts
 * 
 * @component
 * @returns {JSX.Element}
 */
export function Red_social() {
    const didFetch = useRef(false);
    const [mensaje, setMensaje] = useState("");
    const [link, setLink] = useState("");
    const [publicacion, setPublicion] = useState<post[]>([])
    const [frame, setFrame] = useState(false)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const { user, token, checkAuth } = useAuth();

    /**
     * Obtiene posts desde backend con paginación.
     * 
     * @async
     * @function fetchPosts
     * @returns {Promise<void>}
     */
    const fetchPosts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const res = await api_getPosts(page);
        const data = await res.json();
        const post: post[] = data.filter((post: post) => post.enabled);

        if (data.length === 0) {
            setHasMore(false);
        } else {
            setPublicion(prev => [...prev, ...post]); // 🔥 concatena
            setPage(prev => prev + 1);
        }

        setLoading(false);
    };

    const lastPostRef = useCallback((node: HTMLLIElement | null) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchPosts();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        fetchPosts();
    }, []);

    const isValidURL = (url: string) => {
        try {
            new URL(url);
            if ((url.includes("youtube") || url.includes("youtu.be")) || frame) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    };

    const maxLength = (texto: string) => {
        return texto.length > 500 ? false : true
    }

    /**
     * Publica un nuevo post.
     * 
     * @async
     * @returns {Promise<void>}
     */
    const publicar = async () => {
        if (maxLength(mensaje) || maxLength(link)) {
            if (isValidURL(link)) {
                try {
                    if (token && await checkAuth()) {
                        const res = await api_uploadPost(mensaje, link, token)
                        if (res.ok) {
                            alert("Post publicado");
                            setMensaje("");
                            setLink("")
                        } else {
                            alert("Error al publicar el post");
                        }
                    } else {
                        alert("Error de autenticacion")
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            } else {
                alert("El url no es valido")
            }
        } else {
            alert("Se excedio el maximo de caracteres")
        }
    }

    /**
     * Elimina un post del usuario.
     * 
     * @param {string} postId
     * @returns {Promise<void>}
     */
    const borrar = async (postId: string) => {
        if (token && await checkAuth()) {
            const res = await api_borrarPost(token, postId);
            if (res.ok) {
                alert("Post borrado");
                setPublicion(prev => prev.filter(post => post._id !== postId));
            } else {
                alert("Error al borrar el post");
            }
        }
    }

    return (
        <div className="flex items-center w-full pl-4 pr-4 justify-center flex-col">

            {user ?
                <div className="flex w-full justify-end">
                    <span className="text-medium wrap-break-word">{user.nombre}</span>
                </div>
                :
                <div className="flex w-full justify-end">
                    <span className="text-medium wrap-break-word">Name</span>
                </div>
            }

            <div className="w-full">
                <form className="flex flex-col w-full items-center" onSubmit={(e) => { e.preventDefault(); setFrame(!frame) }}>
                    <textarea className="bg-fuchsia-300 w-full mb-2 resize-none" maxLength={500} rows={5} placeholder="Escribe tu mensaje" value={mensaje} onChange={(e) => { setMensaje(e.target.value) }} />
                    <textarea className="bg-fuchsia-300 w-full mb-2 resize-none" maxLength={500} rows={2} placeholder="Comparte tu contenido" value={link} onChange={(e) => { setLink(e.target.value) }} />
                    <div className="flex justify-center mt-2 w-full">
                        {(link && frame) ? (
                            <div className="flex flex-col items-center w-full">
                                <Button>
                                    Imagen
                                </Button>
                                <iframe className="w-full" src={link} />
                            </div>
                        ) : (link && !frame) ? (
                            <div className="flex flex-col items-center w-full">
                                <Button>
                                    Video
                                </Button>
                                <img src={link} className="w-full md:w-1/2" />
                            </div>
                        ) : <img />}
                    </div>
                </form>
                <form className="flex flex-col w-full items-center" onSubmit={(e) => { e.preventDefault(); publicar() }}>
                    <Button>Publicar</Button>
                </form>
            </div>
            <ul className="flex flex-col w-full">
                {publicacion.map((post, idx) => {
                    if (idx === publicacion.length - 1) {
                        return (
                            <li ref={lastPostRef} key={post._id} className="mt-4">
                                <form className="grid grid-cols-1 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); borrar(post._id) }}>
                                    <span className="col-span-1 text-medium wrap-break-word">{post.mensaje}</span>
                                    <span className="col-span-1 text-medium text-right wrap-break-word">By: {post.nombre}</span>
                                    {post.tipo === "vacio" ? <></> : (post.tipo === "video" ?
                                        <div className="col-span-1 md:col-span-2 w-full md:aspect-6/2">
                                            <iframe className="size-full md:col-span-2" src={post.link} />
                                        </div> :
                                        <div className="w-full col-span-1 md:col-span-2 flex justify-center">
                                            <img src={post.link} className="md:w-2/3 h-fit md:aspect-4/2" />
                                        </div>)}
                                    {user && post.id === user.id ?
                                        <div className="col-span-1 w-full md:col-span-2">
                                            <Button>Delete</Button>
                                        </div> : <></>}
                                </form>
                            </li>
                        );
                    } else {
                        return (
                            <li key={post._id} className="mt-4">
                                <form className="grid grid-cols-1 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); borrar(post._id) }}>
                                    <span className="col-span-1 text-medium wrap-break-word">{post.mensaje}</span>
                                    <span className="col-span-1 text-medium text-right wrap-break-word">By: {post.nombre}</span>
                                    {post.tipo === "vacio" ? <></> : (post.tipo === "video" ?
                                        <div className="col-span-1 md:col-span-2 w-full md:aspect-6/2">
                                            <iframe className="size-full md:col-span-2" src={post.link} />
                                        </div> :
                                        <div className="w-full col-span-1 md:col-span-2 flex justify-center">
                                            <img src={post.link} className="md:w-2/3 h-fit md:aspect-4/2" />
                                        </div>)}
                                    {user && post.id === user.id ?
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