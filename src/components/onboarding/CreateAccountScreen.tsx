import { useState } from "react";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const CreateAccountScreen = ({ 
  onSubmit, 
  onBack 
}: { 
  onSubmit: (name: string, email: string, isAlreadyVerified: boolean) => void; 
  onBack: () => void 
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring" as const, damping: 25, stiffness: 200 } 
    }
  };

  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    
    // Attempt signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("rate limit")) {
        toast.error("Too many attempts. Please try again in an hour or check your Supabase rate limits.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    // If confirmation is OFF in Supabase, data.session will be populated immediately
    const isAlreadyVerified = !!data.session;
    
    if (isAlreadyVerified) {
      toast.success("Account created and signed in! 🎉");
    } else {
      toast.success("Account created! Please check your email for the code. 📧");
    }
    
    onSubmit(name, email, isAlreadyVerified);
  };

  const fields = [
    { icon: <User size={18} />, placeholder: "Full Name", type: "text", value: name, onChange: (v: string) => setName(v) },
    { icon: <Mail size={18} />, placeholder: "Email", type: "email", value: email, onChange: (v: string) => setEmail(v) },
    { icon: <Lock size={18} />, placeholder: "Password (min. 6 characters)", type: "password", value: password, onChange: (v: string) => setPassword(v) },
    { icon: <Lock size={18} />, placeholder: "Confirm Password", type: "password", value: confirmPassword, onChange: (v: string) => setConfirmPassword(v) },
  ];

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

      <motion.div variants={itemVariants} className="text-center mb-10">
        <h1 className="dc-heading text-3xl font-semibold tracking-tight">Create account <motion.span animate={{ rotate: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">✨</motion.span></h1>
        <p className="text-muted-foreground text-sm mt-3 opacity-80">Join Dr. Cuterus and start your journey</p>
      </motion.div>

      <div className="space-y-3.5">
        {fields.map((field, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="dc-glass-input rounded-2xl flex items-center px-5 py-3.5 gap-3 border-white/40 shadow-sm focus-within:ring-2 ring-dc-pink-deep/20 transition-all"
          >
            <span className="text-dc-pink-deep opacity-80">{field.icon}</span>
            <input 
              type={field.type} 
              placeholder={field.placeholder} 
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm font-body placeholder:text-muted-foreground/50" 
            />
          </motion.div>
        ))}

        <motion.button 
          variants={itemVariants}
          onClick={handleCreateAccount}
          disabled={loading}
          className="w-full dc-btn-primary text-sm mt-6 py-4 shadow-xl shadow-dc-pink-deep/20 disabled:opacity-60"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateAccountScreen;
