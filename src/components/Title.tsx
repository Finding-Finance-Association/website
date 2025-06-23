"use client"

import Image from "next/image"
import Link from "next/link"

import { motion } from "framer-motion"
import { ChevronRight, BookOpen } from "lucide-react"

export default function Title() {
  return (
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
  )
}