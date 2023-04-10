import React from "react";

function Welcome({ name }) {
  return (
    <div className="bg-blue-500 text-white p-4">
      <h1 className="text-xl font-bold">Welcome, {name}!</h1>
      <p className="text-sm">We're glad to have you here.</p>
    </div>
  );
}

export default Welcome;
