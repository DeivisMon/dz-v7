import React from "react";
import ShaderEffect from '../components/ShaderOverlay';
import Wiper from "../components/Wiper copy";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";

export default function Index() {
  return (
    <div>
      <NavBar />
      {/* <div
        className="w-full h-screen bg-cover bg-[center_bottom] bg-no-repeat"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div> */}
      <Carousel />
      <Wiper />
    </div>
  );
}
