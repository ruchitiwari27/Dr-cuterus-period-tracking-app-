import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CelestialBloomLogo from "../CelestialBloomLogo";

const OTP_LENGTH = 6;

const OTPVerificationScreen = ({
  email,
  onVerified,
  onBack
}: {
  email: string;
  onVerified: (email: string) => void;
  onBack: () => void;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take last digit only
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (newOtp.every(d => d !== "") && newOtp.join("").length === OTP_LENGTH) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    // Focus last filled or next empty
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();

    if (pasted.length === OTP_LENGTH) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup"
    });
    setLoading(false);

    if (error) {
      if (error.message.includes("rate limit")) {
        toast.error("Code request limit reached. Please wait a while before trying again.");
      } else {
        toast.error(error.message || "Invalid OTP. Please try again.");
      }
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } else {
      toast.success("Email verified! Welcome aboard! 🎉");
      onVerified(email);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email
    });
    if (error) {
      if (error.message.includes("rate limit")) {
        toast.error("Too many resends. Please wait an hour.");
      } else {
        toast.error(error.message || "Could not resend OTP");
      }
    } else {
      toast.success("New OTP sent to your email! 📧");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 200 } }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col px-8 pt-12 pb-8 overflow-y-auto"
    >
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="self-start mb-6 w-10 h-10 rounded-full dc-glass flex items-center justify-center text-dc-pink-deep"
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft size={20} />
      </motion.button>

      <div className="flex-1 flex flex-col justify-center">
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.div
            className="inline-block relative w-20 h-20 mb-4 mx-auto"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <CelestialBloomLogo size={80} />
          </motion.div>

          <div className="w-14 h-14 rounded-full bg-dc-pink/20 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-dc-pink-deep" />
          </div>

          <h1 className="dc-heading text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-muted-foreground text-sm mt-3 opacity-80 leading-relaxed">
            We've sent a 6-digit code to<br />
            <span className="font-bold text-dc-pink-deep">{maskedEmail}</span>
          </p>
        </motion.div>

        {/* OTP Input Grid */}
        <motion.div variants={itemVariants} className="flex justify-center gap-3 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-center text-xl font-black rounded-2xl border-2 outline-none transition-all duration-300 bg-white/60 backdrop-blur-sm shadow-sm ${
                digit
                  ? "border-dc-pink-deep text-dc-pink-deep shadow-dc-pink/20"
                  : "border-white/60 text-foreground focus:border-dc-pink-deep focus:shadow-dc-pink/10"
              }`}
            />
          ))}
        </motion.div>

        {/* Verify Button */}
        <motion.button
          variants={itemVariants}
          onClick={() => handleVerify(otp.join(""))}
          disabled={loading || otp.some(d => !d)}
          className="w-full dc-btn-primary text-sm py-4 shadow-xl shadow-dc-pink-deep/20 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              Verifying...
            </motion.span>
          ) : (
            "Verify & Continue"
          )}
        </motion.button>

        {/* Resend */}
        <motion.div variants={itemVariants} className="text-center mt-6 space-y-3">
          <p className="text-xs text-muted-foreground">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-xs text-dc-pink-deep font-bold tracking-widest uppercase inline-flex items-center gap-1.5 disabled:opacity-40 transition-opacity"
          >
            <RefreshCw size={12} className={resendCooldown > 0 ? "" : "animate-spin-slow"} />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
          </button>
          
          <p className="text-[10px] text-muted-foreground/60 px-4 leading-relaxed italic">
            Note: If you receive a link instead of a code, ensure your Supabase email templates use the <strong>{"{{ .Token }}"}</strong> variable.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OTPVerificationScreen;
