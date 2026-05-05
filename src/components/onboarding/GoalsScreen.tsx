import { useState } from "react";

const goals = [
  { label: "Get pregnant", emoji: "🤰" },
  { label: "Track my pregnancy", emoji: "👶" },
  { label: "Track my period", emoji: "📅" },
  { label: "Take charge of well-being", emoji: "⚡" },
  { label: "Manage my weight", emoji: "⚖️" },
  { label: "Enhance my sex life", emoji: "💕" },
  { label: "Decode my discharge", emoji: "🩲" },
  { label: "Explore contraception", emoji: "💊" },
];

const GoalsScreen = ({ value, onNext }: { value: string[]; onNext: (val: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>(value || []);
  const toggle = (label: string) =>
    setSelected(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);

  return (
    <div className="flex-1 flex flex-col px-6 pt-14 pb-8 overflow-y-auto">
      <h2 className="dc-heading text-xl font-semibold text-center mb-1">What are your goals?</h2>
      <p className="text-muted-foreground text-sm text-center mb-8">Choose as many as you'd like</p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {goals.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => toggle(label)}
            className={`dc-glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center transition-all ${
              selected.includes(label) ? "!bg-dc-pink-deep/20 border-dc-pink-deep/40 scale-[1.02]" : ""
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-medium leading-tight">{label}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={() => onNext(selected)} 
        disabled={!selected.length} 
        className="w-full dc-btn-primary text-sm mt-6 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default GoalsScreen;
