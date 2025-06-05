'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }, 100); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute w-[70vw] h-[70vh] rounded-full bg-green-600/30 blur-[180px]"
        animate={{
          x: `${position.x}%`,
          y: `${position.y}%`,
        }}
        initial={{ x: '30%', y: '30%' }}
        transition={{ duration: 20, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute w-[50vw] h-[50vh] rounded-full bg-emerald-400/30 blur-[150px]"
        animate={{
          x: `${100 - position.x}%`,
          y: `${position.y}%`,
        }}
        initial={{ x: '70%', y: '60%' }}
        transition={{ duration: 8, ease: 'easeInOut' }}
      />
    </div>
  );
}