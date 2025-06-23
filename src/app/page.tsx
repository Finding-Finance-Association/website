import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import About from "@/components/About";
import Mentors from "@/components/Mentors";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

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
