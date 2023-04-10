import React from "react";

function Wallet({ address, balance }) {
  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <p className="text-gray-500">Wallet Address:</p>
      <h1 className="text-gray-800 font-medium mb-2">{address}</h1>
      <p className="text-gray-500">Balance:</p>
      <h2 className="text-green-600 font-bold text-xl">{balance} ETH</h2>
    </div>
  );
}

export default Wallet;
