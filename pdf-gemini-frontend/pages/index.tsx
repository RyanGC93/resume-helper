import { AppProps } from 'next/app';
import VoiceInput from "../components/VoiceInput";
import FileUpload from "../components/FileUpload";
import Navbar from "@/components/Navbar"
import withAuth from '@/hoc/withAuth';
import UserPdfs.tsx from '@/components/UserPdfs'
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
    <Navbar/>
    
      <div>
        <UserPdfs />
        <FileUpload />
        <VoiceInput />
        {/* <Component {...pageProps} /> */}
      </div>
    </>
  );
};

export default withAuth(MyApp);
