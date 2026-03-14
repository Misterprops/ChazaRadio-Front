import { useState, useRef } from "react";

type props = {
  onRecordingComplete?:(blob: Blob, url: string) => void;
};

export const AudioRecorder = ({ onRecordingComplete }:props) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioChunksRef.current = [];

      if (onRecordingComplete) {
        onRecordingComplete(audioBlob, audioUrl);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex gap-4 items-center mt-2 w-1/1 justify-center">
      {!recording ? (
        <button onClick={startRecording} className="bg-fuchsia-200 hover:cursor-pointer border h-8 w-1/2 rounded hover:bg-fuchsia-300">
          🎙️ Empezar
        </button>
      ) : (
        <button onClick={stopRecording} className="bg-fuchsia-200 hover:cursor-pointer border h-8 w-1/2 rounded hover:bg-fuchsia-300">
          ⏹️ Detener
        </button>
      )}
    </div>
  );
};