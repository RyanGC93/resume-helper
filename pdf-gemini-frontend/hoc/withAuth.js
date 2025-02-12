import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        // Redirect to login page if not authenticated
        router.push("/login");
      }
    }, [user, router]);

    if (!user) {
      // Optionally, you can show a loading spinner while waiting for user state
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  // Set displayName for debugging purposes
  AuthHOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthHOC;
};

export default withAuth;
