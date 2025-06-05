"use client";

import Header from "@/components/Header";
import Register from "@/components/Register";

export default function RegisterPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
          <Register />
        </main>
      </div>
    </>
  );
}
