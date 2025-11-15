import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Wiper from "../components/Wiper copy 4";
import PortfolioWipers from "../components/PortfolioWipers";
import WorkPage from "../components/WorkPAge";
import GodlyFilters from "../components/Portfolio";


export default function Portfolio() {
  return (
    <div>
      <NavBar />
      <GodlyFilters />
      <Wiper />
    </div>
  );
}
