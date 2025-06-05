"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/60 backdrop-blur-md shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/images/ffa-logo.png"
                alt="FFA logo"
                width={48}
                height={48}
                className="rounded-full"
              />
            </motion.div>
            <span className="text-lg font-semibold text-gray-800 hidden sm:inline">
              Finding Finance
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-4 text-sm font-medium ml-4">
          <Link
            href="/about"
            className="text-gray-800 hover:text-green-600 transition"
          >
            About
          </Link>
          <Link
            href="/events"
            className="text-gray-800 hover:text-green-600 transition"
          >
            Events
          </Link>
          {/* Center: Highlighted Courses Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/courses"
              className="bg-gradient-to-t from-green-100 to-white text-green-700 py-2 px-5 font-bold shadow-sm hover:shadow-md transition text-sm "
            >
              Courses
            </Link>
          </motion.div>

          <Link
            href="/newsletters"
            className="text-gray-800 hover:text-green-600 transition"
          >
            Newsletters
          </Link>
        </div>

        {/* Right: Login / Signup */}
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link
            href="/login"
            className="text-gray-800 hover:text-green-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-600 hover:bg-green-100 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
