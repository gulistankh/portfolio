import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  SiHtml5, SiCss, SiJavascript, SiReact,
  SiNodedotjs, SiExpress, SiPostgresql, SiFigma,
} from "react-icons/si";
import { FiLock, FiServer, FiLayout } from "react-icons/fi";

/* ───────────── CONTENT (edit these) ─────────────
   x / y : position on desktop, in % of the space area (center of the orb)
   s     : orb size in rem          d : depth (bigger = moves more on scroll / mouse)
   Phones ignore x / y and show a tidy floating grid instead. */
const SKILLS = [
  { name: "UI/UX Design", icons: [FiLayout], s: 2.5, d: 1.0 },
  { name: "Figma", icons: [SiFigma], s: 2.5, d: 1 },
  { name: "HTML5", icons: [SiHtml5], s: 2.5, d: 1 },
  { name: "CSS3", icons: [SiCss], s: 2.5, d: 1 },
  { name: "JavaScript", icons: [SiJavascript], s: 2.5, d: 1 },
  { name: "React", icons: [SiReact], s: 2.5, d: 1 },
  { name: "Node.js", icons: [SiNodedotjs], s: 2.5, d: 1 },
  { name: "Express.js", icons: [SiExpress], s: 2.5, d: 1 },
  { name: "PostgreSQL", icons: [SiPostgresql], s: 2.5, d: 1 },
  { name: "REST APIs", icons: [FiServer], s: 2.5, d: 1 },
  { name: "Auth & Accounts", icons: [FiLock], s: 2.5, d: 1 },
];
const ease = [0.22, 1, 0.36, 1];

function Node({ skill, index, progress, reduce }) {
  const { name, icons, x, y, s, d } = skill;
  // scroll parallax: far orbs drift less, near orbs drift more
  const driftY = useTransform(progress, [0, 1], [d * 55, d * -55]);

  return (
    <motion.li
      className="sk-node"
      style={{ "--s": `${s}rem`, "--d": d, y: reduce ? 0 : driftY }}
      initial={reduce ? false : { opacity: 0, scale: 0.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9, delay: index * 0.07, ease }}
    >
      <div className="sk-par">
        <div className="sk-float" 
          style={{ "--dur": `${6 + (index % 5) * 1.3}s`, "--dl": `${-index * 1.1}s` }}>
          <div className="sk-orb">
            <span className="sk-icons" aria-hidden="true">
              {icons.map((Icon, i) => <Icon key={i} />)}
            </span>
          </div>
          <span className="sk-name">{name}</span>
        </div>
      </div>
    </motion.li>
  );
}

export default function Skills() {
  const reduce = useReducedMotion();
  const stage = useRef(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { duration: 0.8, delay, ease },
  });

  // mouse parallax: only writes CSS variables, no React re-render
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty();
    e.currentTarget.style.setProperty();
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty();
    e.currentTarget.style.setProperty();
  };

  return (
    <section id="skills" className="sk-section">
      <style>{`
        /* Skills section styles. Edit the three colors below to restyle the section. */
        .sk-section{
          --sk-bg:#000000;   /* must match the hero's endColor and the other sections */
          --sk-from: #ff78cb;           /* heading gradient start */
          --sk-to: #ff78cb;             /* heading gradient end */
          }

        .sk-wrap{
          max-width:76rem;
          margin:0 auto;
          padding:clamp(0.5rem,1vw,2rem) 1.5rem
        }
        .sk-head{
          text-align:left;
          max-width:40rem;
          margin-bottom:clamp(1rem,3vw,2rem)
        }
        .sk-eyebrow{
          font:600 .8rem/1 system-ui,sans-serif;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:#003cff;
          margin:0 0 1rem
        }
        .sk-h2{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.5rem,4.6vw,1.9375rem);
          line-height:1.1;
          letter-spacing:-.02em;
          margin:0 0 .8rem;
          text-wrap:balance;
          color:var(--sk-from);
          background:linear-gradient(90deg,var(--sk-from),var(--sk-to));
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent
        }
        .sk-sub{
          font:400 clamp(0.9375rem,1.6vw,1rem)/1.7 system-ui,sans-serif;
          color:#c9cde6;
          margin:0
        }

        /* the "space" the skills float in */
        .sk-stage{
          position:relative;
          padding:1rem;
          padding-top:3rem
        }
        .sk-field{
          position:relative;
          margin:0;
          padding:0;
          list-style:none;
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(70px, 1fr));
          gap:2.2rem 1rem;
          justify-items:left
        }

        .sk-node:last-child:nth-child(even){
          grid-column:1 / -1
        }
        @media(min-width:640px){
          .sk-field {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr)); /* Exactly 6 columns max */
          gap: 1.5rem 1.25rem;
          height: auto; /* Replaces fixed height so all rows display cleanly */
        }
        .sk-node{
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }

        .sk-par{
          transition:transform .5s cubic-bezier(.22,1,.36,1);
          transform:translate3d(calc(var(--px) * var(--d) * -16px),calc(var(--py) * var(--d) * -16px),0)
        }
        .sk-float{
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:.8rem;
          animation:sk-bob var(--dur) ease-in-out var(--dl) infinite;
          will-change:transform
        }
        @keyframes sk-bob{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(6px,-14px,0)}}

        .sk-orb{
          position:relative;
          display:grid;
          place-items:center;
          width:4rem;
          height:4rem;
          border-radius:25%;
          color:rgba(244,239,230,.92);
          cursor:default;
          border:1px solid rgba(243, 100, 172, 0.47);
          box-shadow:0 0 40px -6px rgba(0, 60, 255, 0.14);
        }
        .sk-node:hover .sk-orb{
          transform:scale(1.25);
          color:rgb(0, 60, 255);
          border-color:rgba(0, 60, 255, 0.57);
          box-shadow:0 0 54px -2px rgba(0, 60, 255, 0.57),
          inset 0 0 22px rgba(0, 60, 255, 0)
        }
        .sk-icons{
          display:flex;
          gap:.35rem;
          font-size:calc(var(--s) * .8)
        }
        .sk-name{
          font:500 .92rem/1.3 system-ui,sans-serif;
          color:#e8e9f6;
          text-align:center;
          max-width:9.5rem;
          text-shadow:0 2px 14px #000
        }

        @media(max-width:899px){
          .sk-orb{
            width:3.6rem;
            height:3.6rem
          }
          .sk-icons{
            font-size:1.7rem
          }
          .sk-par{
            transform:none
          }
        }
        @media(prefers-reduced-motion:reduce){
          .sk-float,.sk-orb::after{animation:none}
          .sk-par{transform:none;transition:none}
          .sk-orb{transition:none}.sk-node:hover .sk-orb{transform:none}
        }
      `}</style>

      <div className="sk-wrap">
        <div className="sk-head">
          <motion.p className="sk-eyebrow" {...reveal(0)}>Skills</motion.p>
          <motion.h2 className="sk-h2" {...reveal(0.08)}>The toolkit behind every build</motion.h2>
          <motion.p className="sk-sub" {...reveal(0.16)}>
            The tools I use to take a product from design to a working, secure application.
          </motion.p>
        </div>

        <div ref={stage} className="sk-stage" onMouseMove={onMove} onMouseLeave={onLeave}>
          <div className="sk-bg" aria-hidden="true" />
          <ul className="sk-field">
            {SKILLS.map((skill, i) => (
              <Node key={skill.name} skill={skill} index={i} progress={scrollYProgress} reduce={reduce} />
            ))}
          </ul>
        </div>
      </div>
      <hr className="cr-divider" />
    </section>
  );
}