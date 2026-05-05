import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, Trash2, Calendar, Smile, Meh, Frown, Zap, Moon, Cloud, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { format, formatDistanceToNow, parseISO } from "date-fns";

interface WellnessHistoryProps {
  onBack: () => void;
  logs: Record<string, { symptoms: string[], mood: string, notes: string, hashtags?: string, periodStatus?: string }>;
  onDeleteLog: (dateKey: string) => void;
}

const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "Happy" },
  neutral: { emoji: "😐", label: "Neutral" },
  sad: { emoji: "😔", label: "Sad" },
  irritable: { emoji: "😫", label: "Irritable" },
  anxious: { emoji: "😰", label: "Anxious" },
  calm: { emoji: "😌", label: "Calm" },
  energetic: { emoji: "🤩", label: "Energetic" },
  tired: { emoji: "😴", label: "Tired" },
  frustrated: { emoji: "😤", label: "Frustrated" },
  relaxed: { emoji: "🧖‍♀️", label: "Relaxed" },
  productive: { emoji: "✍️", label: "Productive" },
};

const SYMPTOM_MAP: Record<string, { emoji: string; label: string }> = {
  headache: { emoji: "💆", label: "Headache" },
  fatigue: { emoji: "😴", label: "Fatigue" },
  cramps: { emoji: "🤕", label: "Cramps" },
  bloating: { emoji: "🎈", label: "Bloating" },
  nausea: { emoji: "🤢", label: "Nausea" },
  "back-pain": { emoji: "🧘", label: "Back Pain" },
  acne: { emoji: "✨", label: "Acne" },
  cravings: { emoji: "🍫", label: "Cravings" },
  insomnia: { emoji: "🦉", label: "Insomnia" },
  "mood-swings": { emoji: "🎭", label: "Mood Swings" },
  "tender-breasts": { emoji: "🍈", label: "Tender Breasts" },
  dizziness: { emoji: "😵‍💫", label: "Dizziness" },
  "ovulation-pain": { emoji: "⚡", label: "Ovulation Pain" },
  backache: { emoji: "🦴", label: "Backache" },
};

export const WellnessHistory = ({ onBack, logs, onDeleteLog }: WellnessHistoryProps) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const sortedKeys = Object.keys(logs).sort((a, b) => b.localeCompare(a));
  const entryCount = sortedKeys.length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col bg-background min-h-screen"
    >
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-white/40 text-foreground hover:bg-white/80 transition-all active:scale-90 shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tight text-foreground">Wellness History</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {entryCount} past {entryCount === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <div className="w-10" />
      </header>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-hide max-w-lg mx-auto w-full pb-24">
        {sortedKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <Calendar size={48} className="mb-4" />
            <p className="font-bold">No history yet</p>
            <p className="text-sm">Start logging your daily wellness!</p>
          </div>
        ) : (
          sortedKeys.map((key) => {
            const log = logs[key];
            const date = parseISO(key);
            const isExpanded = expandedKeys.includes(key);
            const mood = MOOD_MAP[log.mood] || { emoji: "✨", label: log.mood || "Logged" };
            
            return (
              <motion.div 
                key={key} 
                layout 
                className={`rounded-[2rem] border transition-all ${
                  isExpanded 
                    ? "dc-glass-strong border-white/50 shadow-lg p-6" 
                    : "bg-white/40 border-white/20 p-4"
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(key)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isExpanded ? 'bg-white shadow-sm' : 'bg-white/30'}`}>
                      {mood.emoji}
                    </div>
                    <div>
                      <h3 className="font-black text-foreground flex items-center gap-2">
                        {mood.label}
                        <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-tighter">
                          · {log.symptoms.length} {log.symptoms.length === 1 ? 'symptom' : 'symptoms'}
                        </span>
                      </h3>
                      <p className="text-[11px] font-bold text-muted-foreground">
                        {format(date, "EEE, MMM d")} · {formatDistanceToNow(date, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-muted-foreground/40">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 space-y-5"
                    >
                      {/* Period Status */}
                      {log.periodStatus && log.periodStatus !== 'no-period' && (
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Period:</span>
                          <span className="bg-dc-pink/20 text-dc-pink-deep px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border border-dc-pink/30">
                            {log.periodStatus}
                          </span>
                        </div>
                      )}

                      {/* Symptoms Chips */}
                      {log.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {log.symptoms.map(sId => {
                            const symptom = SYMPTOM_MAP[sId] || { emoji: "✨", label: sId };
                            return (
                              <span key={sId} className="bg-white/50 text-foreground px-4 py-2 rounded-2xl text-[11px] font-bold border border-white/60 shadow-sm flex items-center gap-2">
                                <span>{symptom.emoji}</span>
                                {symptom.label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Notes */}
                      {log.notes && (
                        <div className="bg-white/30 rounded-2xl p-4 border border-white/40 shadow-inner">
                          <p className="text-sm font-medium text-foreground leading-relaxed italic opacity-80">
                            "{log.notes}"
                          </p>
                        </div>
                      )}

                      {/* Hashtags */}
                      {log.hashtags && (
                        <p className="text-[11px] font-black text-dc-pink-deep opacity-60 italic tracking-tight">
                          {log.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ')}
                        </p>
                      )}

                      {/* Delete Action */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLog(key);
                        }}
                        className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors pt-2 group"
                      >
                        <Trash2 size={16} className="group-hover:animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Remove entry</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
