'use client';

import { useState } from 'react';
import Link from 'next/link';

import {auth, googleAuth} from '../lib/firebase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  console.log(isSignUp)
  console.log(auth.currentUser?.email)
  const handleGoogleSignIn = async() => {
    try {
            await signInWithPopup(auth,googleAuth );
        } catch (error) {
            console.error("Google Authentication Failed:", error)
        }
    
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(auth.currentUser?.email)
    try {
      if(isSignUp && password !== confirmPassword){
        alert("Passwords do not match");
        return;
      }
      if(isSignUp){
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("CreateUserwithEmailandPassword Triggered")
      }
      else{
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      console.error("Authentication Error:", e);
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            {isSignUp ? "Create Account" : "Login"}
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
            </div>
            
            {isSignUp && (
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
)}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
             {/* <Link href="/register" className="text-green-600 hover:text-green-800 font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Link> */}
            <button type='button' onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

