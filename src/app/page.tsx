import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Title from "@/components/homepage/Title";
import About from "@/components/homepage/About";
import Mentors from "@/components/homepage/Mentors";
import Testimonials from "@/components/homepage/Testimonials";
import Newsletter from "@/components/homepage/Newsletter";

export default function Home() {
  return (
    <>
      <Header/>
      <Title/>
      <About/>
      <Mentors/>
      <Testimonials/>     
      <Newsletter/> 
      <Footer/>
    </>
  );
}
