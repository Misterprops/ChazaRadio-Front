import { useState } from "react";
import { AudioRecorder } from "./recorder";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import { useAuth } from "./authContext";
import { api_uploadSounds } from "../functions/api_calls";
import { Label } from "../elements/label";

type props = {
  triggerRefresh?: () => void;
};

/**
 * Componente de perfil de usuario.
 * 
 * Funcionalidades:
 * - Mostrar datos del usuario
 * - Grabar audio (cuñas)
 * - Subir archivos de audio
 * 
 * @component
 * @param {{triggerRefresh: Function}} props
 * @returns {JSX.Element[]}
 */
export function Perfil({ triggerRefresh }: props) {
  const [titulo, setTitulo] = useState("");
  const [titulo_song, setTitulo_song] = useState("");
  const [autor, setAutor] = useState("");
  const { user, token } = useAuth();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);

  /**
   * Maneja grabación completada.
   * 
   * @param {Blob} blob
   * @param {string} url
   * @returns {void}
   */
  const handleRecordingComplete = async (blob: Blob, url: string) => {
    setAudioUrl(url);
    setBlob(blob)
  };

  /**
   * Reproduce audio grabado.
   * 
   * @returns {void}
   */
  const handlePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const checkFile = (files: File | Blob) => {
    if (!files.type.startsWith("audio/")) {
      alert("Debe ser un audio");
      return false;
    }

    if (files.size > 15 * 1024 * 1024) {
      alert("Archivo muy pesado");
      return false;
    }

    return true;
  }

  /**
   * Sube audio al backend.
   * 
   * @param {boolean} bandera - true = grabación, false = archivo
   * @returns {Promise<void>}
   */
  const upload = async (bandera: boolean) => {
    if (bandera) {
      if (blob && checkFile(blob)) {
        try {
          if (user && token) {
            const formData = new FormData();
            formData.append("audio", blob, titulo + "por" + user.nombre + ".webm");
            formData.append("data", JSON.stringify({ titulo: titulo, tipo: "cuña", autor: user.nombre }));

            const res = await api_uploadSounds(formData, token)
            if (!res.ok) {
              alert("Error de publicacion")
            } else {
              alert("Pista publicada")
              if (triggerRefresh) { triggerRefresh() }
              setTitulo("")
              setBlob(null)
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
      if (file && checkFile(file)) {
        try {
          if (user && token) {
            const formData = new FormData();
            formData.append("audio", file, titulo_song + "por" + autor + ".mp3");
            formData.append("data", JSON.stringify({ titulo: titulo_song, tipo: "cancion", autor: autor }));

            const res = await api_uploadSounds(formData, token)

            if (!res.ok) {
              alert("Error de publicacion")
            } else {
              alert("Pista publicada")
              if (triggerRefresh) { triggerRefresh() }
              setFile(null)
              setTitulo_song("")
              setAutor("")
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

  return (
    <div className="flex w-full pl-2 pr-2 flex-col">
      <div className="flex w-full">

        {user ?
          <div className="w-full flex justify-around flex-wrap">
            <span className="text-lg wrap-break-word">{user.nombre}</span>
            <span className="text-lg break-all">{user.correo}</span>
          </div>
          :
          <div className="w-full flex justify-around flex-wrap">
            <span className="text-lg wrap-break-word">Name</span>
            <span className="text-lg wrap-break-word">E-mail</span>
          </div>
        }

      </div>
      <div className="w-full flex items-center flex-col mt-8">
        <span className="text-lg text-wrap">Crea tu anuncio y compartelo</span>
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        {audioUrl && (
          <>
            <form className="w-full md:w-1/2" onSubmit={(e) => { e.preventDefault(); handlePlay() }}>
              <Button>
                🔊 Escuchar grabación
              </Button>
            </form>

            <form onSubmit={(e) => { e.preventDefault(); upload(true) }} className="flex flex-col w-full md:w-1/2 items-center mt-4">
              <Label htmlFor="titulo">Agrega un titulo</Label>
              <Input type="text" id='titulo' value={titulo} required change={setTitulo} />
              <Button>
                🔊 Subir grabacion
              </Button>
            </form>
          </>
        )}
      </div>
      <div className="w-full flex items-center flex-col">
        <form className="flex flex-col w-full md:w-1/2 mt-8 items-center" onSubmit={(e) => { e.preventDefault(); upload(false) }}>
          <Label htmlFor="file">¿Quieres que tu cancion o anuncio sea escuchado?</Label>
          <input className='bg-fuchsia-200 hover:cursor-pointer text-wrap border w-full h-8 rounded hover:bg-fuchsia-300 mb-2' id="file" type="file" required accept="audio/mp3,audio/webm,audio/mpeg" onChange={(e) => { (e.target.files && checkFile(e.target.files[0])) ? setFile(e.target.files[0]) : setFile(null) }} />
          <Label htmlFor="titulo_song">Agrega el titulo de la cancion</Label>
          <Input type="text" id='titulo_song' value={titulo_song} required change={setTitulo_song} />
          <Label htmlFor="titulo">Agrega al autor</Label>
          <Input type="text" id='autor' value={autor} required change={setAutor} />
          <Button>Compartir</Button>
        </form>
      </div >
    </div>
  );
}