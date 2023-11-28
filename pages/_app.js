import Head from 'next/head';
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';


function MyApp({ Component, pageProps }) {
  return (
      <>
          <Head>
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
              {/* Outros elementos Head */}
          </Head>
          <Component {...pageProps} />
          <Footer />
      </>
  );
}

export default MyApp;