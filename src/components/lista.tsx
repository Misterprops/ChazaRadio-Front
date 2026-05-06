import { useRef, useEffect, useState } from "react";
import { Button } from "../elements/button";
import { api_borrarAudio, api_getAudios, api_getLikes, api_likeControl } from "../functions/api_calls";
import { useAuth } from "./authContext";
const API = import.meta.env.VITE_APP_API;

type audio = {
  url: string,
  titulo: string,
  likes: string,
  autor: string,
  id: string,
  enabled: boolean,
  _id: string
}

type props = {
  refresh?: number;
};

/**
 * Lista de reproducción de audios.
 * 
 * Funcionalidades:
 * - Reproducción secuencial
 * - Likes/unlikes
 * - Eliminación de audios propios
 * 
 * @component
 * @param {{refresh: number}} props
 * @returns {JSX.Element}
 */
export function Lista({ refresh }: props) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [audios, setAudios] = useState<audio[]>([]);
  const [likes, setLikes] = useState([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const { user, token, checkAuth } = useAuth();

  useEffect(() => {
    const getAudios = async () => {
      try {
        const res = await api_getAudios();
        const data = await res.json();

        setAudios(data.filter((pista: audio) =>
          pista.url.includes(API)
        ));
      } catch (error) {
        alert("Error al generar audios");
      }
    }
    getAudios();
  }, [refresh])

  useEffect(() => {
    const getLikeList = async () => {
      try {
        if (!token) return;
        const res = await api_getLikes(token);
        const data = await res.json();
        setLikes(data)

      } catch (error) {
        alert("Error al obtener los likes");
      }
    }
    getLikeList();
  }, [token])

  /**
   * Controla like/unlike de audio.
   * 
   * @param {Object} audio
   * @returns {Promise<void>}
   */
  const likeControl = async (audio: audio) => {
    if (token) {
      const res = await api_likeControl(token, audio.url);
      const data = await res.json();
      setLikes(data)
      likeFind(audio.url) ? audio.likes = (parseInt(audio.likes) - 1 + "") : audio.likes = (parseInt(audio.likes) + 1 + "")
    } else {
      alert("Error al obtener el usuario")
    }
  }

  /**
   * Verifica si audio tiene like del usuario.
   * 
   * @param {string} url
   * @returns {boolean}
   */
  const likeFind = (url: String) => {
    console.log(likes)
    return likes.find(link => link === url);
  }

  /**
   * Controla reproducción de audios.
   * 
   * @param {string} url
   * @param {number} index
   * @returns {void}
   */
  const handlePlay = (url: audio["url"], index: number) => {
    if (!audio.current || !audio.current.src.includes(encodeURI(url))) {
      // Si cambia de audio, detener el anterior
      if (audio.current) {
        audio.current.pause();
        audio.current.currentTime = 0;
        audio.current.onended = null;
      }
      audio.current = new Audio(url);
      audio.current.onended = () => {
        if ((index + 1) < audios.length) {
          handlePlay(audios[(index + 1)]["url"], (index + 1));
        } else {
          handlePlay(audios[0]["url"], (0)); // fin de la lista
        }
      };
      audio.current.play();
      //setIndice(index)
      setPlayingUrl(url);
    } else {
      // Si es el mismo, alternar reproducción
      if (audio.current.paused) {
        audio.current.play();
        setPlayingUrl(url);
      } else {
        audio.current.pause();
        setPlayingUrl(null);
      }
    }
  };

  /**
   * Elimina audio del usuario.
   * 
   * @param {string} id
   * @returns {Promise<void>}
   */
  const borrar = async (id: string) => {
    if (token && await checkAuth()) {
      const res = await api_borrarAudio(token, id);
      if (res.ok) {
        alert("Audio borrado");
        setAudios(prev => prev.filter(audio => audio._id !== id));
      } else {
        alert("Error al borrar el audio");
      }
    }
  }

  return (
    <div className="flex items-center w-full pl-4 pr-4 flex-col">
      <span className="text-xl font-bold mb-2">Audios guardados</span>
      <ul className="w-full space-y-2">
        {audios.map((audio, idx) => (
          <li key={audio._id} className="flex items-center justify-between border p-2 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              <span className="md:col-span-2 text-center w-full wrap-break-word">{audio.titulo}</span>
              <span className="md:col-span-2 text-end w-full wrap-break-word">Por: {audio.autor}</span>
              <button className={likeFind(audio.url) ? "bg-red-400 h-10 mb-1 mt-1" : "bg-green-400 h-10 mb-1 mt-1"} onClick={() => likeControl(audio)}>{audio.likes + " Likes"} </button>
              <form onSubmit={(e) => { e.preventDefault(); handlePlay(audio.url, idx) }}>
                <Button>
                  {playingUrl === audio.url ? '⏸️ Pausar' : '▶️ Reproducir'}
                </Button>
              </form>
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