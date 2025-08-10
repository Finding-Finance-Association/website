// custom 404 page
"use client";
import React from "react";

const NotFound = () => {
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-red-500">404</h1>
        <p className="text-lg text-gray-600 mt-4">
          Oops! Looks like you're lost in the internet wilderness!
        </p>
        <p className="text-gray-500 italic mt-2">
          Don't worry, we got you. Let's get back on track:
        </p>

        <div className="mt-6">
          <img
            src="https://media.giphy.com/media/26FPJj5k3hpdSnpBO/giphy.gif"
            alt="Lost in space"
            className="max-w-full h-auto mx-auto"
          />
        </div>

        <button
          onClick={goHome}
          className="mt-6 px-8 py-3 bg-red-500 text-white text-lg rounded-full hover:bg-red-600 transition"
        >
          Take Me Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
