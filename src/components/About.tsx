"use client"

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
    return (
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
    );
}