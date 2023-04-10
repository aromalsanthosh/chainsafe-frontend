import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";
import Wallet from "../components/Wallet";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Shop() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios
      .get("http://3.7.157.248:3000/api/products")
      .then((res) => {
        console.log(res.data);
        setProductList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(productList);
  }, []);

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
        {productList.map((product) => (
          <ProductCard
            key = {product.productId}
            imageUrl={product.image}
            brand={product.brand}
            model={product.model}
            priceInEth={product.price}
          />
        ))}

      </div>
      <Footer />
    </div>
  );
}
