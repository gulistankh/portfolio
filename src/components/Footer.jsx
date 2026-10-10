import React, { useState, useEffect } from "react";
import { 
  FiLinkedin, 
  FiSend, 
  FiMail, 
  FiArrowUpRight, 
  FiClock 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const SOCIALS = [
  {
    name: "LinkedIn",
    handle: "Connect professionally",
    href: "https://www.linkedin.com/in/gulistan-kh/",
    icon: FiLinkedin,
  },
  {
    name: "WhatsApp",
    handle: "Quick Chat",
    href: "https://wa.me/9647511233748",
    icon: FaWhatsapp,
  },
  {
    name: "Telegram",
    handle: "Direct Message",
    href: "https://t.me/gulistankh",
    icon: FiSend,
  },
  {
    name: "Email",
    handle: "Send an Inquiry",
    href: "mailto:gulistan.kh851@gmail.com",
    icon: FiMail,
  },
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Credentials", href: "#credentials" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Disables AM/PM and uses 24-hour time (e.g. 14:30:05)
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <footer className="ft-site-footer" id="footer">
      <style>{`
        /* Full-Bleed Viewport Wrapper */
        .ft-site-footer {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          background-color: #0d0a14;
          color: #d1d5db;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 4.5rem 1.5rem 2rem;
          box-sizing: border-box;
          overflow: hidden;
        }

        .ft-container {
          max-width: 76rem;
          margin: 0 auto;
          width: 100%;
        }

        /* Balanced 3-Column Grid Layout */
        .ft-main-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1.8fr;
          gap: 3.5rem;
          padding-bottom: 3.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          text-align: left;
          align-items: start;
        }

        .ft-brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.02em;
        }

        .ft-brand-desc {
          color: #9ca3af;
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 24rem;
          margin: 0 0 1.5rem 0;
        }

        .ft-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          color: #4ade80;
          font-weight: 500;
        }

        .ft-pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 10px #22c55e;
        }

        .ft-section-heading {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6b7280;
          margin-bottom: 1.25rem;
          font-weight: 700;
        }

        .ft-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .ft-nav-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .ft-nav-link:hover {
          color: #ff78cb;
          padding-left: 4px;
        }

        .ft-socials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .ft-social-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          color: #e5e7eb;
          text-decoration: none;
          transition: all 0.25 ease;
        }

        .ft-social-card:hover {
          background: rgba(255, 120, 203, 0.12);
          border-color: rgba(255, 120, 203, 0.4);
          transform: translateY(-2px);
          color: #ffffff;
        }

        .ft-social-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .ft-social-icon {
          font-size: 1.1rem;
          color: #ff78cb;
          transition: color 0.2s ease;
        }

        .ft-social-card:hover .ft-social-icon {
          color: #ffffff;
        }

        .ft-social-name {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .ft-arrow-icon {
          font-size: 0.85rem;
          opacity: 0.4;
          transition: all 0.2s ease;
        }

        .ft-social-card:hover .ft-arrow-icon {
          opacity: 1;
          transform: translate(2px, -2px);
          color: #ff78cb;
        }

        .ft-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          font-size: 0.875rem;
          color: #6b7280;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .ft-clock-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.875rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 900px) {
          .ft-main-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .ft-socials-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }
      `}</style>

      <div className="ft-container">
        <div className="ft-main-grid">
          {/* Column 1: Brand & Availability Status */}
          <div>
            <h3 className="ft-brand-title">Gulistan</h3>
            <p className="ft-brand-desc">
              Full-Stack Developer & UI/UX Designer crafting functional, market-ready web applications.
            </p>
            <div className="ft-live-badge">
              <span className="ft-pulse-dot" />
              <span>Available for new projects</span>
            </div>
          </div>
          {/* Column 3: Social Links */}
          <div id="socialMedia">
            <div className="ft-section-heading">Connect</div>
            <ul className="ft-socials-grid">
              {SOCIALS.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-social-card"
                  >
                    <div className="ft-social-info">
                      <Icon className="ft-social-icon" />
                      <span className="ft-social-name">{name}</span>
                    </div>
                    <FiArrowUpRight className="ft-arrow-icon" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Column 2: Quick Navigation */}
          <div>
            <div className="ft-section-heading">Navigation</div>
            <ul className="ft-nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="ft-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Real-time Clock & Copyright Bar */}
        <div className="ft-bottom-bar">
          <div className="ft-clock-box">
            <FiClock />
            <span>{formattedDate} — {formattedTime}</span>
          </div>

          <div>
            © {time.getFullYear()} Gulistan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}