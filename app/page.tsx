import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Trust from "./components/Trust";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Certifications from "./components/Certifications";
import Testimonials from "./components/Testimonials";
import Blogs from "./components/Blogs";
import Collaborate from "./components/Collaborate";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative w-full">
      <Header />
      <main className="w-full -mt-[100px]">
        <Hero />
        <Services />
        {/* <Trust />
        <Portfolio />
        <About />
        <Certifications />
        <Testimonials />
        <Blogs />
        <Collaborate />
        <Footer /> */}
      </main>
    </div>
  );
}
