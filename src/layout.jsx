import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";
import WarningBanner from "./components/general/WarningBanner";
import FooterDisclaimer from "./components/general/FooterDisclaimer";

function Layout({ children }) {

  return (
    <>
      <WarningBanner />
      <Navbar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
      <FooterDisclaimer />
    </>
  );
}

export default Layout;