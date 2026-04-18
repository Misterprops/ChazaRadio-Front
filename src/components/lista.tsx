import { useRef, useEffect, useState } from "react";
import { Button } from "../elements/button";
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
  //const [indice, setIndice] = useState(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  useEffect(() => {
    const getAudios = async () => {
      try {
        const res = await fetch(`${API}/api/get_audios`, {
          method: "POST"
        });

        const data = await res.json();
        setAudios(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const getLikeList = async () => {
      const res = await fetch(`${API}/api/get_likeList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      setLikes(data)
    }
    getAudios();
    getLikeList();
  }, [])

  const likeControl = async (audio: audio) => {
    const res = await fetch(`${API}/api/like_control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        url: audio.url
      })
    });
    const data = await res.json();
    setLikes(data)
    likeFind(audio.url) ? audio.likes = (parseInt(audio.likes) - 1 + "") : audio.likes = (parseInt(audio.likes) + 1 + "")
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

    /*if (!audio.current) {
      audio.current = new Audio(url);
    }
    !estado ? audio.current.play() : audio.current.pause();
    setEstado(!estado)*/
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
              <form onSubmit={(e) => {e.preventDefault(); handlePlay(audio.url, idx)}}>
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