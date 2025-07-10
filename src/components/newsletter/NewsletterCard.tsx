"use client";
import Link from "next/link";
// import Image from "next/image";
import { motion } from "framer-motion";

interface Newsletter {
  date: string;
  title: string;
  description: string;
  thumbnail: string;
}

export default function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="min-w-56 group relative bg-white rounded-xl shadow-lg overflow-hidden transition h-full flex flex-col"
    >
      {/* <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={newsletter.thumbnail}
          alt={newsletter.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority
        />
      </div> */}

      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-gray-800">
          {newsletter.title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {newsletter.description}
        </p>

        <div className="mt-auto">
          <Link href={`/newsletters/${newsletter.date}`}>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition font-medium">
              View
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
