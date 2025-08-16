import React from "react";

import Header from ".//homejs/Header";
import Hero from ".//homejs/Hero";
import Benefits from ".//homejs/Benefits";
import CTA from ".//homejs/CTA";
import Features from ".//homejs/Features";
import Howitworks from ".//homejs/Howitworks";
import Footer from ".//homejs/Footer";
// import "./App.css"; 

const Home1 = () => {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      <Howitworks />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home1;
