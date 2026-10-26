import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { FiAlertCircle, FiCheck, FiSend } from "react-icons/fi";
import Footer from "./Footer";

/* ───────────── CONTENT (edit these) ───────────── */
const EMAIL = "gulistan.kh851@gmail.com"; // TODO

/* Where the form is sent. Paste a form-service URL (e.g. Formspree: "https://formspree.io/f/xxxxxxx").
   While this is empty, the form opens the visitor's email app with the message pre-filled instead. */
const FORM_ENDPOINT = "";

const PROJECT_TYPES = ["Web application", "UI/UX design", "Design + development", "Something else"];

/* What the little character says. Edit freely. */
const SAYS = {
  idle: [
    "Got a web app idea? Tell me!",
    "I turn ideas into real apps.",
    "No idea is too weird. Promise!",
    "Fill the form and I'll do the rest!",
    "Psst... the form is right here.",
  ],
  focus: {
    name: "Hi! What's your name?",
    email: "Where should I send my reply?",
    message: "Ooh, tell me everything!",
  },
  worried: "Hmm, one field needs a fix.",
  wait: "Sending... fingers crossed!",
  happy: "Yay! I'll reply very soon!",
  sad: "Oops, that didn't send. Try again?",
  boop: ["Hehe, that tickles!", "Boop! Now fill the form?"],
};

const ease = [0.22, 1, 0.36, 1];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: "", email: "", type: PROJECT_TYPES[0], message: "", trap: "" };
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Tell me a little more (at least 10 characters).";
  return e;
}

/* ───────────── CUTE CHARACTER ───────────── */
/* Decorative only: eyes follow the mouse, she reacts to the form, and talks in a speech bubble. */
function Mascot({ mood, focus, reduce }) {
  const svgRef = useRef(null);
  const moodRef = useRef(mood);
  const [idleIdx, setIdleIdx] = useState(0);
  const [boop, setBoop] = useState(null);
  const [wide, setWide] = useState(true);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });
  const pupilX = useTransform(sx, (v) => v * 7);
  const pupilY = useTransform(sy, (v) => v * 6);
  const faceX = useTransform(sx, (v) => v * 6);
  const faceY = useTransform(sy, (v) => v * 3);

  const shown = boop ? "happy" : mood;
  moodRef.current = shown;

  // wide screens: the form is to the left. small screens: the form is above.
  useEffect(() => {
    const q = window.matchMedia("(min-width:900px)");
    const set = () => setWide(q.matches);
    set();
    q.addEventListener("change", set);
    return () => q.removeEventListener("change", set);
  }, []);

  // eyes follow the finger or mouse anywhere on the page
  useEffect(() => {
    const move = (e) => {
      if (moodRef.current === "excited") return; // while typing, look at the form
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set(clamp((e.clientX - (r.left + r.width / 2)) / 320, -1, 1));
      my.set(clamp((e.clientY - (r.top + r.height * 0.45)) / 320, -1, 1));
    };
    const rest = () => {
      if (wide) { mx.set(-0.6); my.set(0.1); } else { mx.set(0); my.set(-0.7); }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    document.addEventListener("mouseleave", rest);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("mouseleave", rest);
    };
  }, [mx, my, wide]);

  // look toward the form while typing (or by default when nobody is pointing anywhere)
  useEffect(() => {
    if (shown === "excited") {
      if (wide) { mx.set(-0.9); my.set(0.25); } else { mx.set(0); my.set(-0.9); }
    } else {
      if (wide) { mx.set(-0.6); my.set(0.1); } else { mx.set(0); my.set(-0.7); }
    }
  }, [shown, wide, mx, my]);

  // rotate the idle sentences
  useEffect(() => {
    if (mood !== "idle") return;
    const t = setInterval(() => setIdleIdx((i) => (i + 1) % SAYS.idle.length), 4800);
    return () => clearInterval(t);
  }, [mood]);

  const onBoop = () => {
    const line = SAYS.boop[Math.floor(Math.random() * SAYS.boop.length)];
    setBoop(line);
    clearTimeout(onBoop.t);
    onBoop.t = setTimeout(() => setBoop(null), 1800);
  };

  let text = SAYS.idle[idleIdx];
  if (boop) text = boop;
  else if (shown === "happy") text = SAYS.happy;
  else if (shown === "sad") text = SAYS.sad;
  else if (shown === "wait") text = SAYS.wait;
  else if (shown === "worried") text = SAYS.worried;
  else if (shown === "excited") text = SAYS.focus[focus] || SAYS.focus.message;

  const happy = shown === "happy";
  const open = shown === "excited" || happy;
  const worried = shown === "worried" || shown === "sad";

  return (
    <div className={`ct-mascot${reduce ? " ct-calm" : ""}`} aria-hidden="true" onClick={onBoop}>
      <div className="ct-bubble">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={text}
            initial={reduce ? false : { opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.25, ease }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>

      <svg ref={svgRef} viewBox="0 0 320 340" role="presentation">
        <defs>
          <linearGradient id="ctBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffa6dc" />
            <stop offset="0.55" stopColor="#ff78cb" />
            <stop offset="1" stopColor="#e85bb0" />
          </linearGradient>
          <clipPath id="ctEyeL"><ellipse cx="110" cy="150" rx="30" ry="35" /></clipPath>
          <clipPath id="ctEyeR"><ellipse cx="210" cy="150" rx="30" ry="35" /></clipPath>
        </defs>

        <ellipse cx="160" cy="331" rx="104" ry="9" fill="#ff78cb" opacity="0.2" />

        <g className="ct-float">
          {/* round ears */}
          <circle cx="60" cy="98" r="30" fill="#ff78cb" />
          <circle cx="60" cy="98" r="16" fill="#ffb3df" />
          <circle cx="260" cy="98" r="30" fill="#ff78cb" />
          <circle cx="260" cy="98" r="16" fill="#ffb3df" />

          {/* feet */}
          <ellipse cx="120" cy="298" rx="30" ry="15" fill="#e85bb0" />
          <ellipse cx="200" cy="298" rx="30" ry="15" fill="#e85bb0" />

          {/* body */}
          <rect x="60" y="58" width="200" height="236" rx="100" fill="url(#ctBody)" />
          <ellipse cx="160" cy="250" rx="62" ry="36" fill="#ffd1ec" opacity="0.5" />
          <ellipse cx="118" cy="96" rx="34" ry="15" transform="rotate(-24 118 96)" fill="#fff" opacity="0.22" />

          {/* arms: left one waves at the form */}
          <g className="ct-wave">
            <path d="M64 210 Q24 206 20 168" stroke="#ff78cb" strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="20" cy="160" r="19" fill="#ffa6dc" />
          </g>
          <path d="M256 210 Q290 214 292 244" stroke="#ff78cb" strokeWidth="22" strokeLinecap="round" fill="none" />
          <circle cx="292" cy="252" r="19" fill="#ffa6dc" />

          {/* face */}
          <motion.g style={{ x: reduce ? 0 : faceX, y: reduce ? 0 : faceY }}>
            {happy ? (
              <>
                <path d="M78 160 Q110 122 142 160" stroke="#2a1030" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M178 160 Q210 122 242 160" stroke="#2a1030" strokeWidth="8" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <g className="ct-blink">
                <ellipse cx="110" cy="150" rx="30" ry="35" fill="#fff" />
                <ellipse cx="210" cy="150" rx="30" ry="35" fill="#fff" />
                <g clipPath="url(#ctEyeL)">
                  <motion.g style={{ x: pupilX, y: pupilY }}>
                    <circle cx="110" cy="152" r="19" fill="#2a1030" />
                    <circle cx="103" cy="143" r="7" fill="#fff" />
                    <circle cx="117" cy="161" r="3.4" fill="#fff" />
                    <circle cx="120" cy="141" r="2" fill="#fff" />
                  </motion.g>
                </g>
                <g clipPath="url(#ctEyeR)">
                  <motion.g style={{ x: pupilX, y: pupilY }}>
                    <circle cx="210" cy="152" r="19" fill="#2a1030" />
                    <circle cx="203" cy="143" r="7" fill="#fff" />
                    <circle cx="217" cy="161" r="3.4" fill="#fff" />
                    <circle cx="220" cy="141" r="2" fill="#fff" />
                  </motion.g>
                </g>
              </g>
            )}

            {worried && (
              <>
                <path d="M82 112 L132 124" stroke="#2a1030" strokeWidth="6" strokeLinecap="round" />
                <path d="M238 112 L188 124" stroke="#2a1030" strokeWidth="6" strokeLinecap="round" />
              </>
            )}

            {/* blush */}
            <ellipse cx="82" cy="196" rx="17" ry="10" fill="#ff4fa8" opacity="0.45" />
            <ellipse cx="238" cy="196" rx="17" ry="10" fill="#ff4fa8" opacity="0.45" />
            <g stroke="#ff2f95" strokeWidth="2.5" strokeLinecap="round" opacity="0.55">
              <path d="M72 193 l5 -7 M81 195 l5 -7 M90 197 l5 -7" />
              <path d="M230 197 l5 -7 M239 195 l5 -7 M248 193 l5 -7" />
            </g>

            {/* mouth */}
            {open ? (
              <>
                <path d="M136 196 Q160 192 184 196 Q182 230 160 230 Q138 230 136 196 Z" fill="#7a1f4f" />
                <ellipse cx="160" cy="222" rx="11" ry="6" fill="#ff8fb8" />
              </>
            ) : shown === "wait" ? (
              <ellipse cx="160" cy="208" rx="9" ry="11" fill="#7a1f4f" />
            ) : worried ? (
              <path d="M142 214 Q160 198 178 214" stroke="#7a1f4f" strokeWidth="6" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M140 202 Q150 216 160 204 Q170 216 180 202" stroke="#7a1f4f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
          </motion.g>

          {happy && (
            <g fill="#fff">
              <text className="ct-heart" x="36" y="74" fontSize="26" style={{ animationDelay: "0s" }}>♥</text>
              <text className="ct-heart" x="262" y="56" fontSize="30" style={{ animationDelay: ".35s" }}>♥</text>
              <text className="ct-heart" x="150" y="30" fontSize="22" style={{ animationDelay: ".7s" }}>♥</text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

/* ───────────── SECTION ───────────── */
export default function Contact() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [focus, setFocus] = useState("");

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.25 },
    transition: { duration: 0.8, delay, ease },
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setFocus("");
    const msg = validate(values)[name];
    if (msg) setErrors((er) => ({ ...er, [name]: msg }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`ct-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (values.trap) { setStatus("success"); return; } // bots fill the hidden field: pretend it worked

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      project: values.type,
      message: values.message.trim(),
    };

    if (!FORM_ENDPOINT) {
      const body = `Name: ${payload.name}\nEmail: ${payload.email}\nProject: ${payload.project}\n\n${payload.message}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`New project enquiry from ${payload.name}`)}&body=${encodeURIComponent(body)}`;
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => { setValues(EMPTY); setErrors({}); setStatus("idle"); };

  const field = (name) => ({
    id: `ct-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `ct-${name}-err` : undefined,
    disabled: status === "sending",
  });
  const err = (name) =>
    errors[name] && (
      <p className="ct-err" id={`ct-${name}-err`}>
        <FiAlertCircle aria-hidden="true" /> {errors[name]}
      </p>
    );

  // what the character should feel right now
  const hasErrors = Object.values(errors).some(Boolean);
  let mood = "idle";
  if (status === "success") mood = "happy";
  else if (status === "error") mood = "sad";
  else if (status === "sending") mood = "wait";
  else if (hasErrors) mood = "worried";
  else if (focus) mood = "excited";

  return (
    <section id="contact" className="ct-section">
      <style>{`
        .ct-section{
          --ct-bg:#000000;   /* must match the hero's endColor and the other sections */
          --ct-from:#ff78cb;           /* heading gradient start */
          --ct-to:#ff78cb;             /* heading gradient end */
          background:var(--ct-bg);
          color:#f6f3ec
        }
        .ct-wrap{
          max-width:76rem;
          margin:0 auto;
          padding:clamp(1.5rem,4vw,2rem) 1.5rem
        }

        .ct-eyebrow{
          text-align:left;
          font:600 .8rem/1 system-ui,sans-serif;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:rgb(0, 60, 255);
          margin:0 0 1rem
        }
        .ct-h2{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.5rem,4.6vw,1.9375rem);
          line-height:1.1;
          letter-spacing:-.02em;
          margin:0 0 1rem;
          text-wrap:balance;
          text-align:left;
          color:var(--ct-from);
          background:linear-gradient(90deg,var(--ct-from),var(--ct-to));
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent
        }
        .ct-sub{
          font:400 clamp(0.9375rem,1.6vw,1rem)/1.7 system-ui,sans-serif;
          color:#c9cde6;
          margin:0;
          text-align:left
        }

        /* form + character, side by side on desktop */
        .ct-stage{
          display:flex;
          flex-direction:column;   /* small screens: form first, character below it */
          align-items:flex-start;
          gap:2.75rem;
          margin-top:1.5rem
        }
        @media(min-width:900px){
          .ct-stage{
            flex-direction:row;    /* desktop: character to the right of the form */
            align-items:center;
            gap:clamp(4rem,10vw,9rem)
          }
        }

        /* form */
        .ct-panel{
          position:relative;
          overflow:hidden;
          flex:0 1 auto;
          width:100%;
          border-radius:1.25rem;
          padding:clamp(1.4rem,3vw,2.2rem);
          border:1px solid #ff78cb3d;
          background:radial-gradient(circle at 70% 0%,rgba(255, 120, 203, 0.34),
          transparent 55%),radial-gradient(circle at 20% 100%,rgba(255, 120, 203, 0.51),
          transparent 55%),#07080f;
          max-width: clamp(17rem, 40vw,19rem);
        }

        .ct-form{
          display:grid;
          gap:1.15rem;
          text-align:left
        }
        .ct-row{
          display:grid;
          gap:1.15rem;
          grid-template-columns:1fr
        }
        .ct-field{
          display:grid;
          gap:.45rem
        }
        .ct-label {
          display: block;
          font-size: clamp(0.75rem, 1.8vw, 0.95rem);
          font-weight: 600;
          line-height: 1.2;
          font-family: system-ui, sans-serif;
          color: #e8e9f6;
        }
        .ct-label i{
          color: #ff7a7a;
          font-style:normal;
          margin-left:.15rem;
        }
        .ct-input{
          width:100%;
          box-sizing:border-box;
          padding: 1rem 1rem;
          border-radius:.9rem;
          color:#f6f3ec;
          font-size: clamp(0.8rem, 1vw, 1rem);
          font-weight: 400;
          line-height: 1.2;
          font-family: system-ui, sans-serif;
          background:rgba(244,239,230,.04);
          border:1px solid rgba(244,239,230,.22);
          transition:border-color .25s,box-shadow .25s,background .25s
        }
        .ct-input::placeholder{
          color: #7d82a6
        }
        .ct-input:hover{
          border-color:#ff78cb
        }
        .ct-input:focus{
          outline:none;
          border-color: #ff78cb;
          background: #ff78cb09;
          box-shadow:0 0 0 3px #ff78cb42
        }
        .ct-input[aria-invalid="true"]{
          border-color: #ff7a7a
        }
        .ct-input:disabled{
          opacity:.6;
          cursor:not-allowed
        }
        textarea.ct-input{
          min-height:1.5rem;
          resize:vertical
        }
        .ct-err{
          display:flex;
          align-items:center;
          gap:.4rem;
          margin:0;
          font-size: clamp(0.75rem, 1vw, 0.95rem);
          font-weight: 500;
          line-height: 1.3;
          font-family: system-ui, sans-serif;
          color: #ff9a9a
        }
        .ct-trap{
          position:absolute;
          left:-9999px;
          width:1px;
          height:1px;
          overflow:hidden
        }
        .ct-submit{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:.6rem;
          justify-self:start;
          padding:.6rem 3.5rem;
          border:1px solid #ff78cb ;
          border-radius:999px;
          cursor:pointer;
          background: #f4efe6;
          color: #0b0d1c;
          font-size: clamp(0.8rem, 1vw, 1rem);
          font-weight: 500;
          line-height: 1;
          font-family: system-ui, sans-serif;
          transition:transform .2s,background .2s,gap .2s
        }
        .ct-submit:hover:not(:disabled){
          background: #ff78cb;
          transform:translateY(-2px);gap:.85rem
        }
        .ct-submit:focus-visible{
          outline:3px solid #ff78cb;
          outline-offset:3px
        }
        .ct-submit:disabled{
          opacity:.7;
          cursor:progress
        }
        .ct-spin{
          width:1rem;
          height:1rem;
          border-radius:50%;
          border:2px solid rgba(11,13,28,.25);
          border-top-color:#0b0d1c;
          animation:ct-rot .8s linear infinite
        }
        @keyframes ct-rot{to{transform:rotate(360deg)}}

        .ct-banner{
          display:flex;
          gap:.6rem;
          align-items:flex-start;
          padding:.85rem 1rem;
          border-radius:.8rem;
          font:500 .92rem/1.45 system-ui,sans-serif;
          color: #ffd0d0;
          background:rgba(255, 122, 122, 0.32);
          border:1px solid rgba(212, 47, 47, 0.66)
        }
        .ct-note{
          margin:0;
          font: 400 clamp(0.7rem, 1.2vw, 0.9rem)/1.5 system-ui, sans-serif;
          color: #a3a3a3
        }
        .ct-done{
          display:grid;
          gap:1rem;
          justify-items:start;
          text-align:left;
          padding:1rem 0
        }
        .ct-check {
          display: grid;
          place-items: center;
          width: 3.4rem;
          height: 3.4rem;
          border-radius: 50%;
          font-size: 1.5rem;
          color: #69fc7d;
          border: 1px solid #69fc7d60;
          background: rgba(255, 179, 107, 0.1);
          box-shadow: 0 0 40px -6px #69fc7d7c;
        }
        .ct-done h3{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(1.5rem,2.6vw,2rem);
          margin:0
        }
        .ct-done p{
          margin:0;
          font:400 1rem/1.7 system-ui,sans-serif;
          color: #69fc7d
        }
        .ct-again{
          background:none;
          border:0;
          padding:.3rem 0;
          cursor:pointer;
          color: #ff78cb;
          font:600 .95rem/1 system-ui,sans-serif
        }
        .ct-again:hover{
          text-decoration:underline
        }
        .ct-again:focus-visible{
          outline:3px solid #ff78cb;
          outline-offset:3px;
          border-radius:4px
        }

        /* character: shown on every device */
        .ct-mascot{
          display:grid;
          gap:1rem;
          flex:none;
          width:min(100%,clamp(17rem,40vw,19rem));
          cursor:pointer;
          user-select:none;
          -webkit-tap-highlight-color:transparent
        }
        @media(min-width:900px){
          .ct-mascot{ width:clamp(13rem,22vw,17rem) }
        }
          
        @media(max-width:639px){
          .ct-mascot{ display:none }
        }

        .ct-mascot svg{ width:100%; height:auto; overflow:visible; display:block }
        .ct-bubble{
          position:relative;
          display:grid;
          place-items:center;
          min-height:3.6rem;
          padding:.8rem 1rem;
          border-radius:1.1rem;
          background:#fff3fa;
          color:#2a1030;
          text-align:center;
          font:600 clamp(.85rem,1.1vw,.95rem)/1.35 system-ui,sans-serif;
          box-shadow:0 10px 34px -12px rgba(255,120,203,.8)
        }
        .ct-bubble::after{
          content:"";
          position:absolute;
          left:50%;
          bottom:-10px;
          margin-left:-10px;
          border:10px solid transparent;
          border-bottom:0;
          border-top-color:#fff3fa
        }
        .ct-float{ animation:ct-bob 3.4s ease-in-out infinite }
        .ct-wave{ transform-origin:64px 210px; animation:ct-wave 1.7s ease-in-out infinite }
        .ct-blink{ transform-origin:160px 150px; animation:ct-blink 5s infinite }
        .ct-mascot:hover .ct-wave{ animation-duration:.6s }
        .ct-heart{ opacity:0; animation:ct-rise 1.6s ease-out infinite }
        @keyframes ct-wave{ 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(12deg)} }
        @keyframes ct-blink{ 0%,92%,100%{transform:scaleY(1)} 95%{transform:scaleY(.08)} }
        @keyframes ct-bob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes ct-rise{ 0%{opacity:0;transform:translateY(8px)} 25%{opacity:1} 100%{opacity:0;transform:translateY(-26px)} }

        @media(prefers-reduced-motion:reduce){
          .ct-submit,.ct-input{transition:none}
          .ct-spin{animation:none}
          .ct-submit:hover:not(:disabled){transform:none}
          .ct-float,.ct-wave,.ct-blink,.ct-heart{animation:none}
          .ct-heart{opacity:1}
        }
      `}</style>

      <div className="ct-wrap">
        <motion.p className="ct-eyebrow" {...reveal(0)}>Contact</motion.p>
        <motion.h2 className="ct-h2" {...reveal(0.08)}>Let's build your web app</motion.h2>
        <motion.p className="ct-sub" {...reveal(0.16)}>
          Tell me about your idea and where you want it to go. I'll read every message and get back to you personally.
        </motion.p>

        <div className="ct-stage">
          <motion.div
            className="ct-panel"
            initial={reduce ? false : { opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9, ease }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="done"
                  className="ct-done"
                  role="status"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease }}
                >
                  <span className="ct-check" aria-hidden="true"><FiCheck /></span>
                  <h3>Thank you, {values.name.trim().split(" ")[0] || "friend"}.</h3>
                  <p>
                    {FORM_ENDPOINT
                      ? "Your message is on its way. I'll reply to the email you provided as soon as I can."
                      : "Your email app should now open with your message ready to send. Just press send there."}
                  </p>
                  <button type="button" className="ct-again" onClick={reset}>Write another message</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="ct-form"
                  noValidate
                  onSubmit={onSubmit}
                  onFocus={(e) => setFocus(e.target.name || "")}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3 }}
                >
                  <div className="ct-row">
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="ct-name">Name<i aria-hidden="true">*</i></label>
                      <input className="ct-input" type="text" autoComplete="name" placeholder="Your full name" aria-required="true" {...field("name")} />
                      {err("name")}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="ct-email">Email<i aria-hidden="true">*</i></label>
                      <input className="ct-input" type="email" autoComplete="email" placeholder="you@company.com" aria-required="true" {...field("email")} />
                      {err("email")}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label className="ct-label" htmlFor="ct-message">Tell me about your project<i aria-hidden="true">*</i></label>
                    <textarea className="ct-input" rows={5} placeholder="What are you building, who is it for, and when do you want to launch?" aria-required="true" {...field("message")} />
                    {err("message")}
                  </div>

                  {/* honeypot: hidden from people, bots fill it in */}
                  <div className="ct-trap" aria-hidden="true">
                    <label htmlFor="ct-trap">Leave this empty</label>
                    <input id="ct-trap" name="trap" type="text" tabIndex={-1} autoComplete="off" value={values.trap} onChange={onChange} />
                  </div>

                  <div aria-live="polite">
                    {status === "error" && (
                      <div className="ct-banner" role="alert">
                        <FiAlertCircle aria-hidden="true" style={{ flex: "none", marginTop: ".15rem" }} />
                        <span>Something went wrong and your message wasn't sent. Please try again, or email me directly at {EMAIL}.</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="ct-submit" disabled={status === "sending"}>
                    {status === "sending" ? (<><span className="ct-spin" aria-hidden="true" /> Sending…</>) : (<>Send message <FiSend aria-hidden="true" /></>)}
                  </button>
                  <p className="ct-note">Your details are only used to reply to your message.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* cute character: decorative, shown on every device */}
          <Mascot mood={mood} focus={focus} reduce={!!reduce} />
        </div>
      </div>
      <Footer/>
    </section>
  );
}