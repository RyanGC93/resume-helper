// globals.d.ts

// Extend the SpeechRecognitionEvent type
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number; // Add the resultIndex property
    interpretation: string | undefined;
    final: boolean;
  }
  
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof webkitSpeechRecognition | undefined;
  }
  