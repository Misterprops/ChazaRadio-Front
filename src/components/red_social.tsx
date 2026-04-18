
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../elements/button";

const API = import.meta.env.VITE_APP_API;

type props = {
    user: string;
};

type post = {
    mensaje: string,
    link: string,
    nombre: string,
    tipo: string
}

export function Red_social(props: props) {
    const didFetch = useRef(false);
    const [mensaje, setMensaje] = useState("");
    const [link, setLink] = useState("");
    const [publicacion, setPublicion] = useState<post[]>([])
    const [frame, setFrame] = useState(false)
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchPosts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const res = await fetch(`${API}/api/get_posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: page
            })
        });
        const data: post[] = await res.json();

        if (data.length === 0) {
            setHasMore(false);
        } else {
            setPublicion(prev => [...prev, ...data]); // 🔥 concatena
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

    const publicar = async () => {
        try {
            const res = await fetch(`${API}/api/upload_post`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: "20232678012",
                    mensaje: mensaje,
                    link: link,
                    nombre: props.user
                })
            });

            const data = await res.json();
            console.log("Post", data);
            window.location.reload()
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="flex items-center w-1/1 h-1/1 border-r-2 border-l-2 flex-col">

            {props ?
                <div className="flex w-9/10 justify-end">
                    <span className="text-sm">{props.user}</span>
                </div>
                :
                <div className="flex w-9/10 justify-end">
                    <span className="text-sm">Name</span>
                </div>
            }

            <div className="grid w-9/10">
                <form className="flex flex-col w-1/1 items-center" onSubmit={(e) => { e.preventDefault(); setFrame(!frame) }}>
                    <textarea className="bg-fuchsia-300 w-1/1 mb-2 resize-none" rows={5} placeholder="Escribe tu mensaje" value={mensaje} onChange={(e) => { setMensaje(e.target.value) }} />
                    <textarea className="bg-fuchsia-300 w-1/1 mb-2 resize-none" rows={2} placeholder="Comparte tu contenido" value={link} onChange={(e) => { setLink(e.target.value) }} />
                    <div className="flex justify-center mt-2 w-1/1">
                        {(link && frame) ? (
                            <div className="flex flex-col items-center w-1/1">
                                <Button>
                                    Imagen
                                </Button>
                                <iframe className="w-1/1" src={link} />
                            </div>
                        ) : (link && !frame) ? (
                            <div className="flex flex-col items-center w-1/1">
                                <Button>
                                    Video
                                </Button>
                                <img src={link} className="w-1/2" />
                            </div>
                        ) : <img />}
                    </div>
                </form>
                <form className="flex flex-col w-1/1 items-center" onSubmit={(e) => { e.preventDefault(); publicar() }}>
                    <Button>Publicar</Button>
                </form>
            </div>
            <ul className="flex flex-col w-9/10">
                <li>
                    <div className="grid grid-cols-2">
                        <span>Mira esta cancion ❤️</span>
                        <span className="text-right">By: Misterprops</span>
                        <iframe className="size-full col-span-2" src="https://www.youtube.com/embed/TW9d8vYrVFQ"></iframe>
                    </div>
                </li>
                {publicacion.map((post, idx) => {
                    if (idx === publicacion.length - 1) {
                        return (
                            <li ref={lastPostRef} key={idx} className="mt-4">
                                <div className="grid grid-cols-2">
                                    <span>{post.mensaje}</span>
                                    <span className="text-right">By: {post.nombre}</span>
                                    {post.tipo === "vacio" ? <></> : (post.tipo === "video" ? <div className="col-span-2 w-full aspect-5/2"> <iframe className="size-full col-span-2" src={post.link} /></div> : <div className="size-full col-span-2 flex justify-center h-1/2"><img src={post.link} className="w-2/3 h-fit aspect-3/2" /></div>)}
                                </div>
                            </li>
                        );
                    } else {
                        return (
                            <li key={idx} className="mt-4">
                                <div className="grid grid-cols-2">
                                    <span>{post.mensaje}</span>
                                    <span className="text-right">By: {post.nombre}</span>
                                    {post.tipo === "vacio" ? <></> : (post.tipo === "video" ? <div className="col-span-2 w-full aspect-5/2"> <iframe className="size-full col-span-2" src={post.link} /></div> : <div className="size-full col-span-2 flex justify-center h-1/2"><img src={post.link} className="w-2/3 h-fit aspect-3/2" /></div>)}
                                </div>
                            </li>
                        );
                    }
                })}
            </ul>

        </div>
    );
}