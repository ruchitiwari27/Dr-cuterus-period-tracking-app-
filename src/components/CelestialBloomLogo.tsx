import { motion } from "framer-motion";

const LotusPetal = ({ d, delay, color }: { d: string; delay: number; color: string }) => (
  <motion.path
    d={d}
    fill={color}
    stroke={color}
    strokeWidth="0.8"
    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
  />
);

export const MoonLogo = ({ size = 80, className = "" }: { size?: number; className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 140 140" fill="none" className="w-full h-full drop-shadow-[0_15px_50px_rgba(255,140,180,0.3)]">
      <defs>
        <linearGradient id="celestialMoon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFF2B2" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="65%" cy="40%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Crescent Moon */}
      <motion.path
        d="M 95 25 A 45 45 0 1 0 95 115 A 35 35 0 1 1 95 25 Z"
        fill="url(#celestialMoon)"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Subtle Lunar Craters */}
      <g opacity="0.15">
        <circle cx="55" cy="55" r="4" fill="white" />
        <circle cx="45" cy="75" r="3" fill="white" />
        <circle cx="65" cy="85" r="2" fill="white" />
      </g>

      {/* Surface Glow for realism */}
      <motion.path
        d="M 95 25 A 45 45 0 1 0 95 115 A 35 35 0 1 1 95 25 Z"
        fill="url(#moonGlow)"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </svg>
  </div>
);

export const CelestialBloomLogo = ({ size = 80, className = "" }: { size?: number; className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 140 140" fill="none" className="w-full h-full drop-shadow-[0_10px_30px_rgba(255,140,180,0.2)]">
      <defs>
        <linearGradient id="celestialMoonMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFF2B2" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="lotusPink" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB9C5" />
          <stop offset="100%" stopColor="#FF6B9E" />
        </linearGradient>
        <filter id="bloomGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Lotus Bloom centerpiece (Moon removed as requested) */}

      {/* Stylized Lotus Bloom - Centered centerpiece */}
      <g transform="translate(70, 70) scale(1.1)">
        {/* Center Petal */}
        <LotusPetal
          d="M 0 0 C -10 -20 0 -40 0 -40 C 0 -40 10 -20 0 0 Z"
          delay={0.5}
          color="url(#lotusPink)"
        />
        {/* Left Petal 1 */}
        <LotusPetal
          d="M -2 -2 C -20 -15 -35 0 -35 0 C -35 0 -15 15 -2 -2 Z"
          delay={0.7}
          color="#FFB9C5"
        />
        {/* Right Petal 1 */}
        <LotusPetal
          d="M 2 -2 C 20 -15 35 0 35 0 C 35 0 15 15 2 -2 Z"
          delay={0.7}
          color="#FFB9C5"
        />
        {/* Left Petal 2 */}
        <LotusPetal
          d="M -1 -5 C -15 -25 -25 -25 -25 -25 C -25 -25 -5 -15 -1 -5 Z"
          delay={0.9}
          color="#FFD1DC"
        />
        {/* Right Petal 2 */}
        <LotusPetal
          d="M 1 -5 C 15 -25 25 -25 25 -25 C 25 -25 5 -15 1 -5 Z"
          delay={0.9}
          color="#FFD1DC"
        />
      </g>

      {/* Atmospheric Glow */}
      <circle cx="70" cy="70" r="50" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" filter="url(#bloomGlow)" />
    </svg>
  </div>
);

export default CelestialBloomLogo;
