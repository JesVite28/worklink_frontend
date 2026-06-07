import Navbar from "../../components/layout/Navbar";
import Hero from "./sections/Hero";
import Search from "./sections/Search";
import Stats from "./sections/Stats";
import Categories from "./sections/Categories";
import Freelancers from "./sections/Freelancers";
import Companies from "./sections/Companies";

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
    </>
  );
}