import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { colors } from "../../config";

const Navbar = styled.div`
  width: 100vw;
  background: ${colors.white};
  top: 0;
  left: 0;
  padding: 20px 16px;
`;

const NavbarContent = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    height: 50px;
  }
  img.logo {
    @media (max-width: 768px) {
      max-width: 75%;
    }
  }
  nav {
    button,
    a {
      background: none;
      outline: none;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      font-family: "Roboto", sans-serif;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: 1.75px;
      font-weight: 700;
      font-stretch: normal;
      color: #0d0d0d;
      text-decoration: none;
      transition: 250ms all;
      &:hover {
        opacity: 0.7;
        color: ${colors.chicagoBlue};
      }
    }
    ul {
      li {
        display: inline;
        list-style: none;
        padding: 8px;
        transition: 250ms all;
        button:after {
          display: inline-block;
          margin-left: 0.255em;
          vertical-align: 0.255em;
          content: "";
          border-top: 0.3em solid;
          border-right: 0.3em solid transparent;
          border-bottom: 0;
          border-left: 0.3em solid transparent;
        }
      }
    }
  }
  ul#mapLinks {
    position: absolute;
    background: ${colors.teal};
    border-radius: 5px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    position: absolute;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    font-size: 1rem;
    li,
    a {
      display: block;
      width: 100%;
      padding: 0.25rem 1.5rem;
      clear: both;
      font-weight: 400;
      color: white;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
    }
  }
  .mainNav {
    @media (max-width: 768px) {
      display: none;
    }
  }
  .mobileNav {
    display: none;
    @media (max-width: 768px) {
      display: initial;
    }
    ul#mapLinks {
      right: 16px;
      li,
      a {
        font-size: 1.25rem;
      }
    }
  }
`;

const StaticNavbar = () => {
  const [mapLinksOpen, setMapLinksOpen] = useState(false);

  const listener = (e) => {
    setMapLinksOpen(false);
  };

  const removeListener = () => {
    window.removeEventListener("click", listener);
    window.removeEventListener("click", removeListener);
  };

  const handleNavOpen = (e) => {
    if (!mapLinksOpen) {
      setTimeout(() => {
        window.addEventListener("click", listener);
        window.addEventListener("click", removeListener);
      }, 250);
    }
    setMapLinksOpen((prev) => !prev);
  };

  return (
    <Navbar>
      <NavbarContent>
        <NavLink to="/">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="ChiVes"
            className="logo"
          />
        </NavLink>
        <nav className="mainNav">
          <ul>
            {/* <li>
                            <NavLink to="/map">Map</NavLink>
                        </li> */}
            <li>
              <NavLink to="/community">My Community</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/data">Data</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>

        <nav className="mobileNav">
          <button onClick={handleNavOpen}>
            <img
              src={`${process.env.PUBLIC_URL}/icons/hamburger.svg`}
              alt="Open navigation icon"
            />
          </button>
          {mapLinksOpen && (
            <ul id="mapLinks">
              {/* <NavLink to="/map">Explore</NavLink> */}
              <NavLink to="/data">Data</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </ul>
          )}
        </nav>
      </NavbarContent>
    </Navbar>
  );
};

export default StaticNavbar;
