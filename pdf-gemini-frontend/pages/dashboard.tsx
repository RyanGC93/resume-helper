import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import withAuth from "../hoc/withAuth";

const Dashboard = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default withAuth(Dashboard);
