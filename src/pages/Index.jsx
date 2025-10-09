import React from "react";
import bgImg from "../assets/img14.jpg";
import Wiper from "../components/Wiper copy";
// import Logo from "../components/Logo";
import NavBar from "../components/NavBar";

export default function Index() {
  return (
    <div>
      <NavBar />
      <div
        className="w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      {/* <Logo /> */}
      <Wiper />
    </div>
  );
}
