"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState("");
  
  const handleNewsletterSubmit = () => {
    // e.preventDefault();
    // Newsletter signup logic here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="bg-gray-50 py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
              <Mail size={60} className="mx-auto mb-6 text-green-700" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get the latest insights, event notifications, and career
                opportunities delivered to your inbox.
              </p>

              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  />
                  <motion.button
                    onClick={handleNewsletterSubmit}
                    className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
  );
}