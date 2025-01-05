import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import homeImage from "../assets/home-img.png";
import Minter from "./Minter";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Gallery from "./Gallery";
import { DnfcMarketplace_backend } from "../../../declarations/DnfcMarketplace_backend";
import CURRENT_USER_ID from "../main";

function Header() {
  const [userGallery, setUserGallery] = useState(null);
  const [userListedNfts, setUserListedNfts] = useState()
  const [loading, setLoading] = useState(true);

  async function getNfts() {
    try {
      const userNftIds = await DnfcMarketplace_backend.getListOfNfts(CURRENT_USER_ID);
      setUserGallery(userNftIds);

      const nftsForSale = await DnfcMarketplace_backend.userListedNfts();
      console.log("NFTs for sale:", nftsForSale);
      setUserListedNfts(nftsForSale);


    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNfts();
  }, []);

  return (
    <div className="app-root-1">
      <BrowserRouter>
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} alt="OpenD Logo" />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">My NFTs</Link>
            </button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<img className="bottom-space" src={homeImage} alt="Home" />} />

          <Route path="/discover" element={
            loading ? (
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <Gallery role="discover" title="Discover" ids={userListedNfts || []} />
            )
          } />

          <Route path="/minter" element={<Minter />} />
          <Route
            path="/collection"
            element={
              loading ? (
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <Gallery role="collection" ids={userGallery || []} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Header;
