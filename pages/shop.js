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
  // const [purchasedList, setPurchasedList] = useState([]);
  // hard coded for now
  const purchasedList = [
    {
      productId: 1,
      imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1657641867367?imwidth=1920",
      brand: "Apple",
      model: "iPhone 13 Pro",
      price: 1.5,
    },
  ]
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    axios
      .get("https://chainsafe-server.onrender.com/api/products")
      .then((res) => {
        console.log(res.data);
        setProductList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(productList);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Head>
        <title>ChainSafe | Shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Welcome name="Aromal" />
      <Wallet address="0x1234567890abcdef" balance="5.4321" />
      {/* tab container */}
      <div className="flex justify-center mb-4 mt-4">
        <button
          className={`px-4 py-2 rounded-tl-md rounded-bl-md ${
            activeTab === "all" ? "bg-blue-400 text-white" : ""
          }`}
          onClick={() => handleTabChange("all")}
        >
          All Products
        </button>
        <button
          className={`px-4 py-2 rounded-tr-md rounded-br-md ${
            activeTab === "purchased" ? "bg-blue-400 text-white" : ""
          }`}
          onClick={() => handleTabChange("purchased")}
        >
          Purchased Products
        </button>
      </div>
      {/* products container responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {activeTab === "all" &&
          productList.map((product) => (
            <ProductCard
              key={product.productId}
              imageUrl={product.image}
              brand={product.brand}
              model={product.model}
              priceInEth={product.price}
            />
          ))}
        {activeTab === "purchased" &&
          purchasedList.map((product) => (
            <ProductCard
              key={product.productId}
              imageUrl={product.imageUrl}
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
