import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  User, Bell, Pill, Heart, Moon, Globe, Lock, HelpCircle,
  ChevronRight, LogOut, Smartphone, Mail, Shield, Palette,
  Clock, Calendar, Volume2, VolumeX, Users
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import snehaAvatar from "@/assets/sneha-avatar.png";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

// Initialize EmailJS with the public key if it exists
if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
}

const UserStat = ({ label, value, unit }: { label: string; value: string | number; unit?: string }) => (
  <div className="flex flex-col items-center justify-center py-1 px-3 border-r border-border/20 last:border-0">
    <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-black dc-text-gradient">
      {value} <span className="text-[10px] font-bold text-foreground/60">{unit}</span>
    </p>
  </div>
);

const SettingsSection = ({ 
  userData, 
  pillReminder, 
  setPillReminder,
  notifications,
  setNotifications,
  notificationSettings,
  setNotificationSettings,
  partnerSync,
  setPartnerSync,
  onLogout
}: { 
  userData: { name: string; email: string };
  pillReminder: { enabled: boolean; time: string; pillName: string };
  setPillReminder: React.Dispatch<React.SetStateAction<{ enabled: boolean; time: string; pillName: string }>>;
  notifications: { periodReminder: boolean; fertileWindow: boolean; dailyInsights: boolean };
  setNotifications: React.Dispatch<React.SetStateAction<{ periodReminder: boolean; fertileWindow: boolean; dailyInsights: boolean }>>;
  notificationSettings: { time: string; lastNotified: { period: string; fertile: string; insight: string } };
  setNotificationSettings: React.Dispatch<React.SetStateAction<{ time: string; lastNotified: { period: string; fertile: string; insight: string } }>>;
  partnerSync: { 
    enabled: boolean; 
    partnerName: string; 
    partnerEmail: string; 
    syncCode: string; 
    status: "disconnected" | "pending" | "connected";
    inviteSentAt: string | null;
    lastSynced: string | null;
    shareSymptoms: boolean; 
    shareMood: boolean; 
    shareCycle: boolean; 
    shareNotifications: boolean 
  };
  setPartnerSync: React.Dispatch<React.SetStateAction<{ 
    enabled: boolean; 
    partnerName: string; 
    partnerEmail: string; 
    syncCode: string; 
    status: "disconnected" | "pending" | "connected";
    inviteSentAt: string | null;
    lastSynced: string | null;
    shareSymptoms: boolean; 
    shareMood: boolean; 
    shareCycle: boolean; 
    shareNotifications: boolean 
  }>>;
  onLogout: () => void;
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);




  const [userProfile, setUserProfile] = useState({
    birthYear: 2000,
    height: 165,
    weight: 60,
  });

  const profileLoaded = useRef(false);

  // Load profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profile) {
        setUserProfile({
          birthYear: profile.birth_year || 2000,
          height: profile.height_cm || 165,
          weight: profile.weight_kg || 60,
        });
      }
      // Delay so React batches the setState before save effect fires
      setTimeout(() => { profileLoaded.current = true; }, 300);
    };
    loadProfile();
  }, []);

  // Save profile to Supabase on height/weight change (only after load)
  useEffect(() => {
    if (!profileLoaded.current) return;
    const saveProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      await supabase.from('profiles').upsert({
        id: session.user.id,
        height_cm: userProfile.height,
        weight_kg: userProfile.weight,
        birth_year: userProfile.birthYear,
        updated_at: new Date().toISOString()
      });
    };
    saveProfile();
  }, [userProfile]);

  const [localPillSettings, setLocalPillSettings] = useState(pillReminder);
  const [localNotificationTime, setLocalNotificationTime] = useState(notificationSettings.time);
  const [partnerOtp, setPartnerOtp] = useState("");

  // Sync local data with global state on mount or change
  useEffect(() => {
    setLocalPillSettings(pillReminder);
    setLocalNotificationTime(notificationSettings.time);
  }, [pillReminder, notificationSettings.time]);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Settings</h2>
          <p className="text-xs text-muted-foreground">Manage your preferences</p>
        </div>
        <button 
          title="Notifications"
          onClick={() => toast.info("No new notifications", {
            description: "You're all caught up! ✨",
            icon: <Bell size={16} className="text-dc-pink-deep" />
          })}
          className="w-10 h-10 relative flex items-center justify-center rounded-2xl bg-white/40 border border-white/60 text-muted-foreground hover:text-dc-pink-deep transition-all active:scale-95 shadow-sm mt-1"
        >
          <Bell size={20} />
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-dc-pink-deep border border-white shadow-sm" />
        </button>
      </div>

      {/* Profile Card */}
      <motion.div
        className="mx-5 dc-glass-strong rounded-3xl p-5 overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-16 h-16 border-2 border-dc-pink shadow-md overflow-hidden bg-white text-foreground">
            <AvatarImage src={snehaAvatar} alt="Sneha" className="object-cover" />
            <AvatarFallback><User size={32} /></AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-black text-lg leading-tight">{userData.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-dc-pink-deep opacity-70" />
              <p className="text-xs text-muted-foreground font-medium">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* User Stats Grid - Now Editable Height/Weight */}
        <div className="grid grid-cols-2 bg-white/30 dark:bg-black/20 rounded-2xl border border-white/40 dark:border-white/10 py-2.5">
          <div className="flex flex-col items-center justify-center py-1 px-3 border-r border-border/20">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Height</p>
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                value={userProfile.height}
                onChange={(e) => setUserProfile(p => ({ ...p, height: Number(e.target.value) }))}
                className="w-12 bg-transparent text-sm font-black dc-text-gradient text-center outline-none"
              />
              <span className="text-[10px] font-bold text-foreground/60">cm</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-1 px-3">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Weight</p>
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                value={userProfile.weight}
                onChange={(e) => setUserProfile(p => ({ ...p, weight: Number(e.target.value) }))}
                className="w-12 bg-transparent text-sm font-black dc-text-gradient text-center outline-none"
              />
              <span className="text-[10px] font-bold text-foreground/60">kg</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        className="mx-5 mt-4 dc-glass-strong rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
            <Bell size={16} className="text-dc-pink-deep" />
          </div>
            <h3 className="font-bold text-sm">Notifications</h3>
          </div>
  
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={15} className="text-rose-500" />
                <div>
                  <p className="text-xs font-semibold">Period Reminder</p>
                  <p className="text-[10px] text-muted-foreground">Alert 2 days before your period start</p>
                </div>
              </div>
              <Switch checked={notifications.periodReminder} onCheckedChange={(v) => setNotifications((p) => ({ ...p, periodReminder: v }))} />
            </div>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart size={15} className="text-dc-pink-deep" />
                <div>
                  <p className="text-xs font-semibold">Fertile Window</p>
                  <p className="text-[10px] text-muted-foreground">Ovulation & fertility window alerts</p>
                </div>
              </div>
              <Switch checked={notifications.fertileWindow} onCheckedChange={(v) => setNotifications((p) => ({ ...p, fertileWindow: v }))} />
            </div>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone size={15} className="text-amber-500" />
                <div>
                  <p className="text-xs font-semibold">Daily Insights</p>
                  <p className="text-[10px] text-muted-foreground">Daily health tips & cycle guidance</p>
                </div>
              </div>
              <Switch checked={notifications.dailyInsights} onCheckedChange={(v) => setNotifications((p) => ({ ...p, dailyInsights: v }))} />
            </div>

            <div className="pt-2 border-t border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center">
                    <Clock size={14} className="text-dc-pink-deep" />
                  </div>
                  <span className="text-xs font-semibold">Daily Alert Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={localNotificationTime}
                    onChange={(e) => setLocalNotificationTime(e.target.value)}
                    className="bg-white/50 dark:bg-black/40 rounded-lg px-2 py-1.5 text-xs outline-none border border-white/60 dark:border-white/10 focus:border-dc-pink-deep transition-all shadow-sm font-medium"
                  />
                  <button
                    onClick={() => {
                      setNotificationSettings(p => ({ ...p, time: localNotificationTime }));
                      toast.success("Notification time updated! ✨", {
                        description: `We'll ping you at ${localNotificationTime} daily.`
                      });
                    }}
                    disabled={localNotificationTime === notificationSettings.time}
                    className="h-8 px-3 rounded-lg bg-dc-pink-deep text-white text-[10px] font-black shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    SET
                  </button>
                </div>
              </div>
              <p className="text-[9px] text-center text-muted-foreground mt-2 italic bg-white/30 dark:bg-black/20 py-1 rounded-md">
                All alerts are scheduled for <span className="font-bold text-dc-pink-deep">{notificationSettings.time}</span> (System Time)
              </p>
            </div>
          </div>
        </motion.div>

      {/* Pill Reminder Section */}
      <motion.div
        className="mx-5 mt-4 dc-glass-strong rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Pill size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-sm">Pill Reminder</h3>
          </div>
          <Switch checked={pillReminder.enabled} onCheckedChange={(v) => setPillReminder((p) => ({ ...p, enabled: v }))} />
        </div>

        {pillReminder.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 pt-1"
          >
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pill Name</label>
              <input
                type="text"
                value={localPillSettings.pillName}
                onChange={(e) => setLocalPillSettings((p) => ({ ...p, pillName: e.target.value }))}
                className="w-full mt-1 bg-white/50 dark:bg-black/40 rounded-xl px-3 py-2 text-xs outline-none border border-white/30 dark:border-white/10 focus:border-dc-pink-deep transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Reminder Time</label>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={14} className="text-muted-foreground" />
                <input
                  type="time"
                  value={localPillSettings.time}
                  onChange={(e) => setLocalPillSettings((p) => ({ ...p, time: e.target.value }))}
                  className="bg-white/50 dark:bg-black/40 rounded-xl px-3 py-2 text-xs outline-none border border-white/30 dark:border-white/10 focus:border-dc-pink-deep transition-colors"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] text-muted-foreground">
                  Alarms at <span className="font-semibold text-foreground">{pillReminder.time}</span>
                </p>
              </div>
              
              <button
                onClick={() => {
                  setPillReminder(localPillSettings);
                  toast.success("Reminder updated! ✨", {
                    description: `Pill reminder scheduled for ${localPillSettings.time} daily.`
                  });
                }}
                className="px-4 py-1.5 rounded-xl bg-dc-pink-deep text-white text-[10px] font-bold shadow-sm active:scale-95 transition-transform"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Partner Sync Section */}
      <motion.div
        className="mx-5 mt-4 dc-glass-strong rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
              <Users size={16} className="text-dc-pink-deep" />
            </div>
            <h3 className="font-bold text-sm">Partner Sync</h3>
          </div>
          <Switch 
            checked={partnerSync.enabled} 
            onCheckedChange={(v) => {
              setPartnerSync((p) => ({ ...p, enabled: v }));
              if (v) {
                toast.success("Partner Sync enabled! ✨", {
                  description: "Share your sync code to get started."
                });
              } else {
                toast.info("Partner Sync disabled");
              }
            }} 
          />
        </div>

        {partnerSync.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 pt-1"
          >
            {partnerSync.status === "connected" ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl p-4 mb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center relative">
                      <Users size={18} className="text-green-600 dark:text-green-300" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-green-900 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-green-900 dark:text-green-100">{partnerSync.partnerName || "Partner"}</p>
                      <p className="text-[10px] text-green-700 dark:text-green-300/70 font-bold uppercase tracking-widest">Connected • Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setPartnerSync(p => ({ ...p, status: 'disconnected', partnerName: '', partnerEmail: '' }));
                      toast.info("Partner disconnected");
                    }}
                    className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/40 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
                  >
                    DISCONNECT
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-green-800/60 dark:text-green-200/40 px-1">
                  <span>Last synced: Just now</span>
                  <span className="flex items-center gap-1"><Shield size={10} /> Encrypted Sync</span>
                </div>
              </div>
            ) : partnerSync.status === "pending" ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                      <Mail size={18} className="text-amber-600 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-amber-900 dark:text-amber-100">Waiting for {partnerSync.partnerName || "partner"}...</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-300/70 font-bold uppercase tracking-widest">Invite Sent to {partnerSync.partnerEmail}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setPartnerSync(p => ({ ...p, status: 'disconnected' }));
                      toast.info("Invitation cancelled");
                    }}
                    className="p-2 text-amber-400 hover:text-amber-600 transition-colors"
                  >
                    <VolumeX size={16} />
                  </button>
                </div>
                
                {/* NEW: OTP Display for UI visibility */}
                <div className="mt-4 p-3 bg-white/60 dark:bg-black/40 rounded-xl border border-amber-200/50 dark:border-amber-700/30 text-center">
                  <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Your Connection Code</p>
                  <p className="text-2xl font-black tracking-[0.3em] text-amber-900 dark:text-amber-100 font-mono">
                    {partnerSync.syncCode}
                  </p>
                  <p className="text-[8px] font-bold text-amber-700/60 dark:text-amber-300/40 mt-1">Share this code with your partner</p>
                </div>
                <div className="mt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={partnerOtp}
                      onChange={(e) => setPartnerOtp(e.target.value)}
                      maxLength={6}
                      className="flex-1 bg-white/50 dark:bg-black/40 rounded-xl px-3 py-2 text-xs outline-none border border-white/60 dark:border-white/10 focus:border-dc-pink-deep transition-all shadow-sm font-mono tracking-widest text-center"
                    />
                    <button 
                      onClick={async () => {
                          if (partnerOtp.length !== 6) {
                            toast.error("Please enter a 6-digit OTP");
                            return;
                          }
                          const { data: { session } } = await supabase.auth.getSession();
                          if (!session?.user) return;

                          toast.loading("Verifying OTP...");
                          
                          // Actually verify the OTP against the database
                          const { data: partnerData, error: findError } = await supabase
                            .from('partner_sync')
                            .select('id, partner_email')
                            .eq('sync_code', partnerOtp)
                            .single();

                          if (findError || !partnerData) {
                            toast.dismiss();
                            toast.error("Invalid OTP. Please check and try again.");
                            return;
                          }

                          // Update both users to connected
                          await supabase.from('partner_sync').upsert({
                            id: session.user.id,
                            status: 'connected',
                            partner_email: partnerData.partner_email,
                            last_synced_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                          });
                          
                          await supabase.from('partner_sync').update({
                            status: 'connected',
                            last_synced_at: new Date().toISOString()
                          }).eq('id', partnerData.id);

                          setTimeout(() => {
                            toast.dismiss();
                            setPartnerSync(p => ({ ...p, status: 'connected', lastSynced: new Date().toISOString() }));
                            toast.success("Partner Connected! ✨");
                            setPartnerOtp("");
                          }, 1000);
                      }}
                      className="px-4 py-2 bg-dc-pink-deep text-white text-[10px] font-black rounded-lg active:scale-95 transition-all shadow-sm shadow-dc-pink/20"
                    >
                      VERIFY
                    </button>
                  </div>
                  <button 
                    onClick={async () => {
                       toast.loading("Resending invite...");
                       const { data: { session } } = await supabase.auth.getSession();
                       if (!session?.user) return;
                       
                       // Generate a new OTP
                       const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                       
                       await supabase.from('partner_sync').update({
                         sync_code: newOtp,
                         invite_sent_at: new Date().toISOString()
                       }).eq('id', session.user.id);

                       try {
                         await emailjs.send(
                           import.meta.env.VITE_EMAILJS_SERVICE_ID,
                           import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                           {
                             to_email: partnerSync.partnerEmail,
                             to_name: partnerSync.partnerName || 'Partner',
                             from_name: 'Your Partner',
                             otp_code: newOtp,
                           },
                           import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                         );
                         toast.dismiss();
                         toast.success("Invite resent! ✨", {
                           description: `The OTP ${newOtp} was sent to ${partnerSync.partnerEmail}.`
                         });
                        } catch (err: unknown) {
                          console.error("EmailJS error:", err);
                          toast.dismiss();
                          const errorMsg = (err as any)?.text || (err as any)?.message || "Check your credentials in .env";
                          toast.error(`Email failed: ${errorMsg}`, {
                            description: `Demo Mode: The OTP is ${newOtp}.`
                          });
                        }
                    }}
                    className="w-full mt-2 py-2 bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-100 text-[10px] font-black rounded-lg active:scale-95 transition-all"
                  >
                    RESEND INVITE
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">Partner's Name</label>
                    <input
                      type="text"
                      value={partnerSync.partnerName}
                      onChange={(e) => setPartnerSync((p) => ({ ...p, partnerName: e.target.value }))}
                      placeholder="e.g. Rahul"
                      className="w-full mt-1 bg-white/50 dark:bg-black/40 rounded-xl px-3.5 py-2.5 text-xs outline-none border border-white/60 dark:border-white/10 focus:border-dc-pink-deep transition-all shadow-sm placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">Partner's Email</label>
                    <input
                      type="email"
                      value={partnerSync.partnerEmail}
                      onChange={(e) => setPartnerSync((p) => ({ ...p, partnerEmail: e.target.value }))}
                      placeholder="partner@email.com"
                      className="w-full mt-1 bg-white/50 dark:bg-black/40 rounded-xl px-3.5 py-2.5 text-xs outline-none border border-white/60 dark:border-white/10 focus:border-dc-pink-deep transition-all shadow-sm placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (!partnerSync.partnerEmail || !partnerSync.partnerName) {
                        toast.error("Please fill in name and email");
                        return;
                      }
                      
                      const sendInvite = async () => {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session?.user) return;

                        toast.loading("Sending secure invitation...");
                        
                        // Generate a secure 6-digit OTP locally for the connection
                        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

                        // Update Supabase
                        const { error } = await supabase.from('partner_sync').upsert({
                          id: session.user.id,
                          partner_name: partnerSync.partnerName,
                          partner_email: partnerSync.partnerEmail,
                          sync_code: newOtp,
                          status: 'pending',
                          invite_sent_at: new Date().toISOString(),
                          updated_at: new Date().toISOString()
                        });

                        if (error) {
                          toast.dismiss();
                          toast.error("Failed to update status: " + error.message);
                          return;
                        }

                        try {
                          if (!partnerSync.partnerEmail) {
                            throw new Error("Recipient email is missing in state");
                          }
                          console.log("Sending EmailJS (Initial):", {
                            serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
                            templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                            to_email: partnerSync.partnerEmail,
                            to_name: partnerSync.partnerName
                          });
                          await emailjs.send(
                            import.meta.env.VITE_EMAILJS_SERVICE_ID,
                            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                            {
                              to_email: partnerSync.partnerEmail,
                              email: partnerSync.partnerEmail, // Alternative common name
                              to_name: partnerSync.partnerName,
                              from_name: 'Your Partner',
                              otp_code: newOtp,
                            }
                          );
                          toast.dismiss();
                          setPartnerSync(p => ({ ...p, status: 'pending', inviteSentAt: new Date().toISOString(), syncCode: newOtp }));
                          toast.success("Invitation emailed! ✨", {
                            description: `The OTP ${newOtp} was sent to ${partnerSync.partnerEmail}.`
                          });
                        } catch (emailErr: unknown) {
                          console.error("EmailJS error:", emailErr);
                          toast.dismiss();
                          setPartnerSync(p => ({ ...p, status: 'pending', inviteSentAt: new Date().toISOString(), syncCode: newOtp }));
                          const errorMsg = (emailErr as any)?.text || (emailErr as any)?.message || "Check your credentials in .env";
                          toast.error(`Email failed: ${errorMsg}`, {
                            description: `Demo Mode: The OTP is ${newOtp}.`
                          });
                        }
                      };

                      sendInvite();
                    }}
                    className="w-full mt-1 bg-dc-pink-deep text-white py-3 rounded-2xl text-[13px] font-black shadow-lg shadow-dc-pink-deep/20 active:scale-[0.98] transition-all hover:brightness-110"
                  >
                    Send Invitation
                  </button>
                </div>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-border/10">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">Your Unique Sync Code</label>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 bg-secondary/30 dark:bg-black/40 rounded-xl px-4 py-2.5 text-xs border border-white/60 dark:border-white/10 font-mono tracking-[0.2em] text-center text-dc-pink-deep font-black shadow-inner">
                  {partnerSync.syncCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(partnerSync.syncCode);
                    toast.success("Sync code copied! 📋", {
                      description: "Send this to your partner manually if needed."
                    });
                  }}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-dc-pink/10 border border-dc-pink/20 text-dc-pink-deep active:scale-90 transition-all shadow-sm"
                >
                  <Smartphone size={18} />
                </button>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1 mb-3">Sync Preferences</p>

              <div className="space-y-2">
                {[
                  { label: "Share Cycle Dates", sub: "Period starts, ends & predictions", icon: Calendar, key: "shareCycle" },
                  { label: "Share Mood", sub: "Daily emotional wellness logs", icon: Heart, key: "shareMood" },
                  { label: "Share Symptoms", sub: "Health check-ins & logs", icon: Shield, key: "shareSymptoms" },
                  { label: "Sync Notifications", sub: "Alert partner to upcoming dates", icon: Bell, key: "shareNotifications" },
                ].map(({ label, sub, icon: Icon, key }) => (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/20 dark:bg-black/10 border border-white/40 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-background/50 flex items-center justify-center">
                        <Icon size={14} className="text-dc-pink-deep opacity-80" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-foreground">{label}</p>
                        <p className="text-[9px] text-muted-foreground font-medium">{sub}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={Boolean(partnerSync[key as keyof typeof partnerSync])} 
                      onCheckedChange={(v) => setPartnerSync((p) => ({ ...p, [key]: v }))} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Appearance */}
      <motion.div
        className="mx-5 mt-4 dc-glass-strong rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <Palette size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-bold text-sm">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon size={15} className="text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold">Dark Mode</p>
              <p className="text-[10px] text-muted-foreground">Switch to dark theme</p>
            </div>
          </div>
          <Switch 
            checked={mounted && isDarkMode} 
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
          />
        </div>
      </motion.div>

      {/* General */}
      <motion.div
        className="mx-5 mt-4 dc-glass-strong rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
            <Globe size={16} className="text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-bold text-sm">General</h3>
        </div>

        <div className="space-y-1">
          {[
            { 
              icon: Lock, 
              label: "Privacy & Security", 
              value: "Verified",
              onClick: () => toast.info("Privacy Report 🔒", {
                description: "Your health data is end-to-end encrypted and never shared with third parties."
              })
            },
            { 
              icon: HelpCircle, 
              label: "Help & Support", 
              value: "",
              onClick: () => toast.info("Support Hub ✨", {
                description: "Contact us at support@dr-cuterus.com or visit our FAQ."
              })
            },
          ].map(({ icon: Icon, label, value, onClick }) => (
            <button 
              key={label} 
              onClick={onClick}
              className="w-full flex items-center justify-between py-3.5 border-b border-border/20 last:border-0 hover:bg-white/10 dark:hover:bg-black/10 px-1 rounded-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Icon size={15} className="text-muted-foreground" />
                <p className="text-xs font-semibold">{label}</p>
              </div>
              <div className="flex items-center gap-2">
                {value && <span className="text-[10px] font-black text-dc-pink-deep bg-dc-pink/10 px-2 py-0.5 rounded-full">{value}</span>}
                <ChevronRight size={14} className="text-muted-foreground/40" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Log Out */}
      <motion.div
        className="mx-5 mt-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl dc-glass-strong text-red-500 font-semibold text-sm active:scale-95 transition-all"
        >
          <LogOut size={16} />
          Log Out
        </button>

        <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
           <p className="text-[10px] font-black tracking-widest uppercase">Dr. Cuterus Dashboard</p>
           <p className="text-[9px] font-bold">Version 2.4.0 • Build 892</p>
           <div className="flex gap-4 mt-2">
              <span className="text-[8px] font-bold underline cursor-pointer">Terms of Service</span>
              <span className="text-[8px] font-bold underline cursor-pointer">Privacy Policy</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsSection;
