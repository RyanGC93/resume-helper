import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // For Firestore example


// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
const firebaseConfig = {
    apiKey: "AIzaSyA5FRbfuv_FtxDnOhesG09WjmpUIhwg2qY",
    authDomain: "job-helper-450711.firebaseapp.com",
    projectId: "job-helper-450711",
    storageBucket: "job-helper-450711.firebasestorage.app",
    messagingSenderId: "950894300085",
    appId: "1:950894300085:web:6730459a9d1d6719ae27fc",
    measurementId: "G-S6HJ87FRC6"
  }

console.log("ge",firebaseConfig)



const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;