import Navbar from "../../shared/components/layout/Navbar";
import Hero from "./sections/Hero";
import Search from "./sections/Search";
import Stats from "./sections/Stats";
import Categories from "./sections/Categories";
import Freelancers from "./sections/Freelancers";
import Companies from "./sections/Companies";
import HowItWorks from "./sections/HowItWorks";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Search />
      <Stats />
      <Categories />
      <Freelancers />
      <Companies />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}