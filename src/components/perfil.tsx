import { useState } from "react";
import { AudioRecorder } from "./recorder";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
const API = import.meta.env.VITE_APP_API;

type props = {
  user: string,
  mail: string
};

export function Perfil(props: props) {
  const [titulo, setTitulo] = useState("");
  const [titulo_song, setTitulo_song] = useState("");
  const [autor, setAutor] = useState("");
  //const [userData, setUserData] = useState(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleRecordingComplete = async (blob: Blob, url: string) => {
    setAudioUrl(url);
    setBlob(blob)
  };

  const handlePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const upload = async (bandera: boolean) => {
    if (bandera) {
      if (!blob) return;
      try {
        const formData = new FormData();
        formData.append("audio", blob, titulo + "por" + props.user + ".mp3");
        formData.append("data", JSON.stringify({ titulo: titulo, tipo: "cuña", id: "20232678012", autor: props.user }));

        const res = await fetch(`${API}/api/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        console.log("Archivo guardado en:", data.url);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("audio", file, titulo_song + "por" + autor + ".mp3");
        formData.append("data", JSON.stringify({ titulo: titulo_song, tipo: "cancion", id: "20232678012", autor: autor }));
        //console.log(formData)
        const res = await fetch(`${API}/api/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        console.log("Archivo guardado en:", data.url);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return ([
    <div className="flex w-1/1">

      {props ?
        <div className="w-1/1 flex justify-around flex-wrap">
          <span className="">{props.user}</span>
          <span className="">{props.mail}</span>
        </div>
        :
        <div className="w-1/1 flex justify-around flex-wrap">
          <span>Name</span>
          <span>E-mail</span>
        </div>
      }

    </div>,
    <div className="w-1/1 flex items-center flex-col mt-8">
      <span>Crea tu anuncio y compartelo</span>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      {audioUrl && (
        <>
          <form onSubmit={handlePlay}>
            <Button>
              🔊 Escuchar grabación
            </Button>
          </form>

          <form onSubmit={(e) => { e.preventDefault(); upload(true) }} className="flex flex-col w-1/1 items-center mt-4">
            <label htmlFor="titulo">Agrega un titulo</label>
            <Input type="text" id='titulo' value={titulo} required change={setTitulo} />
            <Button>
              🔊 Subir grabacion
            </Button>
          </form>
        </>
      )}
    </div>,
    <div className="w-1/1 flex items-center flex-col">
      {/*<input className='border-2 bg-fuchsia-300 w-1/1 h-1/2' value={url} onChange={(e) => setUrl(e.target.value)} />*/}
      <form className="flex flex-col w-1/2 mt-8 items-center" onSubmit={(e) => { e.preventDefault(); upload(false) }}>
        <label htmlFor="file">¿Quieres que tu cancion o anuncio sea escuchado?</label>
        <input className='bg-fuchsia-200 hover:cursor-pointer border h-8 w-1/1 rounded hover:bg-fuchsia-300 mb-2' id="file" type="file" required accept="audio/mp3,audio/webm,audio/mpeg" onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }} />
        <label htmlFor="titulo_song">Agrega el titulo de la cancion</label>
        <Input type="text" id='titulo_song' value={titulo_song} required change={setTitulo_song} />
        <label htmlFor="titulo">Agrega al autor</label>
        <Input type="text" id='autor' value={autor} required change={setAutor} />
        <Button>Compartir</Button>
      </form>
    </div >
  ]);
}