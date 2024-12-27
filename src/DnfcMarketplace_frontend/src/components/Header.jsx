import React from "react";
import logo from "../assets/logo.png";
import homeImage from "../assets/home-img.png";
import Minter from "./Minter";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Gallery from "./Gallery";

function Header() {
  return (
    <div className="app-root-1">
      <BrowserRouter>
        {/* BrowserRouter is a component that wraps the entire application and provides routing capabilities to the application. It is used to create a new router context that will be used by the entire application. */}
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to={"/"}>
              {/* Link is a component that is used to navigate between different routes in the application. It is used to create a hyperlink that will navigate to a new route when clicked. */}
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">
                Discover
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">
                Minter
              </Link >
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to={"/collection"}>
                My NFTs
              </Link>
            </button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<img className="bottom-space" src={homeImage} />} />
          {/* Route is a component that is used to define a route in the application. It is used to specify the path of the route (Which is matched through LINK) and the component that should be rendered when the route is matched. */}
          <Route path="/discover" element={<h1>Will release this soon, Stay tuned!</h1>} />
          <Route path="/minter" element={<Minter />} />
          <Route path="/collection" element={<Gallery />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default Header;
