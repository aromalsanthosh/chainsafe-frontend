import Navbar from "../components/Navbar";
import Landing from "../components/hero";
import Head from "next/head";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>ChainSafe | Home Page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        <Landing />
      </div>
      <Footer />
    </div>
  );
}
