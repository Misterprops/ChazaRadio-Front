import { useEffect, useState } from "react";

const API = import.meta.env.VITE_APP_API;
const STREAM = import.meta.env.VITE_STREAM_URL;
let cantidad = 4;
type poadcast = {
    nombre: string,
    autores: string,
    capitulo: [{ url: string }],
    cantidad: number
}
export const Emisora_main = () => {
    const [serie, setSerie] = useState("")
    const [autores, setAutores] = useState("")
    const [url, setUrl] = useState("")
    const [poadcasts, setPoadcasts] = useState<poadcast[]>([])

    useEffect(() => {
        const series = async () => {
            try {
                const res = await fetch(`${API}/api/get_poadcast`, {
                    method: "POST"
                });

                const data: Omit<poadcast, "cantidad">[] = await res.json();
                setPoadcasts(data.map(p => ({ ...p, cantidad: cantidad })));
                console.log("Posts", data);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        series();
    }, [])

    const publicar = async () => {
        try {
            const res = await fetch(`${API}/api/upload_poadcast`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: "20232678012",
                    serie: serie,
                    autores: autores,
                    url: url
                })
            });

            const data = await res.json();
            console.log("Post", data);
            window.location.reload()
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const setCapitulos = (index: number) => {
        setPoadcasts(prev =>
            prev.map((p, i) => {
                if (i === index) {
                    const mostrarTodos = p.cantidad === 4; // si estaba mostrando 4 → mostrar todos
                    return {
                        ...p,
                        cantidad: mostrarTodos ? p.capitulo.length : 4
                    };
                }
                return p;
            })
        );
    };

    return (
        <div className="flex flex-col bg-blue-50">
            <div className="flex flex-col items-center w-1/1">
                <audio controls>
                    <source src={STREAM} type="audio/mpeg" />
                </audio>
                <span>Radio powered by Icecast and liquidSoap</span>
                <>▶︎ ▐▐</>
            </div>
            <form className="flex flex-col items-center mt-8 mb-8" onSubmit={(e) => {
                e.preventDefault()
                publicar()
            }}>
                <span className="mb-2">Publica tu nuevo poadcast o un nuevo capitulo</span>
                <label htmlFor="serie">Nombre de la serie</label>
                <input id="serie" required value={serie} onChange={(e) => setSerie(e.target.value)} className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <label htmlFor="autores">Autores</label>
                <input id="autores" required value={autores} onChange={(e) => setAutores(e.target.value)} className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <label htmlFor="url">Url del capitulo</label>
                <input id="url" required value={url} onChange={(e) => setUrl(e.target.value)} className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <button type="submit" className="bg-blue-500 hover:cursor-pointer border h-10 w-1/6 text-white border-black rounded">Publicar</button>
            </form>
            <div className="flex flex-col w-1/1">
                <span>Visita tambien nuestros podcasts</span>
                <div className="flex justify-around">
                    <iframe src="https://www.youtube.com/embed/4sMN6TukqNU" className="w-1/5"></iframe>
                    <iframe src="https://www.youtube.com/embed/4sMN6TukqNU" className="w-1/5"></iframe>
                    <iframe src="https://www.youtube.com/embed/4sMN6TukqNU" className="w-1/5"></iframe>
                </div>
                <ul className="flex flex-col w-1/1">
                    {poadcasts?.map((post, idx) => (
                        <li className="flex w-1/1 flex-col" key={idx}>
                            <div className="flex w-1/1 justify-between">
                                <span>Nombre: {post.nombre}</span>
                                <span>Por: {post.autores}</span>
                            </div>
                            <div className="w-1/1 grid grid-cols-4 ">
                                {post.capitulo?.slice(0, post.cantidad).map((capitulo, cidx) => (
                                    <div key={cidx}>
                                        <iframe src={capitulo.url} className="pl-2 pr-2 w-1/1 mb-2 mt-2" />
                                    </div>
                                ))}
                            </div>
                            {post.capitulo.length > cantidad && (
                                <button className="bg-blue-500 hover:cursor-pointer border h-10 w-1/1 text-white border-black rounded" onClick={() => (setCapitulos(idx))}>{post.cantidad === cantidad ? "Ver más" : "Ver menos"}</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}