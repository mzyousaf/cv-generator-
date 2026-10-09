// Minimal types for react-speech-recognition v4 (the package ships none).
declare module "react-speech-recognition" {
  export type ListeningOptions = { continuous?: boolean; language?: string };

  export function useSpeechRecognition(options?: {
    transcribing?: boolean;
    clearTranscriptOnListen?: boolean;
  }): {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    isMicrophoneAvailable: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    browserSupportsContinuousListening: boolean;
  };

  const SpeechRecognition: {
    startListening(options?: ListeningOptions): Promise<void>;
    stopListening(): Promise<void>;
    abortListening(): Promise<void>;
    browserSupportsSpeechRecognition(): boolean;
    browserSupportsContinuousListening(): boolean;
  };

  export default SpeechRecognition;
}
