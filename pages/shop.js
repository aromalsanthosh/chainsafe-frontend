import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
export default function Shop() {
  return (
    <div>
      <Head>
        <title>ChainSafe | Shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name="Aromal" />
      <Wallet address="0x1234567890abcdef" balance="5.4321" />
      <div className="hero min-h-screen bg-base-200">
        Shop Page
      </div>
      <Footer />
    </div>
  );
}
