import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const auth = getAuth(); // Initialize Firebase Authentication

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the dashboard if login is successful
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message); // Set error message
      console.error("Login Error:", err); // Log the full error for debugging
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96"> {/* Added Tailwind classes */}
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>} {/* Tailwind for error styling */}
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Tailwind for form spacing */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Tailwind input styling
            required // Add required attribute for form validation
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Tailwind input styling
            required // Add required attribute for form validation
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300" // Tailwind button styling
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;