"use client";
import Header from "@/components/Header";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight,
  Users,
  BookOpen,
  Mail,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = () => {
    // e.preventDefault();
    // Newsletter signup logic here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const mentors = [
    {
      name: "Sarah Chen",
      role: "Investment Banking VP",
      company: "Goldman Sachs",
      image: "/api/placeholder/200/200",
      expertise: "Investment Banking, M&A",
    },
    {
      name: "Michael Rodriguez",
      role: "Portfolio Manager",
      company: "BlackRock",
      image: "/api/placeholder/200/200",
      expertise: "Asset Management, Equity Research",
    },
    {
      name: "Emily Johnson",
      role: "Financial Analyst",
      company: "JPMorgan Chase",
      image: "/api/placeholder/200/200",
      expertise: "Corporate Finance, Risk Management",
    },
    {
      name: "David Park",
      role: "Quantitative Analyst",
      company: "Two Sigma",
      image: "/api/placeholder/200/200",
      expertise: "Quantitative Finance, Algorithmic Trading",
    },
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Finance Student, NYU",
      content:
        "FFA's mentorship program completely transformed my understanding of finance careers. The industry insights were invaluable.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Recent Graduate, Columbia",
      content:
        "The networking events and workshops provided by FFA gave me the confidence and connections I needed to land my dream job.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Finance Student, Harvard",
      content:
        "Thanks to FFA's guidance, I discovered my passion for investment banking and secured an internship at a top firm.",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden flex items-center bg-white">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-400 to-blue-700"
          style={{
            backgroundSize: "200% 200%",
            clipPath: "polygon(0 0%, 100% 0%, 100% 75%, 0% 85%)",
          }}
          initial={{ opacity: 0, backgroundPosition: "75% 50%" }}
          animate={{
            opacity: 1,
            backgroundPosition: ["75% 50%", "60% 50%", "75% 50%"],
          }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            backgroundPosition: {
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
              repeatType: "loop",
              delay: 1,
            },
          }}
        />

        <div className="relative z-10 container mx-auto px-6 flex items-center">
          <div className="w-full lg:w-2/3 space-y-8">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              Finding Finance Association
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              Democratizing Finance Industry Education for Students
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            >
              <Link href="/courses">
                <motion.button
                  className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen size={20} />
                  Explore Courses
                  <ChevronRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="hidden lg:block lg:w-1/3 ml-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          >
            <div className="w-80 h-80 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
              <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center">
                <Image
                  src="/images/graphic.png"
                  alt="FFA logo"
                  width={180}
                  height={180}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-1 bg-green-700 mx-auto mb-8 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              About FFA
            </h2>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row lg:space-x-16 items-center">
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                    Finding Finance Association is dedicated to guiding
                    undergraduate students through the various career paths in
                    finance.
                  </p>
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mt-6">
                    By providing guest speaker events, networking opportunities,
                    hands-on workshops, and personalized mentorship, we equip
                    students with the knowledge and skills needed to navigate
                    and succeed in their chosen finance careers.
                  </p>
                </div>

                <div className="lg:w-1/2 flex flex-col items-center">
                  <motion.div
                    className="w-80 h-80 bg-gradient-to-br from-green-700 to-blue-700 rounded-2xl mb-8 shadow-2xl"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-full h-full bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                      <Image
                        src="/images/about_image.jpg"
                        alt="About Image"
                        width={300}
                        height={300}
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </motion.div>

                  <blockquote className="border-l-4 border-green-700 pl-6 italic text-lg md:text-xl text-green-800 text-center">
                    &quot;Our mission is to demystify the world of finance to help
                    students gain clarity and ownership over their careers.&quot; —
                    Jacob Lebowitz
                  </blockquote>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mentors Section */}
      <section id="mentors" className="bg-white py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Mentors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry professionals who are passionate about guiding
              the next generation of finance leaders.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.name}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-green-700 to-blue-700 rounded-full mx-auto mb-4 shadow-lg">
                  <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <Users size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {mentor.name}
                </h3>
                <p className="text-green-700 font-semibold mb-1">
                  {mentor.role}
                </p>
                <p className="text-gray-600 mb-3">{mentor.company}</p>
                <p className="text-sm text-gray-500">{mentor.expertise}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-green-700 to-blue-700 py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Hear from students who have transformed their finance careers with
              FFA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white rounded-2xl p-8 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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
    </div>
  );
}
