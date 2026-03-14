
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_APP_API;

type props = {
    user: string;
};

type post = {
    mensaje: string,
    link: string,
    nombre: string
}

export function Red_social(props: props) {

    const [mensaje, setMensaje] = useState("");
    const [link, setLink] = useState("");
    const [publicacion, setPublicion] = useState<post[] | null>([])
    const [frame, setFrame] = useState(false)

    useEffect(() => {
        const publicaciones = async () => {
            try {
                const res = await fetch(`${API}/api/get_posts`, {
                    method: "POST"
                });

                const data = await res.json();
                console.log("Posts", data);
                setPublicion(data);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        publicaciones();
    }, [])

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
                <textarea className="bg-fuchsia-300 w-1/1 mb-2 resize-none" rows={5} placeholder="Escribe tu mensaje" value={mensaje} onChange={(e) => { setMensaje(e.target.value) }} />
                <textarea className="bg-fuchsia-300 w-1/1 mb-2 resize-none" rows={2} placeholder="Comparte tu contenido" value={link} onChange={(e) => { setLink(e.target.value) }} />
                <div className="flex justify-center mt-2">
                    {(link && frame) ? (
                        <div className="flex flex-col items-center w-1/1">
                            <button className="bg-blue-500 hover:cursor-pointer border h-10 w-1/1 mb-2 text-white border-black rounded" onClick={() => setFrame(false)}>Imagen</button>
                            <iframe className="w-1/1" src={link} />
                        </div>
                    ) : (link && !frame) ? (
                        <div className="flex flex-col items-center">
                            <button className="bg-blue-500 hover:cursor-pointer border h-10 w-1/1 mb-2 text-white border-black rounded" onClick={() => setFrame(true)}>Video</button>
                            <img src={link} className="w-1/2" />
                        </div>
                    ) : <img />}
                </div>
                <button className="bg-blue-500 hover:cursor-pointer border h-10 w-1/1 mt-4 text-white border-black rounded" onClick={() => publicar()}>Publicar</button>
            </div>
            <ul className="flex flex-col w-9/10">
                <li>
                    <div className="grid grid-cols-2">
                        <span>Mira esta cancion ❤️</span>
                        <span className="text-right">By: Misterprops</span>
                        <iframe className="size-full col-span-2" src="https://www.youtube.com/embed/TW9d8vYrVFQ"></iframe>
                    </div>
                </li>
                {publicacion?.map((post, idx) => (
                    <li key={idx}>
                        <div className="grid grid-cols-2">
                            <span>{post.mensaje}</span>
                            <span className="text-right">By: {post.nombre}</span>
                            <iframe className="size-full col-span-2" src={post.link}></iframe>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
}