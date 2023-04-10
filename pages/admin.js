import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";

export default function Admin() {
  return (
    <div>
      <Head>
        <title>ChainSafe | Admin</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        Admin Page
      </div>
      <Footer />
    </div>
  );
}
