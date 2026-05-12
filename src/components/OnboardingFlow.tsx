import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { formatDateToYYYYMMDD } from "@/lib/dateUtils";
import SplashScreen from "./onboarding/SplashScreen";
import SignInScreen from "./onboarding/SignInScreen";
import CreateAccountScreen from "./onboarding/CreateAccountScreen";
import OTPVerificationScreen from "./onboarding/OTPVerificationScreen";
import ForYourselfScreen from "./onboarding/ForYourselfScreen";
import HowFoundUsScreen from "./onboarding/HowFoundUsScreen";
import BirthYearScreen from "./onboarding/BirthYearScreen";
import GoalsScreen from "./onboarding/GoalsScreen";
import HelpScreen from "./onboarding/HelpScreen";
import GotItScreen from "./onboarding/GotItScreen";

import PeriodFeelingsScreen from "./onboarding/PeriodFeelingsScreen";
import CycleMoodScreen from "./onboarding/CycleMoodScreen";
import RegularPeriodsScreen from "./onboarding/RegularPeriodsScreen";
import LastPeriodCalendar from "./onboarding/LastPeriodCalendar";

import DischargeDecoderScreen from "./onboarding/DischargeDecoderScreen";
import HealthConditionsScreen from "./onboarding/HealthConditionsScreen";
import SymptomsScreen from "./onboarding/SymptomsScreen";
import CycleSymptomsScreen from "./onboarding/CycleSymptomsScreen";
import HeightScreen from "./onboarding/HeightScreen";
import WeightScreen from "./onboarding/WeightScreen";
import EnergyImpactScreen from "./onboarding/EnergyImpactScreen";
import SleepImpactScreen from "./onboarding/SleepImpactScreen";
import MentalHealthScreen from "./onboarding/MentalHealthScreen";
import SleepImprovementScreen from "./onboarding/SleepImprovementScreen";
import SleepHoursScreen from "./onboarding/SleepHoursScreen";
import CalculatingScreen from "./onboarding/CalculatingScreen";
import Dashboard from "./Dashboard";

const screens = [
  "splash", "signin", "create-account", "verify-otp",
  // Auth gate: screens below only accessible after sign-in
  "for-yourself", "how-found", "birth-year", "goals", "help", "got-it",
  "period-feelings", "cycle-mood",
  "regular-periods", "last-period",
  "discharge-decoder", "health-conditions", "symptoms", "cycle-symptoms",
  "height", "weight",
  "energy-impact", "sleep-impact", "mental-health",
  "sleep-improvement", "sleep-hours",
  "calculating", "dashboard"
] as const;

type Screen = typeof screens[number];

const OnboardingFlow = () => {
  const [showInitialSplash, setShowInitialSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    return (localStorage.getItem("dc_current_screen") as Screen) || "splash";
  });
  const [history, setHistory] = useState<Screen[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [onboardingPeriodDates, setOnboardingPeriodDates] = useState<Date[]>([]);
  const dashboardBackRef = useRef<() => boolean>(() => false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [onboardingResponses, setOnboardingResponses] = useState({
    for_self: true,
    how_found_us: "",
    birth_year: 2000,
    goals: [] as string[],
    period_feelings: "",
    cycle_mood: "",
    period_regularity: "",
    discharge_awareness: "",
    health_conditions: [] as string[],
    symptoms: [] as string[],
    cycle_symptoms: [] as string[],
    height_cm: 165,
    weight_kg: 60,
    energy_impact: "",
    sleep_impact: "",
    mental_health: [] as string[],
    sleep_improvement: [] as string[],
    sleep_hours: "",
    last_period_start: "",
  });
  const [hasLoadedResponses, setHasLoadedResponses] = useState(false);

  const goTo = useCallback((screen: Screen, addToHistory = true) => {
    if (screen === "calculating") {
      // Mark as completed in Supabase when we hit calculating
      const markCompleted = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('onboarding_responses').update({
            completed_at: new Date().toISOString()
          }).eq('id', session.user.id);
        }
      };
      markCompleted();
    }
    
    if (addToHistory && screen !== currentScreen) {
      setHistory(prev => [...prev, currentScreen]);
      window.history.pushState({ screen }, "", `?step=${screen}`);
    }
    setCurrentScreen(screen);
  }, [currentScreen]);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      const prevScreen = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentScreen(prevScreen);
    } else {
      // If no history, default behavior
      const idx = screens.indexOf(currentScreen);
      if (idx > 0) {
        goTo(screens[idx - 1], false);
      }
    }
  }, [history, currentScreen, goTo]);

  // Browser Back Button (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // User pressed browser back button
      if (history.length > 0) {
        const prevScreen = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setCurrentScreen(prevScreen);
      } else {
        const idx = screens.indexOf(currentScreen);
        if (idx > 0) {
          setCurrentScreen(screens[idx - 1]);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [history, currentScreen]);

  const next = () => {
    const idx = screens.indexOf(currentScreen);
    if (idx < screens.length - 1) goTo(screens[idx + 1]);
  };

  // Check Supabase auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsSignedIn(true);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User";
        setUserData({ name, email: session.user.email || "" });
        
        // Check if onboarding was completed
        const { data: onboarding } = await supabase.from('onboarding_responses').select('completed_at').eq('id', session.user.id).maybeSingle();
        const isCompleted = !!onboarding?.completed_at;

        const savedScreen = localStorage.getItem("dc_current_screen") as Screen;
        
        // If signed in but onboarding not completed, and we are on a screen that shouldn't be accessible yet,
        // go to 'for-yourself' (first onboarding screen after auth)
        if (!isCompleted) {
          if (!savedScreen || ["splash", "signin", "create-account", "verify-otp"].includes(savedScreen)) {
            setCurrentScreen("for-yourself");
          } else {
            setCurrentScreen(savedScreen);
          }
        } else {
          // Onboarding completed, go to dashboard or saved screen
          if (!savedScreen || ["splash", "signin", "create-account", "verify-otp"].includes(savedScreen)) {
            setCurrentScreen("dashboard");
          } else {
            setCurrentScreen(savedScreen);
          }
        }
      }
      setAuthLoading(false);
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsSignedIn(true);
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User";
        setUserData({ name, email: session.user.email || "" });
      } else {
        setIsSignedIn(false);
        setUserData({ name: "", email: "" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const currentScreenRef = useRef(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  // Handle Hardware Back Button (Capacitor)
  useEffect(() => {
    let listenerHandle: { remove: () => void } | null = null;

    const handleBackButton = async () => {
      const { App } = await import('@capacitor/app');

      listenerHandle = await App.addListener('backButton', () => {
        const screen = currentScreenRef.current;
        if (screen === "dashboard") {
          const handled = dashboardBackRef.current();
          if (handled) return;

          App.exitApp();
        } else if (screen === "splash" || screen === "signin") {
          App.exitApp();
        } else {
          handleBack();
        }
      });
    };

    handleBackButton();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [handleBack]);

  // Load onboarding data when signed in
  useEffect(() => {
    if (!isSignedIn) return;

    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const uid = session.user.id;

      // 1. Fetch from onboarding_responses
      const { data: responses } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('id', uid)
        .single();

      // 2. Fetch from profiles (for height, weight, birth_year)
      const { data: profile } = await supabase
        .from('profiles')
        .select('height_cm, weight_kg, birth_year')
        .eq('id', uid)
        .single();

      if (responses || profile) {
        setOnboardingResponses(prev => ({
          ...prev,
          ...(responses || {}),
          height_cm: profile?.height_cm ?? prev.height_cm,
          weight_kg: profile?.weight_kg ?? prev.weight_kg,
          birth_year: profile?.birth_year ?? prev.birth_year,
        }));
      }
      setHasLoadedResponses(true);
    };

    loadData();
  }, [isSignedIn]);

  const updateResponse = async <K extends keyof typeof onboardingResponses>(key: K, value: typeof onboardingResponses[K]) => {
    // Update local state first for immediate UI feedback
    setOnboardingResponses(prev => ({ ...prev, [key]: value }));

    // Sync to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn("updateResponse: No active session, skipping Supabase sync for key:", key);
      return;
    }
    const uid = session.user.id;

    try {
      if (key === 'height_cm' || key === 'weight_kg' || key === 'birth_year') {
        // Update profiles table
        const { error } = await supabase.from('profiles').upsert({
          id: uid,
          [key]: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        if (error) {
          console.error("Error syncing profile:", error);
          toast.error(`Failed to save ${key}: ${error.message}`);
        }
      } else if (key === 'last_period_start') {
        // last_period_start doesn't exist as a column in onboarding_responses
        // Save to period_dates table instead
        if (value) {
          const dateStr = formatDateToYYYYMMDD(new Date(value as string));
          const { error } = await supabase.from('period_dates').upsert(
            { user_id: uid, date: dateStr },
            { onConflict: 'user_id,date' }
          );
          if (error) {
            console.error("Error syncing period date:", error);
            toast.error(`Failed to save period date: ${error.message}`);
          } else {
            // Also create a basic daily log for this period start date
            await supabase.from('daily_logs').upsert(
              { user_id: uid, log_date: dateStr, notes: 'Flow: medium' },
              { onConflict: 'user_id,log_date' }
            );
          }
        }
      } else {
        // Update onboarding_responses table
        const { error } = await supabase.from('onboarding_responses').upsert({
          id: uid,
          [key]: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        if (error) {
          console.error("Error syncing onboarding:", error);
          toast.error(`Failed to save ${key}: ${error.message}`);
        }
      }
    } catch (e: unknown) {
      console.error("Exception in updateResponse:", e);
    }
  };

  useEffect(() => {
    localStorage.setItem("dc_current_screen", currentScreen);
  }, [currentScreen]);

  const handleAccountCreated = (name: string, email: string, isAlreadyVerified: boolean) => {
    setPendingEmail(email);
    setUserData({ name, email });

    if (isAlreadyVerified) {
      setIsSignedIn(true);
      goTo("for-yourself");
    } else {
      goTo("verify-otp");
    }
  };

  const handleOTPVerified = (email: string) => {
    setIsSignedIn(true);
    setUserData(prev => ({ ...prev, email }));
    goTo("for-yourself");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsSignedIn(false);
    setUserData({ name: "", email: "" });
    localStorage.clear();
    setCurrentScreen("splash");
    setHistory([]);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }} 
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16"
        >
          <div className="w-full h-full rounded-full border-4 border-dc-pink border-t-dc-pink-deep animate-spin" />
        </motion.div>
      </div>
    );
  }

  // Initial Splash Overlay
  if (showInitialSplash) {
    return <SplashScreen onComplete={() => setShowInitialSplash(false)} />;
  }

  switch (currentScreen) {
    case "splash": return <SplashScreen onComplete={() => goTo("signin")} />;
    case "signin": return (
      <SignInScreen 
        onSignIn={() => { setIsSignedIn(true); goTo("dashboard"); }} 
        onCreateAccount={() => goTo("create-account")}
      />
    );
    case "create-account": return (
      <CreateAccountScreen 
        onAccountCreated={handleAccountCreated}
        onBack={() => goTo("signin")} 
      />
    );
    case "verify-otp": return (
      <OTPVerificationScreen 
        email={pendingEmail}
        onVerified={handleOTPVerified}
        onBack={() => goTo("create-account")}
      />
    );

    // Main Onboarding Flow
    case "for-yourself": return <ForYourselfScreen onNext={next} onBack={handleBack} />;
    case "how-found": return (
      <HowFoundUsScreen 
        value={onboardingResponses.how_found_us}
        onSelect={(v) => updateResponse('how_found_us', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "birth-year": return (
      <BirthYearScreen 
        value={onboardingResponses.birth_year}
        onSelect={(v) => updateResponse('birth_year', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "goals": return (
      <GoalsScreen 
        value={onboardingResponses.goals}
        onSelect={(v) => updateResponse('goals', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "help": return <HelpScreen onNext={next} onBack={handleBack} />;
    case "got-it": return <GotItScreen onNext={next} onBack={handleBack} />;
    case "period-feelings": return (
      <PeriodFeelingsScreen 
        value={onboardingResponses.period_feelings}
        onSelect={(v) => updateResponse('period_feelings', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "cycle-mood": return (
      <CycleMoodScreen 
        value={onboardingResponses.cycle_mood}
        onSelect={(v) => updateResponse('cycle_mood', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "regular-periods": return (
      <RegularPeriodsScreen 
        value={onboardingResponses.period_regularity}
        onSelect={(v) => updateResponse('period_regularity', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "last-period": return (
      <LastPeriodCalendar
        value={onboardingResponses.last_period_start}
        onSelectDates={(dates) => {
          if (dates.length > 0) {
            updateResponse('last_period_start', dates[0].toISOString());
          }
        }}
        onNext={next}
      />
    );
    case "discharge-decoder": return (
      <DischargeDecoderScreen 
        value={onboardingResponses.discharge_awareness}
        onSelect={(v) => updateResponse('discharge_awareness', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "health-conditions": return (
      <HealthConditionsScreen 
        value={onboardingResponses.health_conditions}
        onSelect={(v) => updateResponse('health_conditions', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "symptoms": return (
      <SymptomsScreen 
        value={onboardingResponses.symptoms}
        onSelect={(v) => updateResponse('symptoms', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "cycle-symptoms": return (
      <CycleSymptomsScreen 
        value={onboardingResponses.cycle_symptoms}
        onSelect={(v) => updateResponse('cycle_symptoms', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "height": return (
      <HeightScreen 
        value={onboardingResponses.height_cm}
        onSelect={(v) => updateResponse('height_cm', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "weight": return (
      <WeightScreen 
        value={onboardingResponses.weight_kg}
        onSelect={(v) => updateResponse('weight_kg', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "energy-impact": return (
      <EnergyImpactScreen 
        value={onboardingResponses.energy_impact}
        onSelect={(v) => updateResponse('energy_impact', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "sleep-impact": return (
      <SleepImpactScreen 
        value={onboardingResponses.sleep_impact}
        onSelect={(v) => updateResponse('sleep_impact', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "mental-health": return (
      <MentalHealthScreen 
        value={onboardingResponses.mental_health}
        onSelect={(v) => updateResponse('mental_health', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "sleep-improvement": return (
      <SleepImprovementScreen 
        value={onboardingResponses.sleep_improvement}
        onSelect={(v) => updateResponse('sleep_improvement', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "sleep-hours": return (
      <SleepHoursScreen 
        value={onboardingResponses.sleep_hours}
        onSelect={(v) => updateResponse('sleep_hours', v)}
        onNext={next} 
        onBack={handleBack} 
      />
    );
    case "calculating": return <CalculatingScreen onComplete={next} />;
    case "dashboard": return (
      <Dashboard 
        userData={userData} 
        initialPeriodDates={onboardingPeriodDates} 
        onLogout={handleLogout}
        setBackHandler={(handler) => { dashboardBackRef.current = handler; }}
      />
    );

    default: return <SplashScreen onComplete={() => goTo("signin")} />;
  }
};

export default OnboardingFlow;
