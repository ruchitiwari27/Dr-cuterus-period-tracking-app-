import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
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
        const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User";
        setUserData({ name, email: session.user.email || "" });
        // If user was on splash/signin, go to where they left off or dashboard
        const savedScreen = localStorage.getItem("dc_current_screen") as Screen;
        if (!savedScreen || savedScreen === "splash" || savedScreen === "signin" || savedScreen === "create-account" || savedScreen === "verify-otp") {
          setCurrentScreen("dashboard");
        }
      }
      setAuthLoading(false);
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsSignedIn(true);
        const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || "User";
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
    let listenerHandle: any = null;

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
          const dateStr = new Date(value as string).toISOString().split('T')[0];
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
          console.error("Error syncing onboarding response:", error);
          toast.error(`Failed to save ${key}: ${error.message}`);
        }
      }
    } catch (err) {
      console.error("Unexpected error in updateResponse:", err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "true") {
      localStorage.clear();
      supabase.auth.signOut();
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dc_current_screen", currentScreen);
  }, [currentScreen]);

  const handleSignIn = (email: string) => {
    setIsSignedIn(true);
    setUserData(prev => ({ ...prev, name: email.split('@')[0] || "User", email }));
    goTo("dashboard");
  };

  const handleCreateAccount = () => {
    goTo("create-account");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setIsSignedIn(false);
    setUserData({ name: "", email: "" });
    setCurrentScreen("splash");
    toast.success("Signed out! Starting fresh... ✨");
  };

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

  // Progress bar (only for data-collection screens, index 3–25)
  const dataScreens = screens.slice(3, -1); // exclude splash, signin, create-account, dashboard
  const dataIdx = dataScreens.indexOf(currentScreen as Screen);
  const showProgress = dataIdx >= 0;
  const progress = showProgress ? ((dataIdx + 1) / dataScreens.length) * 100 : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5D1DA]">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#63454A] text-sm font-bold tracking-widest uppercase"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const renderScreen = () => {
    // Auth gate: if not signed in and trying to access post-auth screens
    // Allow verify-otp screen without being signed in (it's part of signup flow)
    if (!isSignedIn && screens.indexOf(currentScreen) > 3 && currentScreen !== "dashboard" && currentScreen !== "verify-otp") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen h-[100dvh] dc-gradient-warm flex flex-col items-center justify-center px-8"
        >
          <span className="text-5xl mb-4">🔒</span>
          <h2 className="dc-heading text-xl font-bold text-center mb-2">Sign in to continue</h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Please sign in or create an account to continue your wellness journey.
          </p>
          <button onClick={() => goTo("signin")} className="w-full dc-btn-primary text-sm">
            Go to Sign In
          </button>
        </motion.div>
      );
    }

    if (showInitialSplash) {
      return <SplashScreen onComplete={() => setShowInitialSplash(false)} />;
    }

    switch (currentScreen) {
      case "splash": return <SplashScreen onComplete={() => goTo("signin")} />;
      case "signin": return <SignInScreen onSignIn={handleSignIn} onCreateAccount={handleCreateAccount} />;
      case "create-account": return <CreateAccountScreen onSubmit={handleAccountCreated} onBack={() => goTo("signin")} />;
      case "verify-otp": return <OTPVerificationScreen email={pendingEmail} onVerified={handleOTPVerified} onBack={() => goTo("create-account")} />;

      case "for-yourself": return (
        <ForYourselfScreen
          value={onboardingResponses.for_self}
          onNext={(val) => { updateResponse('for_self', val); next(); }}
        />
      );
      case "how-found": return (
        <HowFoundUsScreen
          value={onboardingResponses.how_found_us}
          onNext={(val) => { updateResponse('how_found_us', val); next(); }}
        />
      );
      case "birth-year": return (
        <BirthYearScreen
          value={onboardingResponses.birth_year}
          onNext={(val) => { updateResponse('birth_year', val); next(); }}
        />
      );
      case "goals": return (
        <GoalsScreen
          value={onboardingResponses.goals}
          onNext={(val) => { updateResponse('goals', val); next(); }}
        />
      );
      case "help": return <HelpScreen onNext={next} />; // Intro only
      case "got-it": return <GotItScreen onNext={next} />; // Intro only

      case "period-feelings": return (
        <PeriodFeelingsScreen
          value={onboardingResponses.period_feelings}
          onNext={(val) => { updateResponse('period_feelings', val); next(); }}
        />
      );
      case "cycle-mood": return <CycleMoodScreen onNext={next} />;
      case "regular-periods": return (
        <RegularPeriodsScreen
          value={onboardingResponses.period_regularity}
          onNext={(val) => { updateResponse('period_regularity', val); next(); }}
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

      case "discharge-decoder": return <DischargeDecoderScreen onNext={next} />;

      case "health-conditions": return (
        <HealthConditionsScreen
          value={onboardingResponses.health_conditions}
          onNext={(val) => { updateResponse('health_conditions', val); next(); }}
        />
      );
      case "symptoms": return (
        <SymptomsScreen
          value={onboardingResponses.symptoms}
          onNext={(val) => { updateResponse('symptoms', val); next(); }}
        />
      );
      case "cycle-symptoms": return (
        <CycleSymptomsScreen
          value={onboardingResponses.cycle_symptoms}
          onNext={(val) => { updateResponse('cycle_symptoms', val); next(); }}
        />
      );
      case "height": return (
        <HeightScreen
          value={onboardingResponses.height_cm}
          onNext={(val) => { updateResponse('height_cm', val); next(); }}
        />
      );
      case "weight": return (
        <WeightScreen
          value={onboardingResponses.weight_kg}
          onNext={(val) => { updateResponse('weight_kg', val); next(); }}
        />
      );
      case "energy-impact": return (
        <EnergyImpactScreen
          value={onboardingResponses.energy_impact}
          onNext={(val) => { updateResponse('energy_impact', val); next(); }}
        />
      );
      case "sleep-impact": return (
        <SleepImpactScreen
          value={onboardingResponses.sleep_impact}
          onNext={(val) => { updateResponse('sleep_impact', val); next(); }}
        />
      );
      case "mental-health": return (
        <MentalHealthScreen
          value={onboardingResponses.mental_health}
          onNext={(val) => { updateResponse('mental_health', val); next(); }}
        />
      );
      case "sleep-improvement": return (
        <SleepImprovementScreen
          value={onboardingResponses.sleep_improvement}
          onNext={(val) => { updateResponse('sleep_improvement', val); next(); }}
        />
      );
      case "sleep-hours": return (
        <SleepHoursScreen
          value={onboardingResponses.sleep_hours}
          onNext={(val) => { updateResponse('sleep_hours', val); next(); }}
        />
      );
      case "calculating": return <CalculatingScreen onComplete={() => goTo("dashboard")} />;
      case "dashboard": return (
        <Dashboard
          userData={userData}
          initialPeriodDates={onboardingPeriodDates}
          onLogout={handleLogout}
          setBackHandler={(handler) => { dashboardBackRef.current = handler; }}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="h-screen h-[100dvh] dc-gradient-main flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div className="dc-phone-frame h-full rounded-none sm:rounded-[2.5rem] bg-[#F6D7E0] overflow-hidden shadow-none sm:shadow-2xl relative">
        {/* Progress bar */}
        {showProgress && currentScreen !== "calculating" && (
          <div className="absolute top-0 left-0 right-0 z-50 px-4 pt-3">
            <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-dc-pink-deep rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 h-full flex flex-col overflow-hidden"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFlow;
