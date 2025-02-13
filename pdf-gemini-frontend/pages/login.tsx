import React, { useState } from 'react';
import './styles/LoginPage.css';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth,signInWithGoogle } from '../lib/firebase';
import Modal from '../components/Modal';
import Link from 'next/link'

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showErrorModal = (error: string) => {
    setErrorMessage(error);
    setModalOpen(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/');  // Using Next.js router
      })
      .catch((error) => {
        showErrorModal(error.message);
        console.error(error.code, error.message);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/"); // Redirect to home page after successful Google sign-in
    } catch (error) {
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://images.unsplash.com/photo-1505455184862-554165e5f6ba?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Woman holding yellow petaled flowers"
        className="login-image"
      />
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <div className="or-separator"></div>
        <button type="button" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>
        <h3>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </h3>
      </form>
      <Modal isOpen={isModalOpen} close={() => setModalOpen(false)}>
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <p>Please try again</p>
      </Modal>
    </div>
  );
}

export default LoginPage;
