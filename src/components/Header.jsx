import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiArrowUpRight, FiCode } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Credentials", href: "#credentials" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`hd-site-header ${scrolled ? "hd-scrolled" : ""}`}>
      <style>{`
        .hd-site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.25rem 1.5rem;
          transition: all 0.3s ease;
          background: transparent;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
        }

        .hd-site-header.hd-scrolled {
          padding: 0.5rem 1.5rem;
          background: rgba(13, 10, 20, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .hd-container {
          max-width: 76rem;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hd-logo {
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          color: #ff78cb;
          font-weight: 700;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
        }
 
        .hd-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .hd-nav-list {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .hd-nav-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .hd-nav-link:hover {
          color: #ff78cb;
        }

        .hd-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0rem;
          background: #ffffff;
          color: #0d0a14;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .hd-cta-btn:hover {
          background: #ff78cb;
          transform: translateY(-1px);
        }

        .hd-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
        }@media (max-width: 868px) {
          .hd-nav-list, .hd-cta-btn {
            display: none;
          }

          .hd-mobile-toggle {
            display: block;
          }

          .hd-mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #0d0a14;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }

          .hd-mobile-menu .hd-nav-link {
            font-size: 1.1rem;
            display: block;
          }

          .hd-mobile-menu .hd-cta-btn {
            display: inline-flex;
            justify-content: center;
            width: 90%;
            margin-top: 0.5rem;
         
          }
        }
      `}</style>

      <div className="hd-container">
        {/* Brand Logo */}
        <a href="#" className="hd-logo">
          {/* <span className="hd-logo-icon">
            <FiCode />
          </span> */}
          <span>Gulistan</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hd-nav">
          <ul className="hd-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hd-nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a href="#socialMedia" className="hd-cta-btn">
            <span>Let's Talk</span>
            <FiArrowUpRight />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="hd-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="hd-mobile-menu">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hd-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#socialMedia"
            className="hd-cta-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Let's Talk</span>
            <FiArrowUpRight />
          </a>
        </div>
      )}
    </header>
  );
}