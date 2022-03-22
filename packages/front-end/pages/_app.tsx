import {Web3ReactProvider} from "@web3-react/core";
import {styled} from "@mui/material";
import {ToastContainer} from "react-toastify";
import type { AppProps } from 'next/app'
import Header from "../components/Header";
import '../styles/globals.css'
import "react-toastify/dist/ReactToastify.css";
const {Web3Provider} = require("@ethersproject/providers");

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const StyledToastContainer = styled(ToastContainer)({
  '& .Toastify__close-button': {
    color: "#000000",
    opacity: 1,
  },
  '& .Toastify__toast-icon': {
    width: "32px",
    marginInlineEnd: "15px",
  }
})

function MyApp({ Component, pageProps }: AppProps) {

  return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header/>
        <Component {...pageProps} />
        <StyledToastContainer
            position={"bottom-left"}
            autoClose={5000}
            limit={5}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnHover
            pauseOnFocusLoss
        />
      </Web3ReactProvider>
  );
}

export default MyApp
