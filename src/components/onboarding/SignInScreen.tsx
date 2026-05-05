import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import CelestialBloomLogo from "../CelestialBloomLogo";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SignInScreen = ({ onSignIn, onCreateAccount }: { onSignIn: (email: string) => void; onCreateAccount: () => void }) => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 200 } }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      onSignIn(email);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col px-8 pt-16 pb-8 overflow-y-auto"
    >
      <div className="flex-1 flex flex-col justify-center">
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.div 
            className="inline-block relative w-32 h-32 mb-4 mx-auto"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CelestialBloomLogo size={128} />
          </motion.div>
          <h1 className="dc-heading text-3xl font-semibold mt-4 tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-2 opacity-80">Sign in to continue your wellness journey</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div variants={itemVariants} className="dc-glass-input rounded-2xl flex items-center px-5 py-4 gap-3 border-white/40 shadow-sm focus-within:ring-2 ring-dc-pink-deep/20 transition-all">
            <Mail size={18} className="text-dc-pink-deep opacity-80" />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm font-body placeholder:text-muted-foreground/50" 
            />
          </motion.div>

          <motion.div variants={itemVariants} className="dc-glass-input rounded-2xl flex items-center px-5 py-4 gap-3 border-white/40 shadow-sm focus-within:ring-2 ring-dc-pink-deep/20 transition-all">
            <Lock size={18} className="text-dc-pink-deep opacity-80" />
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              className="bg-transparent outline-none flex-1 text-sm font-body placeholder:text-muted-foreground/50" 
            />
            <button onClick={() => setShowPass(!showPass)} className="text-dc-pink-deep opacity-60 hover:opacity-100 transition-opacity">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          <motion.button 
            variants={itemVariants}
            onClick={handleSignIn} 
            disabled={loading}
            className="w-full dc-btn-primary text-sm mt-4 py-4 shadow-xl shadow-dc-pink-deep/20 disabled:opacity-60"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center space-y-4 pt-6">
            <button className="text-xs text-dc-pink-deep font-bold tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity">Forgot Password?</button>
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={onCreateAccount} className="text-dc-pink-deep font-bold underline underline-offset-4 decoration-dc-pink/30 hover:decoration-dc-pink transition-all">Create one</button>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignInScreen;
