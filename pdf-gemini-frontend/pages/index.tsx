import { useState, ChangeEvent } from "react";
import axios from "axios";

// Define types for state
interface ResponseData {
    summary: string;
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null); // 'File' type for uploaded file
    const [summary, setSummary] = useState<string>(""); // 'string' type for summary
    const [loading, setLoading] = useState<boolean>(false); // 'boolean' type for loading state

    // Type the event for file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]); // Ensure files exists before setting it
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a PDF first.");

        const formData = new FormData();
        formData.append("pdf", file);

        setLoading(true);
        setSummary("");

        try {
            const response = await axios.post<ResponseData>("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error uploading file:", error);
            setSummary("Failed to process PDF.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold">PDF Summarizer</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="mt-4" />
            <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
                {loading ? "Processing..." : "Upload & Summarize"}
            </button>

            {summary && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="font-bold">Summary:</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}
