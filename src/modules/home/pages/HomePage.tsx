import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import Hero from "../components/Hero";
import Search from "../components/Search";
import Stats from "../components/Stats";
import Categories from "../components/Categories";
import Companies from "../components/Companies";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

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