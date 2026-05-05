import { useState } from "react";

const feelings = [
  { emoji: "😕", label: "It's a love-hate relationship", detail: "That's totally normal! We'll help you understand your cycle better and find the silver linings." },
  { emoji: "😳", label: "Embarrassed", detail: "There's nothing to be embarrassed about. Your body is amazing, and we're here to help you feel proud of it." },
  { emoji: "😠", label: "Hate it", detail: "We get it — periods can be tough. Let us show you how understanding your cycle can actually empower you." },
  { emoji: "🤔", label: "I want to understand it better", detail: "Curiosity is the first step! We'll make learning about your body fun and easy." },
  { emoji: "😊", label: "We've become friends", detail: "That's wonderful! You're already ahead. Let's deepen that connection and optimize your wellness." },
];

const PeriodFeelingsScreen = ({ value, onNext }: { value: string; onNext: (val: string) => void }) => {
  const initialIdx = feelings.findIndex(f => f.label === value);
  const [selected, setSelected] = useState<number | null>(initialIdx !== -1 ? initialIdx : null);

  return (
    <div className="flex-1 flex flex-col px-6 pt-14 pb-8 overflow-y-auto w-full">
      <h2 className="dc-heading text-xl font-semibold text-center mb-8">How do you feel about your period?</h2>

      <div className="space-y-3 flex-1">
        {feelings.map((f, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full dc-glass rounded-xl px-4 py-3.5 text-left transition-all ${
              selected === i ? "!bg-dc-pink-deep/20 border-dc-pink-deep/40" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{f.emoji}</span>
              <span className="text-sm font-medium">{f.label}</span>
            </div>
            {selected === i && (
              <p className="text-xs text-muted-foreground mt-3 pl-9 leading-relaxed">{f.detail}</p>
            )}
          </button>
        ))}
      </div>

      <button 
        onClick={() => selected !== null && onNext(feelings[selected].label)} 
        disabled={selected === null} 
        className="w-full dc-btn-primary text-sm mt-6 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default PeriodFeelingsScreen;
