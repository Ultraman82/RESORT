import React from "react";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Services from "../components/Services";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <React.Fragment>
      <Hero>
        <Banner
          title=" luxurious room "
          subtitle="delux rooms starting at $299"
        >
          <Link to="/rooms" className="btn-primary">
            our rooms
          </Link>
        </Banner>
      </Hero>
      <Services></Services>
    </React.Fragment>
  );
}
