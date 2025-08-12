"use client";

import { useState } from "react";
import Link from "next/link";
import { auth, googleAuth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle Google Register
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        toast.success("Already registered. Redirecting...");
        router.push("/");
      } else {
        const usernameFromEmail = user.email?.split("@")[0] || "user";
        await setDoc(userDocRef, {
          username: usernameFromEmail,
          email: user.email,
          createdAt: new Date(),
        });

        toast.success("Registration successful with Google!");
        router.push("/");
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code.split("/")[1].replace(/-/g, " ")
        : "Unknown error";
      toast.error(`Google Sign-in failed: ${errorMessage}`);
    }
  };

  // Handle Email/Password Register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      });

      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code.split("/")[1].replace(/-/g, " ")
        : "Unknown error";
      toast.error(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white shadow-md rounded-lg overflow-hidden mt-12 animate-fade-in">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="px-6 py-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create an Account
        </h2>

        {/* Google Registration */}
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-200"
        >
          <Image src="/images/google.png" alt="Google logo" className="mr-2 h-5 w-5" />
          Sign up with Google
        </button>

        <div className="relative flex items-center my-4">
          <span className="flex-grow border-t border-gray-300"></span>
          <span className="mx-4 text-gray-500">or</span>
          <span className="flex-grow border-t border-gray-300"></span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Register
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
