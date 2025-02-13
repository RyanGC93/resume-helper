import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase"; // Adjust this import path as necessary

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-semibold cursor-pointer" onClick={() => router.push("/")}>
          MyApp
        </div>
        <div className="space-x-4">
          <button
            className="text-white hover:text-gray-200"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => router.push("/profile")}
          >
            Profile
          </button>
          <button
            className="text-white hover:text-gray-200"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;