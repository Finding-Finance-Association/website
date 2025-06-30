"use client";

import { useState } from "react";
import Link from "next/link";
import { auth, googleAuth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Email/Password Sign-In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(
        `Login failed: ${error.code.split("/")[1].replace(/-/g, " ")}`
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // User exists, proceed
        toast.success("Signed in with Google!");
        router.push("/");
      } else {
        // User doesn't exist in Firestore
        toast.error("No user found. Please sign up first.");
        await auth.signOut();
        setTimeout(() => {
          router.push("/register");
        }, 2500);
      }
    } catch (error: any) {
      toast.error(
        `Google Sign-in failed: ${error.code.split("/")[1].replace(/-/g, " ")}`
      );
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden mt-12 animate-fade-in">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="px-6 py-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Sign In
        </h2>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center mb-6 py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-200"
        >
          <img
            src="/images/google.png"
            alt="Google logo"
            className="mr-2 h-5 w-5"
          />
          Sign in with Google
        </button>

        <div className="relative flex items-center mb-6">
          <span className="flex-grow border-t border-gray-300"></span>
          <span className="mx-4 text-gray-500">or</span>
          <span className="flex-grow border-t border-gray-300"></span>
        </div>

        {/* Email & Password Sign-In */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
