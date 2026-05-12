import { useState } from "react";
import { AudioRecorder } from "../functions/recorder";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import { useAuth } from "../functions/authContext";
import { api_uploadSounds } from "../functions/api_calls";
import { Label } from "../elements/label";
import { useNavigate } from "react-router";

/**
 * Tipo que define el formato de los poadcasts
 * @typedef {Object} props
 * @property {Function} triggerRefresh - Funcion para refrezcar la lista de audios
 */
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
 * @param {{triggerRefresh: Function}} props
 * @returns {JSX.Element} Componente visual del perfil
 * @remarks
 * - Integra captura de audio
 * - Sube contenido al backend.
 */
export function Perfil({ triggerRefresh }: props) {
  //Titulo de la cuña
  const [titulo, setTitulo] = useState("");
  //Titulo de la cancion
  const [titulo_song, setTitulo_song] = useState("");
  //Autor de la cancion
  const [autor, setAutor] = useState("");
  //Credenciales de usuario del authContext
  const { user, token, checkAuth } = useAuth();
  //Url de la cancion
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  //Archivo de audio de la cuña
  const [blob, setBlob] = useState<Blob | null>(null);
  //Archivo de audio de la cancion
  const [file, setFile] = useState<File | null>(null);
  //Hook de redirección
  const navigate = useNavigate();


  /**
   * Maneja grabación completada.
   * 
   * @param {Blob} blob - Pista de audio
   * @param {string} url - Url del audio
   * @returns {Promise<void>}
   * @internal
   */
  const handleRecordingComplete = async (blob: Blob, url: string) => {
    //Agrega el url del audio
    setAudioUrl(url);
    //Guarda la pista de audio
    setBlob(blob)
  };

  /**
   * Reproduce audio grabado.
   * 
   * @returns {void}
   */
  const handlePlay = () => {
    //Verifica que existe la url del audio
    if (audioUrl) {
      //Obtiene el audio de la url
      const audio = new Audio(audioUrl);
      //Reproduce el audio
      audio.play();
    }
  };

  /**
   * Verifica las caracteristicas del audio.
   * 
   * @param {File | Blob} files - Pista de audio
   * @returns {Promise<boolean>}
   * @remarks
   * - Valida que la pista de audio cumple con los requisitos
   * @internal
   */
  const checkFile = (files: File | Blob) => {
    //Revisa que el archivo sea de audio
    if (!files.type.startsWith("audio/")) {
      alert("Debe ser un audio");
      return false;
    }
    //Revisa que el tamaño del archivo no pase las 15MB
    if (files.size > 15 * 1024 * 1024) {
      alert("Archivo muy pesado");
      return false;
    }
    return true;
  }

  /**
   * Sube audio al backend.
   * 
   * @param bandera - true si es grabación, false si es archivo
   * @returns {Promise<void>}
   * @remarks
   * - Construye un FormData con la pista y sus metadatos y lo envía al backend.
   * @internal
   */
  const upload = async (bandera: boolean) => {
    //Verifica el estado de la bandera
    if (bandera) {
      //Verifica si hay una cuña y revisa el archivo
      if (blob && checkFile(blob)) {
        try {
          //Verifica que hay un usuario autenticado
          if (user && token && await checkAuth()) {
            //Crea un formData con la pista y datos del creador
            const formData = new FormData();
            formData.append("audio", blob, titulo + "por" + user.nombre + ".webm");
            formData.append("data", JSON.stringify({ titulo: titulo, tipo: "cuña", autor: user.nombre }));
            //Envia el formData a la API
            const res = await api_uploadSounds(formData, token)
            const data = await res.json()
            //Verifica si hay errores en el back
            if (!res.ok) {
              //Avisa al usuario del error
              alert(data.error || "Error al subir la pista de audio");
            } else {
              //Avisa al usuario la publicación exitosa
              alert(data.msg || "Cuña publicada");
              //Refresca la lista
              if (triggerRefresh) { triggerRefresh() }
              //Limpia los datos
              setTitulo("")
              setBlob(null)
            }
          } else {
            //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
            alert("Sesion caducada");
            navigate("/Login")
          }
        } catch (error) {
          alert("Error al subir el audio");
        }
      } else {
        alert("No se encontro la pista de audio")
      }
    } else {
      //Verifica si hay una cancion y revisa el archivo
      if (file && checkFile(file)) {
        try {
          //Verifica que hay un usuario autenticado
          if (user && token && await checkAuth()) {
            //Crea un formData con la pista y datos del creador
            const formData = new FormData();
            formData.append("audio", file, titulo_song + "por" + autor + ".mp3");
            formData.append("data", JSON.stringify({ titulo: titulo_song, tipo: "cancion", autor: autor }));
            //Envia el formData a la API
            const res = await api_uploadSounds(formData, token)
            const data = await res.json()
            //Verifica si hay errores en el back
            if (!res.ok) {
              //Avisa al usuario del error
              alert(data.error || "Error al subir la pista de audio");
            } else {
              //Avisa al usuario la publicación exitosa
              alert(data.msg || "cancion publicada");
              //Refresca la lista
              if (triggerRefresh) { triggerRefresh() }
              //Limpia los datos
              setFile(null)
              setTitulo_song("")
              setAutor("")
            }
          } else {
            //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
            alert("Sesion caducada");
            navigate("/Login")
          }
        } catch (error) {
          alert("Error al subir el audio");
        }
      } else {
        alert("No se encontro la pista de audio")
      }
    }
  };

  //Interfaz del perfil
  return (
    <div className="flex w-full pl-2 pr-2 flex-col">
      <div className="flex w-full">
        {/*Valida si el usuario esta activo*/}
        {user ?
          //Muestra los datos del usuario
          <div className="w-full flex justify-around flex-wrap">
            <span className="text-lg wrap-break-word">{user.nombre}</span>
            <span className="text-lg break-all">{user.correo}</span>
          </div>
          :
          //Muestra placeholders
          <div className="w-full flex justify-around flex-wrap">
            <span className="text-lg wrap-break-word">Name</span>
            <span className="text-lg wrap-break-word">E-mail</span>
          </div>
        }
      </div>
      <div className="w-full flex items-center flex-col mt-8">
        <span className="text-lg text-wrap">Crea tu anuncio y compartelo</span>
        {/*Interfaz de grabación de audios*/}
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        {/*Si el url de la pista existe*/}
        {audioUrl && (
          <>
            {/*Boton para escuchar la grabación*/}
            <form className="w-full md:w-1/2" onSubmit={(e) => { e.preventDefault(); handlePlay() }}>
              <Button>
                🔊 Escuchar grabación
              </Button>
            </form>
            {/*Formulario para subir la grabación*/}
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
        {/*Formulario para subir pistas de audio*/}
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