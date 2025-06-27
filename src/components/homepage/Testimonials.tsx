"use client"

import { motion } from "framer-motion";
import { Star } from "lucide-react";

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

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-br from-green-700 to-blue-700 py-20 w-full flex justify-center">
      <div className="w-5/6 flex flex-col items-center space-y-10">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            What Students Say
          </h2>
          <p className="text-lg md:text-xl text-white max-w-2xl">
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
                &ldquo;{testimonial.content}&rdquo;
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
  )        
}