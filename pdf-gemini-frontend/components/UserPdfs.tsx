import { useEffect, useState } from "react";

interface UserPdfsProps {
    authToken: string;
}

export default function UserPdfs({ authToken }: UserPdfsProps) {
    const [pdfs, setPdfs] = useState<string[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/get-pdf/sample.pdf", {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(res => res.json())
            .then((data: { url: string }) => setPdfs([data.url]))
            .catch(err => console.error("Failed to load PDFs", err));
    }, [authToken]);

    return (
        <div>
            <h2>Your PDFs</h2>
            <ul>
                {pdfs.map((url, index) => (
                    <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            View PDF {index + 1}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
