import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, Trash2, ChevronDown, Hash, History } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { format } from "date-fns";

const MOODS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "neutral", label: "Neutral", emoji: "😐" },
  { id: "sad", label: "Sad", emoji: "😔" },
  { id: "irritable", label: "Irritable", emoji: "😫" },
  { id: "anxious", label: "Anxious", emoji: "😰" },
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "energetic", label: "Energetic", emoji: "🤩" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "frustrated", label: "Frustrated", emoji: "😤" },
  { id: "relaxed", label: "Relaxed", emoji: "🧖‍♀️" },
  { id: "productive", label: "Productive", emoji: "✍️" },
];

const SYMPTOMS = [
  { id: "headache", label: "Headache", emoji: "💆" },
  { id: "fatigue", label: "Fatigue", emoji: "😴" },
  { id: "cramps", label: "Cramps", emoji: "🤕" },
  { id: "bloating", label: "Bloating", emoji: "🎈" },
  { id: "nausea", label: "Nausea", emoji: "🤢" },
  { id: "back-pain", label: "Back Pain", emoji: "🧘" },
  { id: "acne", label: "Acne", emoji: "✨" },
  { id: "cravings", label: "Cravings", emoji: "🍫" },
  { id: "insomnia", label: "Insomnia", emoji: "🦉" },
  { id: "mood-swings", label: "Mood Swings", emoji: "🎭" },
  { id: "tender-breasts", label: "Tender Breasts", emoji: "🍈" },
  { id: "dizziness", label: "Dizziness", emoji: "😵‍💫" },
  { id: "ovulation-pain", label: "Ovulation Pain", emoji: "⚡" },
  { id: "backache", label: "Backache", emoji: "🦴" },
];

interface DailyWellnessLogProps {
  date: Date;
  initialData?: {
    mood?: string;
    periodStatus?: string;
    symptoms?: string[];
    notes?: string;
    hashtags?: string;
  };
  onSave?: (data: { mood: string, periodStatus: string, symptoms: string[], notes: string, hashtags: string }) => void;
  onUpdate?: (data: { mood: string, periodStatus: string, symptoms: string[], notes: string, hashtags: string }) => void;
  onDelete?: () => void;
  onOpenHistory?: () => void;
}

export const DailyWellnessLog = ({
  date,
  initialData,
  onSave,
  onUpdate,
  onDelete,
  onOpenHistory,
}: DailyWellnessLogProps) => {
  const [mood, setMood] = useState(initialData?.mood || "");
  const [periodStatus, setPeriodStatus] = useState(initialData?.periodStatus || "no-period");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialData?.symptoms || []);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [hashtags, setHashtags] = useState(initialData?.hashtags || "");

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave?.({ mood, periodStatus, symptoms: selectedSymptoms, notes, hashtags });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dc-glass-strong rounded-[2.5rem] p-6 border border-white/40 shadow-sm relative overflow-hidden mb-6"
    >
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">Daily Wellness Log</h2>
            <p className="text-[11px] font-semibold text-muted-foreground opacity-70">
              {format(date, "EEEE, MMMM d")}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-[11px] font-black uppercase tracking-widest text-[#FF6B9E] hover:bg-[#FF6B9E]/10 rounded-xl"
            onClick={onOpenHistory}
          >
            <History size={14} className="mr-2" />
            History
          </Button>
        </div>

        {/* Mood Tracker */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/80">How's your mood?</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {MOODS.map((m) => (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-3xl transition-all border-2 ${
                  mood === m.id
                    ? "bg-white border-dc-pink-deep shadow-lg shadow-dc-pink/20 scale-105"
                    : "bg-white/40 border-transparent hover:bg-white/60"
                }`}
              >
                <span className="text-xl mb-1">{m.emoji}</span>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${mood === m.id ? "text-dc-pink-deep" : "text-muted-foreground"}`}>
                  {m.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Period Status */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/80">Period Status</h3>
          <Select value={periodStatus} onValueChange={setPeriodStatus}>
            <SelectTrigger className="w-full bg-white/50 border-white/40 rounded-2xl h-10 text-[11px] font-bold text-foreground focus:ring-dc-pink/20">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/40 bg-white/90 backdrop-blur-xl">
              <SelectItem value="no-period" className="text-[11px] font-bold">No Period</SelectItem>
              <SelectItem value="light" className="text-[11px] font-bold">Light Flow</SelectItem>
              <SelectItem value="medium" className="text-[11px] font-bold">Medium Flow</SelectItem>
              <SelectItem value="heavy" className="text-[11px] font-bold">Heavy Flow</SelectItem>
              <SelectItem value="spotting" className="text-[11px] font-bold">Spotting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Symptoms */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/80">Symptoms</h3>
          <div className="flex flex-wrap gap-1.5">
            {SYMPTOMS.map((s) => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSymptom(s.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all border-2 flex items-center gap-1.5 ${
                  selectedSymptoms.includes(s.id)
                    ? "bg-dc-pink-deep text-white border-dc-pink-deep shadow-md"
                    : "bg-white/40 border-transparent text-muted-foreground hover:bg-white/60"
                }`}
              >
                <span className="text-sm">{s.emoji}</span>
                {s.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Thoughts */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/80">Thoughts</h3>
          <Textarea
            placeholder="How are you feeling today? Write freely..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] bg-white/50 border-white/40 rounded-3xl p-4 text-[13px] font-medium focus:ring-dc-pink/20 resize-none shadow-inner"
          />
        </div>

        {/* Hashtags */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60">
            <Hash size={18} />
          </div>
          <Input
            placeholder="selfcare, wellness, cycle..."
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="pl-10 bg-white/50 border-white/40 rounded-2xl h-12 font-bold text-foreground focus:ring-dc-pink/20"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          <Button
            onClick={handleSave}
            className="bg-dc-pink-deep hover:bg-dc-pink-deep/90 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-dc-pink/20 flex items-center justify-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Save size={18} />
            </div>
            Save Log
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onUpdate?.({ mood, periodStatus, symptoms: selectedSymptoms, notes, hashtags })}
              className="bg-white/40 border-white/60 hover:bg-white/60 text-dc-pink-deep rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
            >
              <RefreshCw size={14} className="mr-2" />
              Update
            </Button>
            <Button
              variant="ghost"
              onClick={onDelete}
              className="text-red-400 hover:text-red-500 hover:bg-red-50/50 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-dc-pink/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-dc-lavender/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};
