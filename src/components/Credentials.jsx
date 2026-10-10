import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiGlobe, FiMaximize2, FiX } from "react-icons/fi";

// Images live in src/assets (this file sits in src/components/). Rename here if your file names differ.
import fullStack from "../assets/fullStackDev.jpg";
import figmaAdvanced from "../assets/figmaA.png";
import figmaEssentials from "../assets/figmaE.png";
import responsive from "../assets/RWD.png";

/* ───────────── CONTENT (edit these) ───────────── */
// school / year are hidden until you fill them in
const EDUCATION = { degree: "Bachelor's Degree in Engineering", school: "UOD", year: "October 2023" };

const CERTIFICATES = [
  {
    title: "The Complete Full-Stack Web Development Bootcamp",
    issuer: "Udemy",
    date: "September 2026",
    image: fullStack,
    pos: "50% 50%",   // which part of the image the thumbnail shows
    verifyUrl: "",    // optional: paste your certificate link to show a "Verify" link
  },
  {
    title: "Figma: Advanced Training",
    issuer: "Bring Your Own Laptop",
    date: "January 2026",
    image: figmaAdvanced,
    pos: "44% 50%",
    verifyUrl: "",
  },
  {
    title: "Figma: Essentials Training",
    issuer: "Bring Your Own Laptop",
    date: "November 2025",
    image: figmaEssentials,
    pos: "44% 50%",
    verifyUrl: "",
  },
  {
    title: "Responsive Web Design: Essentials Training",
    issuer: "Bring Your Own Laptop",
    date: "December 2025",
    image: responsive,
    pos: "44% 50%",
    verifyUrl: "",
  },
];

// level is hidden until you fill it in (e.g. "Native", "Fluent", "Professional")
const LANGUAGES = [
  { name: "English", level: "" },
  { name: "Persian", level: "" },
  { name: "Kurdish", level: "" },
];

const ease = [0.22, 1, 0.36, 1];

export default function Credentials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const open = active !== null;
  const closeBtn = useRef(null);
  const lastFocus = useRef(null);
  const total = CERTIFICATES.length;

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { duration: 0.8, delay, ease },
  });

  // lightbox: Esc to close, arrow keys to browse, page scroll locked while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus();
    };
  }, [open, total]);

  const current = open ? CERTIFICATES[active] : null;
  const eduMeta = [EDUCATION.school, EDUCATION.year].filter(Boolean).join(" · ");

  return (
    <section id="credentials" className="cr-section">
      <style>{`
        .cr-section{
          --cr-bg:#000000;   /* must match the hero's endColor and the other sections */
          --cr-from:#ff78cb;           /* heading gradient start */
          --cr-to:#ff78cb;             /* heading gradient end */
          background:var(--cr-bg);
          color:#f6f3ec
        }
        .cr-wrap{
          max-width:76rem;
          margin:0 auto;
          padding:clamp(2rem,10vw,5rem) 1.5rem
        }
        .cr-head{
          text-align:left;
          max-width:50rem;
          margin-bottom:clamp(2.5rem,6vw,4rem)
        }
        .cr-eyebrow{
          font:600 .8rem/1 system-ui,sans-serif;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:rgba(0, 60, 255);
          margin:0 0 1rem;
          text-align:left
        }
        .cr-kicker{
          font:600 .8rem/1 system-ui,sans-serif;
          letter-spacing:.18em;
          text-transform:uppercase;
          color: rgb(174, 175, 177);
          margin:0 0 1rem;
          text-align:left
        }
        .cr-h2{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.5rem,4.6vw,1.9375rem);
          line-height:1.5;
          letter-spacing:-.02em;
          margin:0 0 .8rem;
          text-wrap:balance;
          color:var(--cr-from);
          background:linear-gradient(90deg,var(--cr-from),var(--cr-to));
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent
        }
        .cr-sub{
          font:400 clamp(0.9375rem,1.6vw,1rem)/1.7 system-ui,sans-serif;
          color:#c9cde6;margin:0
        }
        .cr-block{
          margin-top:clamp(3rem,7vw,5rem)
        }

        /* education + languages: compact info rows */

        .cr-mini{
          display:flex;
          align-items:center;
          gap:1rem;
          text-align:left
        }

        .cr-mini {
          margin:1 0 .4rem;
          font-size:.72rem
        }
        .cr-mini-text{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.15rem,2vw,1.4rem);
          line-height:1.3;
          margin:0;
          color:#f6f3ec
        }
        .cr-mini-meta{
          font:500 .7rem/1.4 system-ui,sans-serif;
          color:rgb(129, 129, 129);
          margin:.3rem 0 0
        }

        /* certificates: four in a row on desktop, swipeable row on smaller screens */

        .cr-grid{
          display:flex;
          gap:1rem;
          margin:0;
          padding:.3rem 0 3.1rem;
          list-style:none;
          overflow-x:auto;
          scroll-snap-type:x mandatory;
          scrollbar-width:thin;
          scrollbar-color:rgba(243, 100, 172, 0.27) transparent
        }
        .cr-grid>li{
          flex:0 0 min(72%,15rem);
          scroll-snap-align:start
        }
        @media(min-width:960px){
          .cr-grid{display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:1.2rem;
          overflow:visible;
          padding:0
        }
        .cr-grid>li{
          flex:none
        }
        }
        .cr-thumb{
          position:relative;
          display:block;
          width:100%;
          padding:0;
          aspect-ratio:4/3;
          overflow:hidden;
          cursor:zoom-in;
          border-radius:.9rem;
          border:1px solid rgba(0, 60, 255, 0.14);
          background:#07080f;
          transition:transform .5s cubic-bezier(.22,1,.36,1),border-color .4s,box-shadow .5s
        }
        .cr-thumb img{
          display:block;
          width:100%;
          height:100%;
          object-fit:cover;
          transition:transform 1s cubic-bezier(.22,1,.36,1)
        }
        .cr-thumb:hover,.cr-thumb:focus-visible{
          transform:translateY(-6px);
          border-color: rgba(0, 60, 255, 0.14);
          box-shadow:0 24px px -2px  rgba(0, 60, 255, 0.85)
        }
        .cr-thumb:hover img{
          transform:scale(1.05)
        }
        .cr-thumb:focus-visible{
          outline:3px solid  rgba(0, 60, 255, 0.14);
          outline-offset:3px
        }
        .cr-view{
          position:absolute;
          left:.7rem;
          bottom:.7rem;
          display:inline-flex;
          align-items:center;
          gap:.4rem;
          padding:.4rem .7rem;border-radius:999px;
          font:500 .75rem/1 system-ui,sans-serif;
          color:#f4efe6;
          background:rgba(0,0,0,.6);
          border:1px solid rgba(244,239,230,.3);
          -webkit-backdrop-filter:blur(6px);
          backdrop-filter:blur(6px);
          opacity:0;
          transform:translateY(6px);
          transition:opacity .3s,transform .3s
        }
        .cr-thumb:hover .cr-view,.cr-thumb:focus-visible .cr-view{
          opacity:1;transform:none
        }
        @media(hover:none){
          .cr-view{
            opacity:1;
            transform:none}
          }
        .cr-cap{
          text-align:left;
          padding-top:.8rem
        }
        .cr-title{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:1.02rem;
          line-height:1.3;
          margin:0 0 .35rem;
          color:#f6f3ec
        }
        .cr-meta{
          font:500 .7rem/1.4 system-ui,sans-serif;
          color:rgb(129, 129, 129);
          margin:0
        }
        .cr-verify{
          color:#ffb36b;
          text-decoration:none;
          font-weight:600;
          margin-left:.5rem
        }
        .cr-verify:hover{
          text-decoration:underline
        }

        .cr-langs{
          display:flex;
          flex-wrap:wrap;
          align-items:baseline;
          gap:.2rem 0;
          margin:0;
          padding:0;
          list-style:none
        }
        .cr-lang{
          cursor:default;
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.15rem,2vw,1.4rem);
          line-height:1.3;
          color:#f6f3ec;
          transition:color .3s
        }
        .cr-lang:hover{
          color:#ff78cb
        }
        .cr-lang:not(:last-child)::after{
          content:"\u00b7";
          color:#ff78cb;
          font-weight:900;
          margin:0 .7rem
        }
        .cr-level{
          font:500 .85rem/1 system-ui,sans-serif;
          color:#c9cde6;
          margin-left:.45rem
        }

        /* lightbox */
        .cr-lb{
          position:fixed;
          inset:0;z-index:1000;
          display:grid;
          place-items:center;
          padding:1rem;
          background:rgba(0,0,0,.88);
          -webkit-backdrop-filter:blur(8px);
          backdrop-filter:blur(8px)
        }
        .cr-fig{
          margin:0;
          max-width:min(94vw,1100px);
          text-align:center
        }
        .cr-fig img{
          display:block;
          max-width:100%;
          max-height:78vh;
          margin:0 auto;
          border-radius:.75rem;
          box-shadow:0 30px 90px -20px rgba(0,0,0,.9)
        }
        .cr-fig figcaption{
          margin-top:1rem;
          font:500 .95rem/1.4 system-ui,sans-serif;
          color:#d6d9ee
        }
        .cr-btn{
          position:absolute;
          display:grid;
          place-items:center;
          width:2.9rem;
          height:2.9rem;
          border-radius:50%;
          cursor:pointer;
          color: #ff78cb;
          background: #77717546;
          border:1px solid #ff78cb;
          font-size:1.3rem;
          transition:background .2s,border-color .2s
        }
        .cr-btn:hover{
          color: #003cff;
          background: #77717546;
          border-color:#003cff
        }
        .cr-btn:focus-visible{
          outline:3px solid #003cff;
          outline-offset:3px
        }
        .cr-close{
          top:1rem;
          right:1rem
        }
        .cr-prev{
          left:1rem;
          top:50%;
          translate:0 -50%
        }
        .cr-next{
          right:1rem;
          top:50%;
          translate:0 -50%
        }
       @media (max-width: 600px) {
          .cr-prev,
          .cr-next {
            position: fixed; /* Ensures they stay pinned relative to the visible screen */
            top: auto;
            bottom: clamp(2.5rem, 4vh, 4rem); /* Dynamically adjusts between 1.5rem and 4rem depending on screen height */
            translate: none;
            z-index: 100; /* Keeps buttons above modal content/backdrop */
          }
        
          .cr-prev {
            left: clamp(1rem, 4vw, 2.5rem);
          }
        
          .cr-next {
            right: clamp(1rem, 5vw, 2.5rem);
          }
        }
       @media(max-width:600px){
          .cr-prev,.cr-next,.cr-close{
             position: absolute;
             display: grid;
             place-items: center;
             width: auto;                  /* Removes fixed circle width */
             height: auto;                 /* Removes fixed circle height */
             padding: 0.5rem;              /* Gives a comfortable tap target for mobile */
             border-radius: 0;             /* Removes rounded circle shape */
             cursor: pointer;
             color: #686667;
             background: none;             /* Removes the circle background */
             border: none;                 /* Removes the circle border */
             font-size: 1.5rem;
         }

        @media(prefers-reduced-motion:reduce){
          .cr-thumb,.cr-thumb img,.cr-view,.cr-lang{transition:none}
          .cr-thumb:hover,.cr-thumb:focus-visible{transform:none}
          .cr-thumb:hover img{transform:none}
        }
      `}</style>

      <div className="cr-wrap">
        <div className="cr-head">
          <motion.p className="cr-eyebrow" {...reveal(0)}>
            Credentials
          </motion.p>
          <motion.h2 className="cr-h2" {...reveal(0.08)}>
            The training behind every build
          </motion.h2>
          <motion.p className="cr-sub" {...reveal(0.16)}>
            My education, the courses I've completed, and the languages I work
            in.
          </motion.p>
        </div>

        {/* 1. Education */}
        <motion.div className="cr-mini" {...reveal(0)}>
          <div>
            <p className="cr-kicker">Education</p>
            <p className="cr-mini-text">{EDUCATION.degree}</p>
            {eduMeta && <p className="cr-mini-meta">{eduMeta}</p>}
          </div>
        </motion.div>

        {/* 2. Certificates */}
        <div className="cr-block">
          <hr className="cr-divider" />
          <motion.p className="cr-kicker" {...reveal(0)}>
            Certifications
          </motion.p>
          <ul className="cr-grid">
            {CERTIFICATES.map((c, i) => (
              <motion.li
                key={c.title}
                initial={reduce ? false : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.1, ease }}
              >
                <button
                  type="button"
                  className="cr-thumb"
                  aria-label={`View certificate: ${c.title}`}
                  onClick={(e) => {
                    lastFocus.current = e.currentTarget;
                    setActive(i);
                  }}
                >
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: c.pos }}
                  />
                  <span className="cr-view">
                    <FiMaximize2 aria-hidden="true" /> View
                  </span>
                </button>
                <div className="cr-cap">
                  <h3 className="cr-title">{c.title}</h3>
                  <p className="cr-meta">
                    {c.issuer} · {c.date}
                    {c.verifyUrl && (
                      <a
                        className="cr-verify"
                        href={c.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Verify
                      </a>
                    )}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 3. Languages */}
        <motion.div className="cr-block cr-mini" {...reveal(0)}>
          <div>
            <p className="cr-kicker">Languages</p>
            <ul className="cr-langs">
              {LANGUAGES.map((l) => (
                <li className="cr-lang" key={l.name}>
                  {l.name}
                  {l.level && <span className="cr-level">{l.level}</span>}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="cr-lb"
                role="dialog"
                aria-modal="true"
                aria-label={`Certificate: ${current.title}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                onClick={(e) => e.target === e.currentTarget && setActive(null)}
              >
                <motion.figure
                  key={active}
                  className="cr-fig"
                  initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease }}
                >
                  <img
                    src={current.image}
                    alt={`Certificate: ${current.title}, ${current.issuer}`}
                  />
                  <figcaption>
                    {current.title} · {current.issuer} ({active + 1} / {total})
                  </figcaption>
                </motion.figure>

                <button
                  ref={closeBtn}
                  type="button"
                  className="cr-btn cr-close"
                  aria-label="Close"
                  onClick={() => setActive(null)}
                >
                  <FiX aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="cr-btn cr-prev"
                  aria-label="Previous certificate"
                  onClick={() => setActive((i) => (i - 1 + total) % total)}
                >
                  <FiChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="cr-btn cr-next"
                  aria-label="Next certificate"
                  onClick={() => setActive((i) => (i + 1) % total)}
                >
                  <FiChevronRight aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      <hr className="cr-divider" />
    </section>
  );
}