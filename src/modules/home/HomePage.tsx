import Navbar from "../../shared/components/layout/Navbar";
import Hero from "./components/Hero";
import Search from "./components/Search";
import Stats from "./components/Stats";
import Categories from "./components/Categories";
import Companies from "./components/Companies";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Search />
      <Stats />
      <Categories />
      <Companies />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}