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
 * Props del componente AudioRecorder
 * @typedef {Object} RecorderProps
 * @property {Function} [onRecordingComplete] - Callback ejecutado al terminar grabación
 *   @param {Blob} blob - Archivo de audio (webm, ~20MB para 1 hora)
 *   @param {string} url - URL local del audio (blob://) para previsualización
 */
type props = {
  /**
   * Callback cuando termina la grabación
   * @callback onRecordingComplete
   * @param {Blob} blob - Audio grabado en formato webm/opus
   * @param {string} url - Object URL para reproducción local (blob://...)
   */
  onRecordingComplete?: (blob: Blob, url: string) => void;
};

/**
 * AudioRecorder - Componente funcional para grabar audio del micrófono
 * 
 * @component
 * @param {RecorderProps} props - Props del componente
 * @param {Function} props.onRecordingComplete - Callback con (blob, url) al terminar
 * @returns {JSX.Element} UI con botones Empezar/Detener
 * 
 * @description
 * Flujo:
 * 1. Usuario hace click en "Empezar" → solicita permiso de micrófono
 * 2. Si permitido: inicia grabación, muestra botón "Detener"
 * 3. Usuario hace click en "Detener" → detiene grabación
 * 4. Genera Blob del audio y Object URL
 * 5. Llama callback onRecordingComplete(blob, url)
 * 6. Componente padre puede enviar blob al servidor vía FormData
 * 
 * Estados:
 * - recording: false → muestra botón "Empezar"
 * - recording: true → muestra botón "Detener"
 * 
 * Cleanup:
 * - useEffect desactiva todas las pistas de micrófono al desmontar
 * - Previene múltiples conexiones de micrófono
 * 
 * @example
 * const MyProfilePage = () => {
 *   const handleRecordingComplete = (blob, url) => {
 *     // Reproducir localmente
 *     const audio = new Audio(url);
 *     audio.play();
 *     
 *     // Enviar al servidor
 *     const formData = new FormData();
 *     formData.append('file', blob, 'audio.webm');
 *     formData.append('titulo', 'Mi grabación');
 *     api_uploadSounds(formData, token);
 *   };
 *   
 *   return <AudioRecorder onRecordingComplete={handleRecordingComplete} />;
 * }
 */
export const AudioRecorder = ({ onRecordingComplete }: props) => {
  /**
   * Estado: indicador si está grabando en este momento
   * @type {[boolean, Function]}
   */
  const [recording, setRecording] = useState(false);

  /**
   * Referencia a MediaRecorder (mantiene instancia entre renders)
   * @type {React.MutableRefObject<MediaRecorder|null>}
   */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  /**
   * Acumulador de chunks de audio durante grabación
   * @type {React.MutableRefObject<Blob[]>}
   * @description Se vacía después de cada grabación completada
   */
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Referencia al stream de audio del micrófono
   * @type {React.MutableRefObject<MediaStream|null>}
   * @description Necesario para detener las pistas al desmontar o terminar grabación
   */
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Hook de limpieza: detiene todas las pistas de audio al desmontar
   * @description Previene que el micrófono permanezca activo después de desmontar el componente
   */
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  /**
   * Inicia la grabación de audio desde el micrófono del usuario
   * 
   * @async
   * @returns {Promise<void>}
   * 
   * @description
   * Pasos:
   * 1. Verifica que el navegador soporta MediaDevices
   * 2. Solicita permiso de micrófono (getUserMedia)
   * 3. Crea MediaRecorder con el stream
   * 4. Configura event handlers:
   *    - ondataavailable: guarda chunks de audio
   *    - onstop: genera Blob y llama callback
   * 5. Inicia grabación
   * 6. Actualiza UI a estado "grabando"
   * 
   * @example
   * // Usuario presiona botón "Empezar"
   * const startRecording = async () => {
   *   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
   *   // ... resto de lógica
   * }
   */
  const startRecording = async () => {
    // Validar compatibilidad del navegador
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Tu navegador no soporta grabación de audio o no estás en HTTPS");
      return;
    }

    try {
      // Solicitar acceso al micrófono (usuario ve popup de permiso)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Crear MediaRecorder con el stream de audio
      const mediaRecorder = new MediaRecorder(stream);
      streamRef.current = stream;

      /**
       * Event: cuando hay datos de audio disponibles
       * Se dispara periódicamente durante la grabación
       */
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      /**
       * Event: cuando se detiene la grabación
       * Genera el Blob final y llama al callback
       */
      mediaRecorder.onstop = () => {
        // Combinar todos los chunks en un único Blob
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        // Crear URL local para reproducción en el navegador (blob://...)
        const audioUrl = URL.createObjectURL(audioBlob);

        // Limpiar chunks para la siguiente grabación
        audioChunksRef.current = [];

        // Llamar callback con el audio grabado
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, audioUrl);
        }
      };

      // Guardar referencia a MediaRecorder
      mediaRecorderRef.current = mediaRecorder;

      // Iniciar grabación
      mediaRecorder.start();

      // Actualizar UI
      setRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("Error: No se puede acceder al micrófono. Verifica los permisos.");
    }
  };

  /**
   * Detiene la grabación de audio actual
   * 
   * @returns {void}
   * 
   * @description
   * Pasos:
   * 1. Detiene MediaRecorder (dispara evento 'onstop')
   * 2. Detiene todas las pistas de audio del stream
   * 3. Actualiza UI a estado "no grabando"
   * 
   * @example
   * // Usuario presiona botón "Detener"
   * const stopRecording = () => {
   *   mediaRecorderRef.current?.stop();
   *   streamRef.current?.getTracks().forEach(track => track.stop());
   *   setRecording(false);
   * }
   */
  const stopRecording = () => {
    // Detener MediaRecorder (dispara onstop)
    mediaRecorderRef.current?.stop();

    // Detener todas las pistas de micrófono
    streamRef.current?.getTracks().forEach(track => track.stop());

    // Actualizar estado UI
    setRecording(false);
  };

  return (
    <div className="flex gap-4 items-center mt-2 w-full justify-center">
      {!recording ? (
        // Botón EMPEZAR (cuando NO está grabando)
        <form className="w-full md:w-1/2" onSubmit={(e) => { e.preventDefault(); startRecording() }}>
          <Button>
            🎙️ Empezar
          </Button>
        </form>
      ) : (
        // Botón DETENER (cuando SÍ está grabando)
        <form className="w-full md:w-1/2" onSubmit={(e) => { e.preventDefault(); stopRecording() }}>
          <Button>
            ⏹️ Detener
          </Button>
        </form>
      )}
    </div>
  );
};