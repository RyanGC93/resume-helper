import { AppProps } from 'next/app';
import VoiceInput from "../components/VoiceInput";
import FileUpload from "../components/FileUpload";
import { AuthProvider } from "../contexts/AuthContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <div>
        <FileUpload />
        <VoiceInput />
        {/* <Component {...pageProps} /> */}
      </div>
     </AuthProvider>
  );
};

export default MyApp;
