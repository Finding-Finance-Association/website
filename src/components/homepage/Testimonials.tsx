"use client"

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "WashU Student 25",
    content:
      "The FFA Speaker Series has completely opened my eyes to the wide range of careers in finance. Hearing directly from such impressive and accomplished speakers has made me much more knowledgeable about the industry and far more confident approaching it. Every session leaves me inspired and better prepared for my future.",
    rating: 5,
  },
  {
    name: "Brown Student 25",
    content:
      "I read the FFA newsletter every single week, and the Deal Flow section has become my go-to source for staying on top of market activity. It’s helped me walk into interviews feeling prepared and able to speak confidently about recent deals and industry trends.",
    rating: 5,
  },
  {
    name: "WashU Student 25",
    content:
      "My mentor through FFA has been an incredible resource—both professionally and personally. Over the past year, we’ve developed a great friendship, and their guidance has helped me navigate career decisions, refine my resume, and build the skills I need to succeed.",
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
              key={index}
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )        
}