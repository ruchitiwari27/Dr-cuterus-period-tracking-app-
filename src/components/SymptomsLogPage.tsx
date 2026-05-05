import * as React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Check, ArrowLeft, Smile, Meh, Frown, Zap, Moon, Cloud, Sun } from "lucide-react";
import { motion } from "framer-motion";

const MOODS = [
  { id: "happy", label: "Happy", icon: Smile, color: "text-yellow-500", bg: "bg-yellow-50" },
  { id: "calm", label: "Calm", icon: Sun, color: "text-blue-400", bg: "bg-blue-50" },
  { id: "energetic", label: "Energetic", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "irritable", label: "Irritable", icon: Cloud, color: "text-gray-500", bg: "bg-gray-50" },
  { id: "sad", label: "Sad", icon: Frown, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "tired", label: "Tired", icon: Moon, color: "text-purple-500", bg: "bg-purple-50" },
];

const SYMPTOMS = [
  "Cramps", "Bloating", "Acne", "Headache", "Fatigue", 
  "Nausea", "Cravings", "Backache", "Tender Breasts", "Insomnia"
];

interface SymptomsLogPageProps {
  onBack: () => void;
  onSave: (data: { symptoms: string[], mood: string, notes: string, hashtags?: string, periodStatus?: string }) => void;
  initialData?: { symptoms: string[], mood: string, notes: string, hashtags?: string, periodStatus?: string };
  dateFormatted: string;
}

export function SymptomsLogPage({ onBack, onSave, initialData, dateFormatted }: SymptomsLogPageProps) {
  const [selectedMood, setSelectedMood] = React.useState(initialData?.mood || "");
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>(initialData?.symptoms || []);
  const [notes, setNotes] = React.useState(initialData?.notes || "");

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    onSave({ symptoms: selectedSymptoms, mood: selectedMood, notes });
  };

  return (
    <motion.div 
      className="flex-1 flex flex-col bg-white"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      {/* Proper Heading / Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black tracking-tight text-gray-900">Daily Wellbeing</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{dateFormatted}</p>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scrollbar-hide max-w-lg mx-auto w-full">
        <section className="text-center mb-8">
           <h2 className="text-2xl font-black dc-text-gradient mb-2">How's your vibe?</h2>
           <p className="text-xs font-semibold text-muted-foreground/70">Logging daily helps identify cycle patterns.</p>
        </section>

        {/* Mood Selection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-dc-pink-deep bg-dc-pink/10 px-3 py-1 rounded-full">
              Current Mood
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground/60">Select one</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {MOODS.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-[2rem] border-2 transition-all duration-300 active:scale-95 ${
                    isSelected 
                      ? "border-dc-pink bg-white shadow-xl shadow-dc-pink/10 scale-105" 
                      : "border-transparent bg-gray-50/50 hover:bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-full ${isSelected ? "bg-dc-pink/20" : "bg-transparent"}`}>
                    <Icon className={`w-7 h-7 ${isSelected ? "text-dc-pink-deep" : mood.color}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isSelected ? "text-dc-pink-deep" : "text-muted-foreground/70"}`}>
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Symptoms Selection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-dc-pink-deep bg-dc-pink/10 px-3 py-1 rounded-full">
              Body Symptoms
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground/60">Select multiple</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-5 py-2.5 rounded-2xl text-[11px] font-black border-2 transition-all duration-300 active:scale-95 ${
                    isSelected 
                      ? "bg-dc-pink-deep text-white border-dc-pink-deep shadow-lg shadow-dc-pink/20" 
                      : "bg-gray-50/50 border-transparent text-muted-foreground/70 hover:border-dc-pink/30 hover:bg-white"
                  }`}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-4 pb-12">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-dc-pink-deep bg-dc-pink/10 px-3 py-1 rounded-full">
              Personal Notes
            </h3>
          </div>
          <Textarea
            placeholder="Add some details about your day..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none h-32 rounded-[1.5rem] bg-gray-50/50 border-none focus:bg-white focus:ring-2 focus:ring-dc-pink/20 transition-all text-sm p-4"
          />
        </section>
      </div>

      <footer className="px-6 pt-5 pb-10 bg-white/80 backdrop-blur-md border-t border-gray-100 max-w-lg mx-auto w-full sticky bottom-0 z-20">
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#FF6B9E] to-[#FF8FA3] hover:from-[#FF5D92] hover:to-[#FF7E94] text-white font-black rounded-2xl py-6 text-sm shadow-[0_15px_40px_rgba(255,107,158,0.25)] hover:shadow-[0_20px_50px_rgba(255,107,158,0.35)] transition-all duration-500 active:scale-[0.97] group border-none"
        >
          <motion.div 
            className="flex items-center justify-center gap-2.5"
            whileHover={{ gap: "12px" }}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <span className="uppercase tracking-[0.15em]">Save Daily Log</span>
          </motion.div>
        </Button>
        <button 
          onClick={onBack}
          className="w-full text-[10px] font-black text-muted-foreground/40 hover:text-dc-pink-deep uppercase tracking-[0.2em] mt-4 transition-all duration-300"
        >
          Cancel & Back
        </button>
      </footer>
    </motion.div>
  );
}
