import { useState } from "react";
import { AudioRecorder } from "./recorder";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import { useAuth } from "./authContext";
import { api_uploadSounds } from "../functions/api_calls";

export function Perfil() {
  const [titulo, setTitulo] = useState("");
  const [titulo_song, setTitulo_song] = useState("");
  const [autor, setAutor] = useState("");
  const { user, token } = useAuth();

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
      if (blob) {
        try {
          if (user && token) {
            const formData = new FormData();
            formData.append("audio", blob, titulo + "por" + user.nombre + ".mp3");
            formData.append("data", JSON.stringify({ titulo: titulo, tipo: "cuña", id: user.id, autor: user.nombre }));

            const res = await api_uploadSounds(formData, token)
            if (!res.ok) {
              alert("Error de publicacion")
            } else {
              alert("Pista publicada")
            }
          } else {
            alert("Problema de autenticacion")
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        alert("No se encontro la pista de audio")
      }
    } else {
      if (file) {
        try {
          if (user && token) {
            const formData = new FormData();
            formData.append("audio", file, titulo_song + "por" + autor + ".mp3");
            formData.append("data", JSON.stringify({ titulo: titulo_song, tipo: "cancion", id: user.id, autor: autor }));

            const res = await api_uploadSounds(formData, token)

            if (!res.ok) {
              alert("Error de publicacion")
            } else {
              alert("Pista publicada")
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        alert("No se encontro la pista de audio")
      }
    }
  };

  return ([
    <div className="flex w-1/1">

      {user ?
        <div className="w-1/1 flex justify-around flex-wrap">
          <span className="">{user.nombre}</span>
          <span className="">{user.correo}</span>
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