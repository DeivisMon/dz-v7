import React from "react";
import Wiper from "../components/Wiper copy";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

export default function Index() {
  return (
    <div>
      <NavBar />
      <Carousel />
      <Footer />
      <Wiper />
    </div>
  );
}
