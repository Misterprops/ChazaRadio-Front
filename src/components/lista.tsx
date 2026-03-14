import { useRef, useEffect, useState } from "react";
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
  //const [indice, setIndice] = useState(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  useEffect(() => {
    const getAudios = async () => {
      try {
        const res = await fetch(`${API}/api/get_audios`, {
          method: "POST"
        });

        const data = await res.json();
        console.log("Audios", data);
        setAudios(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    getAudios();
  }, [])

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
          setPlayingUrl(null); // fin de la lista
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
              <button className="bg-green-400"><span>{audio.likes}</span>
                Likes</button>
              <button
                onClick={() => handlePlay(audio.url, idx)}
                className="py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {playingUrl === audio.url ? '⏸️ Pausar' : '▶️ Reproducir'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div >
  );

}