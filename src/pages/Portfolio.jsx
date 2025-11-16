import React , { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Wiper from "../components/Wiper copy 5";
import PortfolioWipers from "../components/PortfolioWipers";
import WorkPage from "../components/WorkPAge";
import GodlyFilters from "../components/Portfolio";


export default function Portfolio() {
  const [showWiper, setShowWiper] = useState(true);


  return (
    <div>
      <NavBar />
      <GodlyFilters />
       {showWiper && <Wiper onComplete={() => setShowWiper(false)} />}
    </div>
  );
}
