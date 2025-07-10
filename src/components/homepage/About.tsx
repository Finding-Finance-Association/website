"use client"

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="bg-slate-100 pb-20 pt-10 w-full flex justify-center">
      <div className="w-5/6 flex flex-col items-center space-y-10">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="w-24 h-1 bg-green-700 mx-auto rounded-full"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            About
          </h2>
        </motion.div>

        <motion.div
          className=""
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row lg:space-x-16 items-center">
              <div className="lg:w-1/2 mb-8 lg:mb-0 text-l md:text-xl">
                <p className="text-gray-700 leading-relaxed">
                  Finding Finance Association is dedicated to guiding
                  undergraduate students through the various career paths in
                  finance.
                </p>
                <p className="text-gray-700 leading-relaxed mt-6">
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

                <div className="pl-6 italic text-lg md:text-xl text-green-800 text-center">
                  <blockquote>
                    &quot;Our mission is to demystify the world of finance to help
                    students gain clarity and ownership over their careers.&quot;
                  </blockquote>
                  <span>— Jacob Lebowitz</span>
                </div>
                
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}