import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import saasboardCover from "../assets/saasboard-cover.png";
// Example once you have clips: import clip1 from "../assets/videos/project-one.mp4";

/* ───────────── CONTENT (edit these) ───────────── */
const PROJECTS = [
  {
    title: "SaaSBoard",
    description:
      "A secure team workspace and analytics dashboard with roles, invites and a live database. Try the demo, no sign-up needed.",
    url: "https://saasboard-app.vercel.app",
    caseStudy:
      "https://github.com/gulistankh/saasboard/blob/main/docs/case-study.md",
    image: saasboardCover, // shown as the card background
    live: true,
    video: "", // when you add a video, it replaces the image
    poster: "",
  },
  {
    title: "Project Two",
    description: "New projects in progress. Live previews coming soon ⏳",
    url: "#",
    video: "",
    poster: "",
  },
  {
    title: "Project Three",
    description: "New projects in progress. Live previews coming soon ⏳",
    url: "#",
    video: "",
    poster: "",
  },
];

/* Must match the hero's endColor and About's BG so there is no seam */
const BG = "#000000";
const HEADING_FROM = "rgb(243, 100, 171)";
const HEADING_TO = "rgb(243, 100, 171)";

/* Three different animated backgrounds, one per card (repeats if you add more) */
const BACKGROUNDS = ["aurora", "grid", "rings"];

function AnimatedBg({ kind }) {
  if (kind === "aurora") {
    return (
      <div className="wk-bg wk-bg--aurora" aria-hidden="true">
        <span className="wk-blob wk-blob--a" />
        <span className="wk-blob wk-blob--b" />
        <span className="wk-blob wk-blob--c" />
      </div>
    );
  }
  if (kind === "grid") {
    return (
      <div className="wk-bg wk-bg--grid" aria-hidden="true">
        <span className="wk-gridlines" />
        <span className="wk-scan" />
      </div>
    );
  }
  return (
    <div className="wk-bg wk-bg--rings" aria-hidden="true">
      <span className="wk-ring wk-ring--1" />
      <span className="wk-ring wk-ring--2" />
      <span className="wk-ring wk-ring--3" />
      <span className="wk-core" />
    </div>
  );
}

function ProjectCard({ project, index }) {
  const reduce = useReducedMotion();
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(cardRef, { amount: 0.45 });
  const isExternal = /^https?:\/\//.test(project.url);
  const bgKind = BACKGROUNDS[index % BACKGROUNDS.length];
  const isLive = Boolean(project.live);

  // Play only while on screen (saves battery and bandwidth), pause otherwise
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce]);

  return (
    <motion.article
      ref={cardRef}
      initial={reduce ? false : { opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="wk-card">
        {project.video ? (
          <video
            ref={videoRef}
            className="wk-video"
            src={project.video}
            poster={project.poster || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : project.image ? (
          <img
            className="wk-video"
            src={project.image}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <AnimatedBg kind={bgKind} />
        )}
        <div className="wk-shade" aria-hidden="true" />

        <div className="wk-top">
          {!isLive && (
            <span className="wk-tag">
              <span className="wk-dot" aria-hidden="true" />
              Coming soon
            </span>
          )}
        </div>

        <div className="wk-body">
          <h3 className="wk-title">{project.title}</h3>
          <p className="wk-desc">{project.description}</p>

          <div className="wk-actions">
            <a
              className="wk-btn"
              href={project.url}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={`Visit live site: ${project.title}${isExternal ? " (opens in a new tab)" : ""}`}
            >
              Visit live site
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>

            {project.caseStudy && (
              <a
                className="wk-btn wk-btn--ghost"
                href={project.caseStudy}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read the case study: ${project.title} (opens in a new tab)`}
              >
                Case study
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const reduce = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="work" style={{ background: BG, color: "#f6f3ec" }}>
      <style>{`
        .wk-wrap{
          max-width:76rem;
          margin:0 auto;
          padding:clamp(1.5rem,4vw,2rem) 1.5rem
        }
        .wk-head{
          text-align:left;
          max-width:40rem;
          margin-bottom:clamp(2rem,5vw,3.5rem)
        }
        .wk-eyebrow{
          font:600 .8rem/1 system-ui,sans-serif;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:rgb(0, 60, 255);
          margin:0 0 1rem
        }
        .wk-h2{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.5rem,4.6vw,1.9375rem);
          line-height:1.1;
          letter-spacing:-.02em;
          margin:0 0 .8rem;
          text-wrap:balance;
          color:${HEADING_FROM};
          background:linear-gradient(90deg,${HEADING_FROM},${HEADING_TO});
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent
        }
        .wk-sub{
          font:400 clamp(0.9375rem,1.6vw,1rem)/1.7 system-ui,sans-serif;
          color:#c9cde6;
          margin:0
        }
        .wk-grid{
          display:grid;
          gap:1.25rem;
          grid-template-columns:1fr
        }
        @media (min-width: 640px) {
          .wk-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem;
          }
        }
        @media(min-width:1024px){
          .wk-grid{
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:1.5rem
          }
        }
        .wk-card{
          background:#07070f;
          position:relative;
          overflow:hidden;
          isolation:isolate;
          border-radius:1.25rem;
          min-height:clamp(25rem,70vw,32rem);
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          padding:1.4rem;
          border:1px solid rgba(243, 100, 172, 0.43);
          transition:transform .5s cubic-bezier(.22,1,.36,1),border-color .4s,box-shadow .5s
        }
        @media(min-width:960px){
          .wk-card{min-height:25rem}
        }
        .wk-card:hover,.wk-card:focus-within{
          transform:translateY(-8px);
          border-color:rgba(0, 60, 255);
          box-shadow:0 30px 70px -30px rgba(0, 60, 255 ,.4)
        }
        .wk-video{
          position:absolute;
          inset:0;width:100%;
          height:100%;
          object-fit:cover;
          object-position:top left;
          z-index:-2;
          transition:transform 1.2s cubic-bezier(.22,1,.36,1)
        }
        .wk-card:hover .wk-video{
          transform:scale(1.07)
        }
        .wk-shade{
          position:absolute;
          inset:0;z-index:-1;
          background:linear-gradient(to top,rgba(0,0,0,.93) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,.1) 100%)
        }

        .wk-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          min-height:1.6rem
        }
        .wk-tag{
          display:inline-flex;
          align-items:center;
          gap:.5rem;
          font:600 .72rem/1 system-ui,sans-serif;
          letter-spacing:.04em;
          padding:.5rem .85rem;
          border-radius:999px;
          border:1px solid rgba(244,239,230,.3);
          background:rgba(0,0,0,.4);
          -webkit-backdrop-filter:blur(6px);
          backdrop-filter:blur(6px);
          color:#f4efe6
        }
        .wk-dot{
          width:.45rem;height:.45rem;
          border-radius:50%;
          background:#ff78cb;
          animation:wk-blink 1.6s ease-in-out infinite
        }
        @keyframes wk-blink{
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.3;transform:scale(.7)}
        }
        .wk-body{
          text-align:left;
          text-shadow:0 2px 18px rgba(0,0,0,.6)
        }
        .wk-title{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.125rem,2.4vw,1.25rem);
          line-height:1;
          margin:0 0 .6rem;
          color:#f6f3ec
        }
        .wk-desc{
          font-size: clamp(0.9375rem, 0.5rem + 1.5vw, 1rem);
          line-height: 1.3;
          font-family: system-ui, sans-serif;
          color: #d6d9ee;
          margin: 0 0 1.3rem;
        }
        .wk-btn{
          display:inline-flex;
          align-items:center;
          gap:.5rem;
          padding:.6rem 0.8rem;
          border-radius:999px;
          background:#f4efe6;
          color:#0b0d1c;
          font:600 .8rem/0.5 system-ui,sans-serif;
          text-decoration:none;
          text-shadow:none;
          transition:transform .2s,background .2s,gap .2s
        }
        .wk-btn:hover{
          background:#ff78cb;
          transform:translateY(-2px);gap:.75rem
        }
        .wk-btn:focus-visible{
          outline:3px solid #ff78cb;
          outline-offset:3px
        }
        .wk-actions{
          display:flex;
          flex-wrap:wrap;
          gap:.6rem
        }
        .wk-btn--ghost{
          background:transparent;
          color:#f4efe6;
          border:1px solid rgba(244,239,230,.4)
        }
        .wk-btn--ghost:hover{
          background:rgba(244,239,230,.12);
          border-color:#ff78cb
        }

        /* ───────── Animated backgrounds ───────── */
        .wk-bg{
          position:absolute;
          inset:0;
          z-index:-2;
          overflow:hidden;
          pointer-events:none
        }

        /* 1 · Aurora: soft pink/blue light drifting */
        .wk-bg--aurora{background:#07070f}
        .wk-blob{
          position:absolute;
          border-radius:50%;
          filter:blur(48px);
          opacity:.75;
          will-change:transform
        }
        .wk-blob--a{
          width:70%;aspect-ratio:1;
          left:-15%;top:-10%;
          background:rgb(243,100,171);
          animation:wk-drift-a 11s ease-in-out infinite alternate
        }
        .wk-blob--b{
          width:65%;aspect-ratio:1;
          right:-20%;top:25%;
          background:rgb(0,60,255);
          animation:wk-drift-b 13s ease-in-out infinite alternate
        }
        .wk-blob--c{
          width:50%;aspect-ratio:1;
          left:20%;bottom:-20%;
          background:#7a2cff;
          animation:wk-drift-c 9s ease-in-out infinite alternate
        }
        @keyframes wk-drift-a{
          to{transform:translate(45%,35%) scale(1.15)}
        }
        @keyframes wk-drift-b{
          to{transform:translate(-50%,-30%) scale(.85)}
        }
        @keyframes wk-drift-c{
          to{transform:translate(35%,-45%) scale(1.2)}
        }

        /* 2 · Grid: flowing grid with a scanning line */
        .wk-bg--grid{
          background:radial-gradient(120% 90% at 50% 0%,rgba(0,60,255,.45),#07070f 70%)
        }
        .wk-gridlines{
          position:absolute;
          inset:-40px;
          background-image:
            linear-gradient(rgba(243,100,171,.35) 1px,transparent 1px),
            linear-gradient(90deg,rgba(243,100,171,.35) 1px,transparent 1px);
          background-size:40px 40px;
          -webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%);
          mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%);
          animation:wk-grid-move 4s linear infinite
        }
        @keyframes wk-grid-move{
          to{transform:translate(40px,40px)}
        }
        .wk-scan{
          position:absolute;
          left:0;right:0;top:0;
          height:35%;
          background:linear-gradient(to bottom,transparent,rgba(243,100,171,.35),transparent);
          animation:wk-scan 4.5s ease-in-out infinite
        }
        @keyframes wk-scan{
          0%{transform:translateY(-100%)}
          100%{transform:translateY(300%)}
        }

        /* 3 · Rings: pulse radiating from the centre */
        .wk-bg--rings{
          background:radial-gradient(circle at 50% 38%,rgba(243,100,171,.28),#07070f 65%)
        }
        .wk-ring{
          position:absolute;
          left:50%;top:38%;
          width:80%;aspect-ratio:1;
          margin:-40% 0 0 -40%;
          border-radius:50%;
          border:2px solid rgba(0,60,255,.9);
          box-shadow:0 0 30px rgba(0,60,255,.5),inset 0 0 30px rgba(243,100,171,.25);
          opacity:0;
          transform:scale(.1);
          animation:wk-pulse 5.4s cubic-bezier(.2,.6,.3,1) infinite
        }
        .wk-ring--2{animation-delay:1.8s}
        .wk-ring--3{animation-delay:3.6s}
        @keyframes wk-pulse{
          0%{opacity:0;transform:scale(.1)}
          15%{opacity:.9}
          100%{opacity:0;transform:scale(1.4)}
        }
        .wk-core{
          position:absolute;
          left:50%;top:38%;
          width:.9rem;height:.9rem;
          margin:-.45rem 0 0 -.45rem;
          border-radius:50%;
          background:#ff78cb;
          box-shadow:0 0 24px 6px rgba(243,100,171,.8);
          animation:wk-core 2.2s ease-in-out infinite
        }
        @keyframes wk-core{
          0%,100%{transform:scale(1)}
          50%{transform:scale(1.5)}
        }

        @media(prefers-reduced-motion:reduce){
          .wk-card,.wk-video{transition:none}
          .wk-card:hover{transform:none}
          .wk-blob,.wk-gridlines,.wk-scan,.wk-ring,.wk-core,.wk-dot{animation:none}
          .wk-ring--1{opacity:.5;transform:scale(.7)}
          .wk-scan{opacity:0}
        }
      `}</style>

      <div className="wk-wrap">
        <div className="wk-head">
          <motion.p className="wk-eyebrow" {...reveal(0)}>Selected work</motion.p>
          <motion.h2 className="wk-h2" {...reveal(0.08)}>Products I've taken from idea to launch</motion.h2>
          <motion.p className="wk-sub" {...reveal(0.16)}>
            A few recent builds. Open any of them to see the live product.
          </motion.p>
        </div>

        <div className="wk-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
      <hr className="cr-divider" />
    </section>
  );
}