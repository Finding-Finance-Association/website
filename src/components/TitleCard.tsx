"use client";
import { motion } from "framer-motion";

export default function TitleCard(
  {title1, title2, subtext}: {title1: string, title2: string, subtext: string}
) {
  return (
    <motion.div
      className="w-full bg-gradient-to-br from-green-700 via-green-400 to-blue-700 flex justify-center items-center shadow-lg"
      style={{
        backgroundSize: "200% 200%",
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
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-5/6 z-10 mt-32 mb-16 space-y-6 text-center text-4xl sm:text-6xl font-bold text-gray-900"
      >
        {title1}{" "}
        <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          {title2}
        </span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl lg:w-2/3 mx-auto font-normal text-slate-100 leading-relaxed"
        >
          {subtext}
        </motion.p>
      </motion.h1>
    </motion.div>
  );
};