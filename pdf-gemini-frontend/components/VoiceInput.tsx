import { useState, useEffect } from "react";

const VoiceInput: React.FC = () => {
    const [transcript, setTranscript] = useState<string>("");
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        // This ensures that the code runs only on the client side
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Return null while loading (or you can return a loading spinner)
    }

    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Change this to the language you need
    recognition.interimResults = true;

    const startRecording = () => {
        recognition.start();
        setIsRecording(true);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let currentTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };
    };

    const stopRecording = () => {
        recognition.stop();
    };

    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <h2 className="text-xl font-bold mb-2">Voice Input</h2>

            <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={5}
                className="w-72 p-2 border rounded mb-4"
                placeholder="Speak something..."
            ></textarea>

            <div className="flex space-x-4">
                <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    disabled={isRecording}
                >
                    Start Recording
                </button>
                <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    disabled={!isRecording}
                >
                    Stop Recording
                </button>
            </div>
        </div>
    );
};

export default VoiceInput;
