"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { FormEvent } from 'react';


export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully subscribed!');
      } else {
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred. Please try again later.');
      }
    } 
  };

  return (
    <section className="bg-slate-100 py-20 w-full flex justify-center">
      <motion.div
        className="max-w-3xl w-5/6 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <Mail size={60} className="mx-auto mb-6 text-green-700" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-l md:text-xl text-gray-600 mb-8">
            Get the latest insights, event notifications, and career
            opportunities delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              />
            </div>
           
            <motion.button
              type="submit"
              className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
            {message && (
              <p
                className='text-sm font-medium text-slate-700'
                role="alert"
              >
                {message}
              </p>
            )}

            <p className="text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}