import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Title from "@/components/homepage/Title";
import About from "@/components/homepage/About";
import Mentors from "@/components/homepage/Mentors";
import Testimonials from "@/components/homepage/Testimonials";
import Newsletter from "@/components/homepage/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="flex flex-col min-h-screen">
        <Title/>
        <About/>
        <Mentors/>
        <Testimonials/>     
        <Newsletter/> 
      </div>
      <Footer/>
    </>
  );
}
