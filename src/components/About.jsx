import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import profile from "../assets/profile.PNG";


/* ───────────── CONTENT (edit these) ───────────── */
const NAME = "Gulistan";
const ROLE = "UI/UX Designer & Full-Stack Developer";

const PARAGRAPHS = [
  "I help B2B SaaS founders turn ideas into secure, working web apps.",
  "A strong business idea is only the first step. The real work is turning it into a product your customers can log in to, find their way around, and trust with their data. Most founders end up passing messages between separate designers and developers. I simplify that by being your one dedicated partner, from first idea to launch.",
];

// Shown only after clicking "Read more"
const MORE_TEXT =
  "My goal is simple: take the complexity out of building software, so you can get a reliable first version in front of real customers, learn what works, and grow from there.";

/* Must match CONFIG.endColor in GalaxyHero so there is no seam */
const BG = "#000000";
/* Heading gradient: change these two colors to restyle "Hi, I'm Gulistan" */
const HEADING_FROM = "rgb(243, 100, 171)";
const HEADING_TO = "rgb(243, 100, 171)";

export default function About() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  // photo slides in from the left
  const fromLeft = {
    initial: reduce ? false : { opacity: 0, x: -90 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section id="about" style={{ background: BG, color: "#ecf6f0" }}>
      <style>{`
        .ab-wrap{
          max-width:68rem;
          margin:0 auto;
          padding:clamp(4rem,10vw,8rem) 1.5rem;
          overflow-x:clip;
          display:grid;
          gap:clamp(2rem,6vw,5rem);
          grid-template-columns:1fr;
          align-items: start
        }
        @media(min-width:860px){
        .ab-wrap{
          grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
        }
        .ab-photo{
          position:relative;
          width:100%;
          max-width:22rem;
          margin:0 auto
        }
        .ab-photo::before{
          content:"";
          position:absolute;
          inset:-14%;
          z-index:0;
          border-radius:50%;
          background:radial-gradient(circle,rgba(243,100,171,.22),rgba(0, 60, 255, 0.15) 70%,transparent 60%);
          filter:blur(24px)
        }
        .ab-photo img{
          position:relative;
          z-index:1;
          display:block;
          width:100%;
          aspect-ratio:4/5;
          object-fit:cover;
          border-radius:1.25rem;
          border:1px solid rgba(243,100,171,.18)
        }
        .ab-text{
          text-align:left
        }
        .ab-eyebrow{
          font:600 .8rem/1 system-ui,sans-serif;
          letter-spacing:.18em;
          text-transform:uppercase;
          color: rgba(0,60,250);
          margin:0 0 1rem
        }    
        .ab-h2{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.5rem,4.6vw,1.9375rem);
          line-height:1.1;
          letter-spacing:-.02em;
          margin:0 0 .6rem;
          text-wrap:balance;
          color:${HEADING_FROM};
          background:linear-gradient(90deg,${HEADING_FROM},${HEADING_TO});
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent
        }
        .ab-role{
          font:500 1.0rem/1.4 system-ui,sans-serif;
          color:#c9cde6;
          margin:0 0 1.5rem
        }
        .ab-p{
          font:400 clamp(0.9375rem,1.6vw,1rem)/1.75 system-ui,sans-serif;
          color:rgba(244, 239, 230, 0.85);
          margin:0 0 1.1rem;
          max-width:38rem;
          line-height: 1.40;
          text-align:left
        }
        .ab-more{
          background:none;
          border:0;
          padding:.4rem 0;
          cursor:pointer;
          color: rgb(75, 74, 75);
          font:600 1rem/1 system-ui,sans-serif;
          display:inline-flex;align-items:center;
          gap:.4rem
        }
        .ab-more:hover{
          color: rgb(165, 164, 164)
        }
        .ab-more:focus-visible{
          outline:3px solid #003cff;
          outline-offset:4px;
          border-radius:4px
        }
        .ab-more svg{
          transition:transform .3s
        }
        .ab-more[aria-expanded="true"] svg{transform:rotate(180deg)}

      `}</style>
      <div className="ab-wrap">
        <motion.div className="ab-photo" {...fromLeft}>
          <img
            src={profile}
            alt={`Portrait of ${NAME}`}
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <div className="ab-text">
          <motion.p className="ab-eyebrow" {...reveal(0.05)}>
            About me
          </motion.p>
          <motion.h2 className="ab-h2" {...reveal(0.1)}>
            Hi, I'm {NAME}
          </motion.h2>
          <motion.p className="ab-role" {...reveal(0.15)}>
            {ROLE}
          </motion.p>

          {PARAGRAPHS.map((text, i) => (
            <motion.p key={i} className="ab-p" {...reveal(0.2 + i * 0.07)}>
              {text}
            </motion.p>
          ))}

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="ab-more-text"
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ overflow: "hidden" }}
              >
                <p className="ab-p">{MORE_TEXT}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div {...reveal(0.35)}>
            <button
              type="button"
              className="ab-more"
              aria-expanded={open}
              aria-controls="ab-more-text"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Read less" : "Read more"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </motion.div>

          <motion.div {...reveal(0.4)}>
          </motion.div>
        </div>
      </div>
      <hr className="cr-divider" />
    </section>
    
  );
}