import React from "react";
import Image from "next/image";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

function ProductCard({ product }) {
  const { addProduct, account } = useContext(TransactionContext);

  const handleBuyNow = () => {
    addProduct(
      product.brand,
      product.model,
      product.image,
      product.price,
      // date in YYYY-MM-DD format
      new Date().toISOString().slice(0, 10),
      account
    );
    console.log("ProductID: ", typeof product.productId.toString());
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt="Product"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{product.brand}</div>
        <p className="text-gray-700 text-base mb-2">{product.model}</p>
        <p className="text-gray-700 text-base font-bold mb-2">
          {product.price} ETH
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleBuyNow()}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
