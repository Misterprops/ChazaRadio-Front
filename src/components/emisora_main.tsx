import { useEffect, useState } from "react";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import { useAuth } from "./authContext";
import { api_poadcasts, api_publicarPoadcast } from "../functions/api_calls";

const STREAM = import.meta.env.VITE_STREAM_URL;

type poadcast = {
    id: string,
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
    const { user, token, checkAuth } = useAuth();
    const [cantidad, setCantidad] = useState(4);

    useEffect(() => {
        series()
    }, [])

    const series = async () => {
        const data: Omit<poadcast, "cantidad">[] = await api_poadcasts();
        const lista = data.map(p => ({ ...p, cantidad: cantidad }));
        setPoadcasts(lista);
    }

    const publicar = async () => {
        try {
            if (await checkAuth() && token) {
                const res = await api_publicarPoadcast(serie, autores, url, token)
                if (res.ok) {
                    alert("Capitulo publicado");
                    series();
                } else {
                    alert("Error al publicar");
                }
            } else {
                alert("Sesion caducada");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const setCapitulos = (index: number) => {
        setPoadcasts(prev =>
            prev.map((p, i) => {
                if (i === index) {
                    const mostrarTodos = p.cantidad === cantidad; // si estaba mostrando 4 → mostrar todos
                    return {
                        ...p,
                        cantidad: mostrarTodos ? p.capitulo.length : cantidad
                    };
                }
                return p;
            })
        );
    };

    return (
        <div className="flex flex-col bg-blue-50 items-center">
            <div className="flex flex-col items-center w-1/6">
                <audio controls>
                    <source src={STREAM} type="audio/mpeg" />
                </audio>
                <span>Radio powered by Icecast and liquidSoap</span>
                <>▶︎ ▐▐</>
            </div>
            {user && (
                <form className="flex flex-col items-center mt-8 mb-8 w-1/6" onSubmit={(e) => {
                    e.preventDefault()
                    publicar()
                }}>
                    <span className="mb-2">Publica tu nuevo poadcast o un nuevo capitulo</span>
                    <label htmlFor="serie">Nombre de la serie</label>
                    <Input type="text" id="serie" required value={serie} change={setSerie} />
                    <label htmlFor="autores">Autores</label>
                    <Input type="text" id="autores" required value={autores} change={setAutores} />
                    <label htmlFor="url">Url del capitulo</label>
                    <Input type="text" id="url" required value={url} change={setUrl} />
                    <Button>Publicar</Button>
                </form>
            )}
            <div className="flex flex-col w-1/1">
                <div className="w-1/1 flex justify-center">
                    <span>Visita tambien nuestros podcasts</span>
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
                                <form onSubmit={(e) => { e.preventDefault(); setCapitulos(idx) }} className="flex justify-center w-1/1">
                                    <Button>{post.cantidad === cantidad ? "Ver más" : "Ver menos"}</Button>
                                </form>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}