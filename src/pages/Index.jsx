import React from "react";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import WiperIndex from "../components/Wiper Index";
import WiperContactMobile from '../components/Wiper Contact Mobile'
import Slider from "../components/Slider";



export default function Index() {
  return (
    <div>
      <NavBar />
      <Slider />
      {/* <Carousel /> */}
      <Footer />
      {/* <WiperIndex /> */}
      <WiperContactMobile />
    </div>
  );
}
