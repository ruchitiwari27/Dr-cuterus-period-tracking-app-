import { motion } from "framer-motion";

const Sparkle = ({ delay, x, y, size = 12 }: { delay: number; x: string; y: string; size?: number }) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
    transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 1 }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" fill="white" fillOpacity="0.85" />
    </svg>
  </motion.div>
);

export const SparkleGroup = () => (
  <>
    <Sparkle delay={0} x="20%" y="15%" size={10} />
    <Sparkle delay={0.5} x="75%" y="20%" size={14} />
    <Sparkle delay={1} x="15%" y="70%" size={8} />
    <Sparkle delay={1.5} x="80%" y="65%" size={12} />
    <Sparkle delay={0.8} x="50%" y="10%" size={10} />
    <Sparkle delay={1.2} x="60%" y="80%" size={8} />
  </>
);

export const Logo = ({ size = 80, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" fill="none" className={className}>
    <defs>
      <linearGradient id="logoMoonBody" x1="30" y1="20" x2="100" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
        <stop offset="40%" stopColor="hsl(280, 40%, 92%)" />
        <stop offset="100%" stopColor="hsl(300, 30%, 88%)" />
      </linearGradient>
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path
      d="M 85 18 A 52 52 0 1 0 85 122 A 40 40 0 1 1 85 18 Z"
      fill="url(#logoMoonBody)"
      filter="url(#logoGlow)"
    />
    <circle cx="45" cy="55" r="3" fill="hsl(280, 20%, 85%)" opacity="0.3" />
    <circle cx="55" cy="80" r="4" fill="hsl(280, 20%, 85%)" opacity="0.2" />
    <circle cx="38" cy="72" r="2" fill="hsl(280, 20%, 85%)" opacity="0.25" />
  </svg>
);

export default Logo;
