"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import NewsletterCard from "@/components/newsletter/NewsletterCard";
import TitleCard from "@/components/TitleCard";

export default function NewsLetterPage() {
  return (
    <>
      <Header/>
      <main>
        
        <TitleCard
          title1="Past" 
          title2="Newsletters"  
          subtext="Explore our archive of past newsletters to stay updated on our activities and initiatives."
        />
      </main>
      <Footer/>
    </>
  );
}
