"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/courses", label: "Courses", highlighted: true },
    { href: "/newsletters", label: "Newsletters" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <Image
                  src="/images/ffa-logo.png"
                  alt="FFA logo"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-gray-100 group-hover:ring-green-200 transition-all duration-300"
                />
              </motion.div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block group-hover:text-green-700 transition-colors duration-300">
                Finding Finance Association
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {link.highlighted ? (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-5 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-100"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50 relative group"
                  >
                    {link.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50"
              >
                Login
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/register"
                className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"
                  initial={false}
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <Link
              href="/login"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              Login
            </Link>
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  className="w-5 h-0.5 bg-gray-700 block mb-1 origin-center transition-all duration-300"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="w-5 h-0.5 bg-gray-700 block mb-1 transition-all duration-300"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  className="w-5 h-0.5 bg-gray-700 block origin-center transition-all duration-300"
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {link.highlighted ? (
                      <Link
                        href={link.href}
                        className="block bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-3 rounded-lg font-semibold border border-green-100 mx-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        className="block text-gray-700 hover:text-green-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-all duration-300 mx-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pt-4 border-t border-gray-100 mx-2"
                >
                  <Link
                    href="/register"
                    aria-label="Sign up"
                    className="block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg font-semibold text-center shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
