import { useRef, useEffect, useState } from "react";
import { Button } from "../elements/button";
import { api_borrarAudio, api_getAudios, api_getLikes, api_likeControl } from "../functions/api_calls";
import { useAuth } from "../functions/authContext";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_APP_API;

/**
 * Tipo que define el formato de los audios
 * @typedef {Object} audio
 * @property {string} url - Url de la pista
 * @property {string} titulo - Nombre de la pista
 * @property {string} likes - Cantidad de likes de la pista
 * @property {string} autor - Nombre del autor
 * @property {string} id - Id del creador
 * @property {boolean} enabled - Estatus de la pista
 * @property {string} _id - Id de la pista
 */
type audio = {
  url: string,
  titulo: string,
  likes: string,
  autor: string,
  id: string,
  enabled: boolean,
  _id: string
}

/**
 * Tipo que define el formato de los props
 * @typedef {Object} props
 * @property {number | null} refresh - Indicador para reactivar la obtención de pistas
 */
type props = {
  refresh?: number;
};

/**
 * Lista de reproducción de audios.
 * 
 * @remarks
 * Depende de servicios backend para:
 * - Obtención de audios
 * - Eliminar pistas
 * - Gestionar likes
 * Funcionalidades:
 * - Reproducción secuencial
 * - Gestión de likes
 * - Eliminación de audios propios
 * 
 * @param {{refresh: number}} props - Propiedades del componente
 * @returns {JSX.Element} Componente visual de la lista de audios
 */
export function Lista({ refresh }: props) {
  //Elemento de audio
  const audio = useRef<HTMLAudioElement | null>(null);
  //Listado de audios
  const [audios, setAudios] = useState<audio[]>([]);
  //Listado de likes del usuario
  const [likes, setLikes] = useState([]);
  //Url de la pista sonando actualmente
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  //Credenciales de usuario del authContext
  const { user, token, checkAuth } = useAuth();
  //Hook de redirección
  const navigate = useNavigate();

  /**
   * Hook que se ejecuta al montar el componente y cambiar el estado de refresh
   * Llama a getAudios para obtener la lista de audios
   * Filtra las pistas que no son accesibles desde el backEnd actual
   * Asigna las pistas validas al listado de pistas
   */
  useEffect(() => {
    /**
     * Obtiene lista de pistas desde backend.
     * 
     * @internal
     * @returns {Promise<void>}
     */
    const getAudios = async () => {
      try {
        //Obtiene las pistas
        const res = await api_getAudios();
        const data = await res.json();
        //Verifica si hay errores en el back
        if (!res.ok) {
          return alert(data.error || "Error al obtener los poadcasts");
        }
        //Guarda las pistas que esten en esa url
        setAudios(data.filter((pista: audio) =>
          pista.url.includes(API)
        ));
      } catch (error) {
        alert("Error al generar audios");
      }
    }
    //Llama la función para obtener las pistas
    getAudios();
  }, [refresh])

  /**
   * Hook que se ejecuta al montar el componente y al tener un token activo
   * Llama a getLikeList para obtener la lista de likes del usuario
   * Asigna los likes al listado de likes del usuario
   */
  useEffect(() => {
    /**
     * Obtiene lista de likes del usuario desde backend.
     * 
     * @internal
     * @returns {Promise<void>}
     */
    const getLikeList = async () => {
      try {
        //Verifica que el token este activo
        if (token && await checkAuth()) {
          //Llama a la API para obtener los likes del usuario
          const res = await api_getLikes(token);
          const data = await res.json();
          if (!res.ok) {
            //Si la respuesta no es correcta, avisa al usuario
            return alert(data.error || "Error al publicar");
          }
          //Guarda los likes del usuario
          setLikes(data)
        }
      } catch (error) {
        alert("Error al obtener los likes");
      }
    }
    //Llama la función para obtener los likes
    getLikeList();
  }, [token])

  /**
   * Alterna el estado de like de un audio.
   *
   * @param {audio} audio - Audio objetivo
   * @internal
   * @returns {Promise<void>}
   */
  const likeControl = async (audio: audio) => {
    try {
      //Verifica la sesion del usuario
      if (token && await checkAuth()) {
        //Registra el cambio del like
        const res = await api_likeControl(token, audio.url);
        const data = await res.json();
        //Verifica si hay errores en el back
        if (!res.ok) {
          return alert(data.error || "Error al obtener los poadcasts");
        }
        //Actualiza el listado de likes del usuario
        setLikes(data)
        //Verifica si fue like o dislike
        likeFind(audio.url) ? audio.likes = (parseInt(audio.likes) - 1 + "") : audio.likes = (parseInt(audio.likes) + 1 + "")
      } else {
        //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
        alert("Error al obtener el usuario")
        navigate("/Login")
      }
    } catch (error) {
      alert("Error al registrar el cambio del like");
    }
  }

  /**
   * Verifica si audio tiene like del usuario.
   * 
   * @param {string} url
   * @internal
   * @returns {string | null}
   */
  const likeFind = (url: String) => {
    //Devuelve la url de la pista si esta tiene like
    return likes.find(link => link === url);
  }

  /**
   * Controla reproducción de audios.
   * 
   * @param {string} url - URL del audio
   * @param {number} index - Posición en la lista
   * @remarks
   * Implementa reproducción continua automática.
   * @internal
   * @returns {void}
   */
  const handlePlay = (url: audio["url"], index: number) => {
    //Verifica que la pista no sea la que esta sonando y su url es valido
    if (!audio.current || !audio.current.src.includes(encodeURI(url))) {
      // Si cambia de audio, detener el anterior
      if (audio.current) {
        audio.current.pause();
        //Reinicia el tiempo de la pista
        audio.current.currentTime = 0;
        //Libera el espacio del audio actual
        audio.current.onended = null;
      }
      //Asigna al audio actual, el nuevo url
      audio.current = new Audio(url);
      //Si la pista acaba
      audio.current.onended = () => {
        //Si la pista actual no es la ultima
        if ((index + 1) < audios.length) {
          //Se llama a si mismo para asignar la siguiente pista
          handlePlay(audios[(index + 1)]["url"], (index + 1));
        } else {
          //Se llama a si mismo para asignar la primera pista
          handlePlay(audios[0]["url"], (0)); // fin de la lista
        }
      };
      //Reproduce la pista actual
      audio.current.play();
      //Guarda la url de la pista en reproducción
      setPlayingUrl(url);
    } else {
      if (audio.current.paused) {
        //Si esta pausada la pista, continua su reproducción
        audio.current.play();
        //Guarda la url de la pista en reproducción
        setPlayingUrl(url);
      } else {
        //Si esta reproduciendose, pausa su reproducción
        audio.current.pause();
        //Elimina la url de la pista en reproducción
        setPlayingUrl(null);
      }
    }
  };

  /**
   * Elimina audio del usuario.
   * 
   * @param {string} id
   * @remarks
   * - Deshabilita la pista.
   * @internal
   * @returns {Promise<void>}
   */
  const borrar = async (id: string) => {
    try {
      //Verifica la sesion del usuario
      if (token && await checkAuth()) {
        //Deshabilita la pista
        const res = await api_borrarAudio(token, id);
        const data = await res.json()
        //Si la respuesta es correcta, avisa al usuario y vacia los campos
        if (res.ok) {
          alert(data.msg || "Audio borrado");
          setAudios(prev => prev.filter(audio => audio._id !== id));
        } else {
          //Si la respuesta no es correcta, avisa al usuario
          alert(data.error || "Error al borrar el audio");
        }
      } else {
        //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
        alert("Error al obtener el usuario")
        navigate("/Login")
      }
    } catch (error) {
      alert("Error al eliminar la pista");
    }
  }

  //Interfaz de la lista
  return (
    <div className="flex items-center w-full pl-4 pr-4 flex-col">
      <span className="text-xl font-bold mb-2">Audios guardados</span>
      {/*Lista de pistas*/}
      <ul className="w-full space-y-2">
        {audios.map((audio, idx) => (
          //Interfaz de las pistas
          <li key={audio._id} className="flex items-center justify-between border p-2 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              {/*Titulo de la pista*/}
              <span className="md:col-span-2 text-center w-full wrap-break-word">{audio.titulo}</span>
              {/*Autor de la pista*/}
              <span className="md:col-span-2 text-end w-full wrap-break-word">Por: {audio.autor}</span>
              {/*Boton de likes*/}
              <button className={likeFind(audio.url) ? "bg-red-400 h-10 mb-1 mt-1" : "bg-green-400 h-10 mb-1 mt-1"} onClick={() => likeControl(audio)}>{audio.likes + " Likes"} </button>
              {/*Boton de reproducción de audio*/}
              <form onSubmit={(e) => { e.preventDefault(); handlePlay(audio.url, idx) }}>
                <Button>
                  {playingUrl === audio.url ? '⏸️ Pausar' : '▶️ Reproducir'}
                </Button>
              </form>
              {/*Boton de borrar (Solo el creador del audio)*/}
              {audio.id === user?.id &&
                <form className="md:col-span-2" onSubmit={(e) => { e.preventDefault(); borrar(audio._id) }}>
                  <Button>Delete</Button>
                </form>
              }
            </div>
          </li>
        ))}
      </ul>
    </div >
  );

}