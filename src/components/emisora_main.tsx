import { useEffect, useState } from "react";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import { useAuth } from "../functions/authContext";
import { api_poadcasts, api_publicarPoadcast } from "../functions/api_calls";
import { Label } from "../elements/label";
import { useNavigate } from "react-router";

const STREAM = import.meta.env.VITE_STREAM_URL;

/**
 * Tipo que define el formato de los poadcasts
 * @typedef {Object} poadcast
 * @property {string} id - Id del creador
 * @property {string} nombre - Nombre de la serie
 * @property {string} autores - Nombre de los autores
 * @property {[{ url: string }]} capitulo - Url del capitulo
 * @property {number} cantidad - Cantidad de capitulos a mostrar
 */
type poadcast = {
    id: string,
    nombre: string,
    autores: string,
    capitulo: [{ url: string }],
    cantidad: number
}

/**
 * Vista principal de la emisora.
 * 
 * @remarks
 * Depende de servicios backend para:
 * - Obtención de podcasts
 * - Publicación de contenido
 * Funcionalidades:
 * - Reproducción de stream en vivo (Icecast)
 * - Publicación de podcasts
 * - Visualización de series y capítulos
 * 
 * @returns {JSX.Element} Componente visual de la emisora
 */
export const Emisora_main = () => {
    //Nombre de la serie
    const [serie, setSerie] = useState("")
    //Autores de la serie
    const [autores, setAutores] = useState("")
    //Url del capitulo
    const [url, setUrl] = useState("")
    //Listado de poadcasts
    const [poadcasts, setPoadcasts] = useState<poadcast[]>([])
    //Credenciales de usuario del authContext
    const { user, token, checkAuth } = useAuth();
    //Cantidad de capitulos a mostrar
    const [cantidad, setCantidad] = useState(4);
    //Marcador para mostrar todos los capitulos de un poadcast
    const [expandido, setExpandido] = useState<number | null>(null);
    //Hook de redirección
    const navigate = useNavigate();

    /**
     * Hook que se ejecuta al montar el componente
     * Llama a series y verifica el tamaño de la pantalla para acomodar el contenido
     */
    useEffect(() => {
        //Obtiene todos los poadcasts
        series()
        /**
         * Obtiene el ancho de la pantalla del dispositivo
         * 
         * @internal
         * @returns {void}
         */
        const updateCantidad = () => {
            //Si son pantallas medianas, deja 4 capitulos por poadcast
            //Si son pequeñas, deja 2 capitulos por poadcast
            setCantidad(window.innerWidth >= 768 ? 4 : 2);
        };
        updateCantidad();
        //Genera un eventListener en caso de que la pantalla cambie de tamaño
        window.addEventListener("resize", updateCantidad);
        //Remueve el eventListener una vez revisado el tamaño de la pantalla
        return () => window.removeEventListener("resize", updateCantidad);
    }, [])

    /**
     * Obtiene lista de podcasts desde backend.
     * 
     * @internal
     * @returns {Promise<void>}
     */
    const series = async () => {
        try {
            //Obtiene los poadcasts disponibles
            const res = await api_poadcasts();
            const data = await res.json()
            //Verifica si hay errores en el back
            if (!res.ok) {
                return alert(data.error || "Error al obtener los poadcasts");
            }
            //Guarda los poadcasts
            setPoadcasts(data);
        } catch (error) {
            alert("Error al obtener los poadcasts")
        }
    }

    /**
     * Verifica que sea una url valida de youtube
     * 
     * @param {string} url - url a comprobar
     * @internal
     * @returns {boolean}
     */
    const isValidURL = (url: string) => {
        try {
            //Verifica si es una URL
            new URL(url);
            //Verifica si la URL es de youtube
            if (url.includes("youtube") || url.includes("youtu.be")) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    };

    /**
     * Verifica que el tamaño del texto sea menor a 500 caracteres
     * 
     * @param {string} texto - texto a comprobar
     * @internal
     * @returns {boolean}
     */
    const maxLength = (texto: string) => {
        return texto.length > 500 ? false : true
    }

    /**
     * Publica un nuevo capítulo o serie.
     * 
     * @remarks
     * - Requiere autenticación.
     * - Hace validaciones del contenido antes de publicarlo
     * 
     * @returns {Promise<void>}
     * @internal
     */
    const publicar = async () => {
        //Verifica que el url sea valido
        if (isValidURL(url)) {
            //Verifica la cantidad de caracteres de cada campo
            if (maxLength(serie) && maxLength(autores) && maxLength(url)) {
                try {
                    //Verifica que el usuario este activo
                    if (await checkAuth() && token) {
                        //Llama la API para subir el poadcast
                        const res = await api_publicarPoadcast(serie, autores, url, token)
                        const data = await res.json()
                        //Si la respuesta es correcta, avisa al usuario y vacia los campos
                        if (res.ok) {
                            alert(data.msg || "Capitulo publicado");
                            setSerie("")
                            setAutores("")
                            setUrl("")
                            series();
                        } else {
                            //Si la respuesta no es correcta, avisa al usuario
                            alert(data.error || "Error al publicar");
                        }
                    } else {
                        //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
                        alert("Sesion caducada");
                        navigate("/Login")
                    }
                } catch (error) {
                    alert("Error al publicar");
                }
            } else {
                alert("Se excedio el maximo de caracteres")
            }
        } else {
            alert("El url no es valido")
        }
    }

    //Interfaz de la emisora
    return (
        <main className='flex justify-center pt-4 pb-4 flex-1 items-center bg-blue-50 w-full'>
            <div className="flex flex-col items-center w-full ml-2 mr-2 space-y-8">
                {/*Reproductor de la emisora*/}
                <div className="flex flex-col items-center h-1/5 md:w-1/3">
                    <audio controls>
                        <source src={STREAM} type="audio/mpeg" />
                    </audio>
                    <span className='text-lg'>Radio powered by Icecast and liquidSoap</span>
                    <>▶︎ ▐▐</>
                </div>
                {/*Verifica la sesión del usuario para permitirle subir poadcasts*/}
                {user && (
                    //Formulario para publicar poadcasts
                    <form className="flex flex-col items-center mt-8 mb-8 w-full md:w-1/4 space-y-2" onSubmit={(e) => {
                        e.preventDefault()
                        publicar()
                    }}>
                        <span className="text-lg">Publica tu nuevo poadcast o un nuevo capitulo</span>
                        <Label htmlFor="serie">Nombre de la serie</Label>
                        <Input type="text" id="serie" required value={serie} change={setSerie} />
                        <Label htmlFor="autores">Autores</Label>
                        <Input type="text" id="autores" required value={autores} change={setAutores} />
                        <Label htmlFor="url">Url del capitulo</Label>
                        <Input type="text" id="url" required value={url} change={setUrl} />
                        <Button>Publicar</Button>
                    </form>
                )}
                <div className="flex flex-col w-full space-y-2">
                    <div className="w-full flex justify-center">
                        <span className="text-lg">Visita tambien nuestros podcasts</span>
                    </div>
                    <ul className="flex flex-col w-full space-y-2">
                        {/*Listado de poadcasts*/}
                        {poadcasts?.map((post, idx) => {
                            //Identifica la cantidad de capitulos que debe mostrar cada poadcast
                            const cantidadFinal = expandido === idx ? post.capitulo.length : cantidad;
                            //Interfaz del listado de capitulos por poadcast
                            return (
                                <li className="flex w-full flex-col" key={idx}>
                                    {/*Autores y nombre del poadcast*/}
                                    <div className="flex w-1/1 justify-between">
                                        <span className="text-medium md:text-lg">Nombre: {post.nombre}</span>
                                        <span className="text-medium md:text-lg">Por: {post.autores}</span>
                                    </div>
                                    {/*Listado de capitulos*/}
                                    <div className="w-full grid grid-cols-1 md:grid-cols-4 ">
                                        {/*Corta la lista para mostrar desde el primero hasta el limite*/}
                                        {post.capitulo?.slice(0, cantidadFinal).map((capitulo, cidx) => (
                                            //Muestra el capitulo
                                            <div key={cidx}>
                                                <iframe src={capitulo.url} className="pl-2 pr-2 w-full mb-2 mt-2" />
                                            </div>
                                        ))}
                                    </div>
                                    {/*Verifica si el poadcast tiene menos capitulos que los que muestra por default*/}
                                    {post.capitulo.length > cantidad && (
                                        //De ser asi, genera un boton que da la posibilidad de mostrar u ocultar los demas capitulos
                                        <form onSubmit={(e) => { e.preventDefault(); setExpandido(prev => prev === idx ? null : idx) }} className="flex justify-center w-full">
                                            {/*Si la lista no esta expandida, agrega su id al atributo de expandidos para expandirlo
                                            En caso de estar expandido, elimina el id del atributo*/}
                                            <Button>{expandido !== idx ? "Ver más" : "Ver menos"}</Button>
                                        </form>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </main>
    );
}