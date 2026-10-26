import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/* ───────────── TUNING ───────────── */
const CONFIG = {
  scrollHeight: "200vh",          // longer = slower dive
  endColor: "#000000",            // color the galaxy fades into ("#ffffff" for white)
  diveEnd: 0.1,                   // scroll progress where the camera finishes its dive
  fadeStart: 0.8,                // scroll progress where the fade-out begins
  fadeEnd: 0.9,                  // scroll progress where the screen is fully solid
  camStart: { x: 0, y: 4.5, z: 12 },
  camEnd: { x: 0, y: 0.3, z: 4}, // smaller z = deeper dive
  drift: 2,                     // sideways parallax arc during the dive
  damping: 3,                     // higher = snappier, lower = floatier
  radius: 9,
  branches: 7,
  spin: 0.1,
  randomness: 0.4,
  insideColor: "#ff78cb",
  outsideColor: "#003cff",
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───────────── GALAXY ───────────── */
const galaxyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vec4 mp = modelMatrix * vec4(position, 1.0);
    float dist = length(mp.xz);
    // inner stars orbit faster than outer ones
    float ang = atan(mp.x, mp.z) + uTime * (0.15 / (0.6 + dist * 0.5));
    mp.x = sin(ang) * dist;
    mp.z = cos(ang) * dist;
    vec4 vp = viewMatrix * mp;
    gl_Position = projectionMatrix * vp;
    gl_PointSize = min(uSize * aScale * uPixelRatio * (1.0 / -vp.z), 48.0 * uPixelRatio);
    vColor = aColor;
  }
`;

const galaxyFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 3.0);
    gl_FragColor = vec4(vColor, a);
  }
`;

function Galaxy({ count }) {
  const mat = useRef();
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  const { positions, colors, scales } = useMemo(() => {
    const { radius, branches, spin, randomness, insideColor, outsideColor } = CONFIG;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const inside = new THREE.Color(insideColor);
    const outside = new THREE.Color(outsideColor);
    const c = new THREE.Color();
    const jitter = (r) =>
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.4) * radius; // bias toward the core
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const a = branch + r * spin;
      positions[i * 3] = Math.cos(a) * r + jitter(r);
      positions[i * 3 + 1] = jitter(r) * 0.4;
      positions[i * 3 + 2] = Math.sin(a) * r + jitter(r);
      c.copy(inside).lerp(outside, r / radius);
      colors.set([c.r, c.g, c.b], i * 3);
      scales[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions, colors, scales };
  }, [count]);

  useFrame((_, delta) => {
    if (mat.current && !prefersReducedMotion) mat.current.uniforms.uTime.value += delta;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={galaxyVertex}
        fragmentShader={galaxyFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uSize: { value: 36 },
          uPixelRatio: { value: dpr },
        }}
      />
    </points>
  );
}

/* Distant static stars: gives parallax against the galaxy as you fly in */
function StarField({ count }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 25 + Math.random() * 45;
      const t = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const s = Math.sqrt(1 - u * u);
      p.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
    }
    return p;
  }, [count]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={1.4} sizeAttenuation={false} color="#cfd6ff" transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

/* ───────────── SCROLL → CAMERA ───────────── */
function CameraRig({ progress }) {
  const smooth = useRef(0);
  useFrame(({ camera }, delta) => {
    // ease the raw scroll value so wheel steps feel continuous
    const target = Math.min(progress.current / CONFIG.diveEnd, 1);
    smooth.current = THREE.MathUtils.damp(smooth.current, target, CONFIG.damping, delta);
    const t = smooth.current;
    const e = t * t * (3 - 2 * t); // smoothstep
    const { camStart: s, camEnd: f, drift } = CONFIG;
    camera.position.set(
      THREE.MathUtils.lerp(s.x, f.x, e) + Math.sin(t * Math.PI) * drift,
      THREE.MathUtils.lerp(s.y, f.y, e),
      THREE.MathUtils.lerp(s.z, f.z, e)
    );
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ───────────── HERO ───────────── */
export default function GalaxyHero() {
  const section = useRef(null);
  const progress = useRef(0); // read inside the render loop, no React re-renders

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const [faded, setFaded] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    // stop rendering WebGL once the screen is fully solid (re-renders only on crossing)
    setFaded(v >= CONFIG.fadeEnd);
  });

  const fadeOpacity = useTransform(scrollYProgress, [CONFIG.fadeStart, CONFIG.fadeEnd], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.22], [0, -40]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const galaxyCount = isMobile ? 20000 : 55000;
  const starCount = isMobile ? 800 : 2000;

  return (
    <section ref={section} style={{ position: "relative", height: CONFIG.scrollHeight, background: CONFIG.endColor }}>
      <style>{`
        .gh-cta{
          display:inline-block;
          padding:.95rem 1.8rem;
          border-radius:999px;
          background: #f4efe6;
          color: #0b0d1c;
          font:600 1rem/1 system-ui,sans-serif;
          text-decoration:none;
          transition:transform .2s,background .2s
        }
        .gh-cta:hover{
          background:rgba(243, 100, 171);
          transform:translateY(-2px)
        }
        @media (max-width: 767px) {
           .gh-cta-container { 
            margin-top: 15vh; 
            padding-bottom: 0.9rem;
           }
         }
        .gh-cta:focus-visible{
          outline:3px solid #ffb36b;
          outline-offset:3px
        }
        .gh-cta-alt{
          background:rgba(5,6,15,.35);
          color:#f4efe6;
          border:1.5px solid hsla(39, 39%, 93%, 0.60);
          -webkit-backdrop-filter:blur(6px);
          backdrop-filter:blur(6px)
        }
        .gh-cta-alt:hover{
          background: rgba(243, 100, 171, 0.4);
          border-color:#f4efe6
        }
        .gh-actions{
          display:flex;
          flex-wrap:wrap;
          justify-content:center;
          gap:.9rem
        }
        @media(max-width:480px){
          .gh-actions{
          flex-direction:column;
          align-items:stretch;
          width:100%;
          max-width:20rem
        }
        .gh-actions .gh-cta{
          text-align:center}
        }
        .gh-h1{
          font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;
          font-weight:500;
          font-size:clamp(2rem,5.6vw,4.6rem);
          line-height:1.08;
          letter-spacing:-.02em;
          margin:0 auto 1.2rem;
          max-width:15em;
          color:#f6f3ec;
          text-wrap:balance
        }
        .gh-sub{
          font:400 clamp(1rem,2.2vw,1.5rem)/1.55 system-ui,sans-serif;
          color: #eee6e6;
          margin:0 auto 2rem;
          max-width:38rem;
          text-wrap:balance
        }
      `}</style>

      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
        <Canvas
          frameloop={faded ? "never" : "always"}
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ fov: 60, near: 0.05, far: 200, position: [0, 4.5, 12] }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <color attach="background" args={["#000000"]} />
          <StarField count={starCount} />
          <Galaxy count={galaxyCount} />
          <CameraRig progress={progress} />
        </Canvas>

        {/* soft scrim keeps text readable over the bright core */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0, 60, 255, 0.4), transparent 70%)",
          }}
        />

        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 1.5rem",
            textShadow: "0 2px 24px rgba(0,0,0,.6)",
          }}
        >
          <h1 className="gh-h1">From SaaS Idea to a Secure, Working Web App</h1>
          <p className="gh-sub">
            One dedicated UI/UX designer &amp; full-stack developer to bring your SaaS product to life.
          </p>
          <div className="gh-actions gh-cta-container">
            <a className="gh-cta"  href="#contact">Build Your Web App</a>
            <a className="gh-cta gh-cta-alt" href="#work">Explore My Work</a>
          </div>
        </motion.div>

        {/* end-of-hero fade: galaxy dissolves into one solid color */}
        <motion.div
          aria-hidden
          style={{
            opacity: fadeOpacity,
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: CONFIG.endColor,
          }}
        />
      </div>
    </section>
  );
}