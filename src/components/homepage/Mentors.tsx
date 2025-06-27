"use client"

import { motion } from "framer-motion";
import { Users } from "lucide-react";

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

export default function Mentors() {
  return (
    <section id="mentors" className="bg-white py-20 px-4 w-full flex justify-center">
      <div className="w-5/6 flex flex-col items-center space-y-10">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Mentors
          </h2>
          <p className="text-l md:text-xl text-gray-600 max-w-2xl">
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
  )
}