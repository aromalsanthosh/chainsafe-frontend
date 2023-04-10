import React from "react";
import Image from "next/image";

function ProductCard({ imageUrl, brand, model, priceInEth }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt="Product"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{brand}</div>
        <p className="text-gray-700 text-base mb-2">{model}</p>
        <p className="text-gray-700 text-base font-bold mb-2">{priceInEth} ETH</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
