import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  let products = [
    {
      imageUrl:
        "https://assets.gqindia.com/photos/5ef357a962970f1a2bdba9b4/16:9/pass/ios%2014%20features%20most%20interesting%20apple%20iphone%20wwdc%202020.jpg",
      brand: "Apple",
      model: "iPhone XR",
      priceInEth: 0.0003,
    },
    {
      imageUrl:
        "https://images.samsung.com/is/image/samsung/assets/sg/smartphones/ux/slide-s21.jpg",
      brand: "Samsung",
      model: "Galaxy S21",
      priceInEth: 0.0004,
    },
    {
      imageUrl:
        "https://cdn.mos.cms.futurecdn.net/aSkTcu4re7Cz5BU4aVXvHK.jpg",
      brand: "Xiaomi",
      model: "Mi 11 Ultra",
      priceInEth: 0.00035,
    },
    {
      imageUrl: "https://images.news18.com/ibnlive/uploads/2021/10/vivo-x70-pro-plus-review-16330704123x2.jpeg",
      brand: "Vivo",
      model: "X70 Pro",
      priceInEth: 0.00025,
    },
  ];

  return (
    <div>
      <Head>
        <title>ChainSafe | Shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name="Aromal" />
      <Wallet address="0x1234567890abcdef" balance="5.4321" />
      {/* products container responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <ProductCard
            key={product.model}
            imageUrl={product.imageUrl}
            brand={product.brand}
            model={product.model}
            priceInEth={product.priceInEth}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}
