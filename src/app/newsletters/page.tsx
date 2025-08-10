"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsletterCard from "@/components/newsletter/NewsletterCard";
import TitleCard from "@/components/TitleCard";

// Define the Newsletter type
interface Newsletter {
  date: string;
  title: string;
  description: string;
  thumbnail: string;
}

export default function NewsLetterPage() {
  const [allNewsletters, setAllNewsletters] = useState<Newsletter[]>([]);
  // const [showNewsletters, setShowNewsletters] = useState(false);


  // const allNewsletters = [
    // {
    //     date: "2023-01-01",
    //     title: "Newsletter 1",
    //     description: "Description for Newsletter 1",
    //   thumbnail: "/images/newsletter1.jpg",
    // },
    // {
    //   date: "2023-02-01",
    //   title: "Newsletter 2",
    //   description: "Description for Newsletter 2",
    //   thumbnail: "/images/newsletter2.jpg",
    // },
  // ];
      
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };


  return (
    <>
      <Header/>
      <main>
        <TitleCard
          title1="Past" 
          title2="Newsletters"  
          subtext="Explore our archive of past newsletters to stay updated on our activities and initiatives."
        />

        
        <section className="w-full flex justify-center items-center py-16">
          <AnimatePresence mode="wait">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-5/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {allNewsletters.length > 0 ? (
                allNewsletters.map((newsletter) => (
                  <motion.div key={newsletter.date} variants={itemVariants} layout>
                    <NewsletterCard newsletter={newsletter} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full flex flex-col py-16 text-center space-y-4"
                >
                  <h3 className="text-2xl font-semibold text-slate-700">
                    No newsletters found
                  </h3>
                  <p className="text-slate-400 w-2/3 mx-auto">
                    We were unable to retrieve the newsletters at this time. Please check back later or contact us for more information.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
      <Footer/>
    </>
  );
}
