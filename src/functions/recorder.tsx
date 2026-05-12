/**
 * @file recorder.tsx
 * @description Componente de grabación de audio usando Web Audio API
 * 
 * Permite a los usuarios:
 * - Solicitar permiso al navegador para acceder al micrófono
 * - Grabar audio en tiempo real
 * - Capturar el Blob de audio y una URL reproducible
 * - Callback con el audio grabado para enviar al servidor
 * 
 * Nota: Funciona solo en HTTPS o localhost (requisito Web Audio API)
 * 
 * @author ChazaRadio Team
 * @version 1.0
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "../elements/button";

/**
 * Props del componente AudioRecorder para grabar audio
 * @typedef {Object} props
 * @property {Function} onRecordingComplete - Callback ejecutado al terminar grabación
 *   @param {Blob} blob - Archivo de audio (webm, limite de 2 minutos)
 *   @param {string} url - URL generado del audio
 */
type props = {
  onRecordingComplete?: (blob: Blob, url: string) => void;
};

/**
 * Componente para grabar audio del micrófono
 * 
 * @param {props} props - Props del componente
 * @returns {JSX.Element} Interfaz que maneja la grabación de pistas
 * 
 * @remarks
 * Flujo:
 * - Usuario hace click en "Empezar", Necesita dar permiso del micrófono
 * - El usuario hace la grabación
 * - Genera un Blob de audio y Object URL
 */
export const AudioRecorder = ({ onRecordingComplete }: props) => {

  //Indicador de grabación
  const [recording, setRecording] = useState(false);
  //Referencia de la pista
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  //Referencia de los segmentos de la pista
  const audioChunksRef = useRef<Blob[]>([]);
  //Referencia de la grabación
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Hook que se ejecuta al montar el componente
   * Detiene todas las grabaciones
   */
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);


  /**
   * Inicia la grabación de audio desde el micrófono del usuario
   * 
   * @remarks
   * - Solicita permiso de micrófono
   * - Crea MediaRecorder con el stream y sus eventos
   * - Inicia grabación
   * 
   * @returns {Promise<void>}
   * @internal
   */
  const startRecording = async () => {
    // Validar la compatibilidad del navegador
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Tu navegador no soporta grabación de audio o no estás en HTTPS");
      return;
    }

    try {
      //Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      //Crear MediaRecorder con el stream de audio
      const mediaRecorder = new MediaRecorder(stream);
      //Agregar la referencia de la grabación
      streamRef.current = stream;

      //Con partes de la pista disponibles
      mediaRecorder.ondataavailable = (event) => {
        //Agrega el fragmento de la pista
        audioChunksRef.current.push(event.data);
      };

      //Con la finalización de la grabación
      mediaRecorder.onstop = () => {
        //Combina todos los fragmentos en un único Blob
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        //Genera la URL local de la pista
        const audioUrl = URL.createObjectURL(audioBlob);

        //Vacia el contenido de la pista
        audioChunksRef.current = [];

        //Se llama con la pista y url
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, audioUrl);
        }
      };

      //Guarda la referencia del mediaRecorder
      mediaRecorderRef.current = mediaRecorder;

      //Inicia la grabación
      mediaRecorder.start();

      //Actualiza la interfaz
      setRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("Error: No se puede acceder al micrófono");
    }
  };

  /**
   * Detiene la grabación de audio actual
   * 
   * @returns {void}
   * 
   * @remarks
   * Funcion:
   * - Detiene MediaRecorder con el evento .onstop
   * - Detiene las pistas de audio del stream
   * @internal
   */
  const stopRecording = () => {
    //Detiene MediaRecorder
    mediaRecorderRef.current?.stop();

    //Detiene la grabación del micrófono
    streamRef.current?.getTracks().forEach(track => track.stop());

    //Actualiza la interfaz
    setRecording(false);
  };

  //Interfaz de recorder
  return (
    <div className="flex gap-4 items-center mt-2 w-full justify-center">
      {/*Valida que no este grabando*/}
      {!recording ? (
        //Boton de grabar
        <form className="w-full md:w-1/2" onSubmit={(e) => { e.preventDefault(); startRecording() }}>
          <Button>
            🎙️ Empezar
          </Button>
        </form>
      ) : (
        //Boton de detener
        <form className="w-full md:w-1/2" onSubmit={(e) => { e.preventDefault(); stopRecording() }}>
          <Button>
            ⏹️ Detener
          </Button>
        </form>
      )}
    </div>
  );
};