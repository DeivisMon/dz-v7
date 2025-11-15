import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Wiper from "../components/Wiper copy 3";
import PortfolioWipers from "../components/PortfolioWipers";
import WorkPage from "../components/WorkPAge";

export default function Portfolio() {
  return (
    <div>
      <NavBar />
      <WorkPage />
      <Wiper />
    </div>
  );
}
