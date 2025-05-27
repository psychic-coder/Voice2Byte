// pages/_app.js
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import PreLoader from "@/src/layouts/PreLoader";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";

import "react-toastify/dist/ReactToastify.css";
import "../styles/animate.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import { ToastWrapper } from "@/src/components/Toast";
import { ToastContainer } from "react-toastify";

function App({ Component, pageProps }) {
  const [preLoader, setPreLoader] = useState(true);

  useEffect(() => {
    const initializeAOS = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({
        duration: 800,
        once: true,
      });
    };

    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min");
      initializeAOS();
    }

    const timer = setTimeout(() => {
      setPreLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Voice2Bite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          {preLoader ? <PreLoader /> : <Component {...pageProps} />}
        </PersistGate>
      </Provider>
    </Fragment>
  );
}

export default App;
