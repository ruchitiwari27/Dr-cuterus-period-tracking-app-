import * as React from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter,
  DrawerClose
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Check, X, Smile, Meh, Frown, Brain, Heart, Zap, Coffee, Moon, Cloud, Sun } from "lucide-react";
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

interface SymptomsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { symptoms: string[], mood: string, notes: string }) => void;
  initialData?: { symptoms: string[], mood: string, notes: string };
}

export function SymptomsDrawer({ open, onOpenChange, onSave, initialData }: SymptomsDrawerProps) {
  const [selectedMood, setSelectedMood] = React.useState(initialData?.mood || "");
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>(initialData?.symptoms || []);
  const [notes, setNotes] = React.useState(initialData?.notes || "");

  React.useEffect(() => {
    if (open && initialData) {
      setSelectedMood(initialData.mood);
      setSelectedSymptoms(initialData.symptoms);
      setNotes(initialData.notes);
    }
  }, [open, initialData]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    onSave({ symptoms: selectedSymptoms, mood: selectedMood, notes });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[96vh] max-w-lg mx-auto rounded-t-[3rem] border-none shadow-2xl">
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300/50" />
        
        <DrawerHeader className="text-center pt-8 pb-4">
          <DrawerTitle className="text-3xl font-black tracking-tight dc-text-gradient">
            Daily Wellbeing
          </DrawerTitle>
          <DrawerDescription className="text-sm font-medium text-muted-foreground/70">
            How's your body and mind today?
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10 scrollbar-hide">
          {/* Mood Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-dc-pink-deep bg-dc-pink/10 px-3 py-1 rounded-full">
                Your Mood
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
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-dc-pink-deep bg-dc-pink/10 px-3 py-1 rounded-full inline-block">
              Daily Notes
            </h3>
            <Textarea
              placeholder="What's on your mind? Any specific pains or logs?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none h-32 rounded-[1.5rem] bg-gray-50/50 border-none focus:bg-white focus:ring-2 focus:ring-dc-pink/20 transition-all text-sm p-5"
            />
          </section>
        </div>

        <DrawerFooter className="px-6 pt-4 pb-10 bg-white border-t border-gray-100">
          <Button 
            onClick={handleSave}
            className="w-full bg-dc-pink-deep hover:bg-dc-pink-deep/90 text-white font-black rounded-3xl py-7 text-lg shadow-2xl shadow-dc-pink/30 transition-all active:scale-95 group"
          >
            <Check className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            SAVE WELLBEING LOG
          </Button>
          <DrawerClose asChild>
            <button className="text-[11px] font-black text-muted-foreground/50 hover:text-muted-foreground uppercase tracking-widest mt-2 transition-colors">
              Discard Changes
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
