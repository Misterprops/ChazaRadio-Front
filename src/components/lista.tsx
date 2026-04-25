import { useRef, useEffect, useState } from "react";
import { Button } from "../elements/button";
import { api_getAudios, api_getLikes, api_likeControl } from "../functions/api_calls";
import { useAuth } from "./authContext";
const API = import.meta.env.VITE_APP_API;

type audio = {
  url: string,
  titulo: string,
  likes: string,
  autor: string
}

export function Lista() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [audios, setAudios] = useState<audio[]>([]);
  const [likes, setLikes] = useState([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const { token } = useAuth();

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
    getAudios();
    getLikeList();
  }, [token])

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

  const likeFind = (url: String) => {
    return likes.find(link => link === url);
  }

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Audios guardados</h2>
      <ul className="space-y-2">
        {audios.map((audio, idx) => (
          <li key={idx} className="flex items-center justify-between border p-2 rounded">
            <div className="grid grid-cols-2 w-1/1">
              <span className="col-span-2 text-center">{audio.titulo}</span>
              <span className="col-span-2 text-end">Por: {audio.autor}</span>
              <button className={likeFind(audio.url) ? "bg-red-400 mb-1 mt-1" : "bg-green-400 mb-1 mt-1"} onClick={() => likeControl(audio)}>{audio.likes + " Likes"} </button>
              <form onSubmit={(e) => { e.preventDefault(); handlePlay(audio.url, idx) }}>
                <Button>
                  {playingUrl === audio.url ? '⏸️ Pausar' : '▶️ Reproducir'}
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div >
  );

}