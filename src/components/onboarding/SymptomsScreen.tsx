import { useState } from "react";

const symptoms = [
  { label: "Cramps", emoji: "😣" },
  { label: "Fatigue", emoji: "😴" },
  { label: "Bloating", emoji: "🫧" },
  { label: "Tender breasts", emoji: "💗" },
  { label: "Backache", emoji: "🔙" },
  { label: "None of these", emoji: "✅" },
];

const SymptomsScreen = ({ value, onNext }: { value: string[]; onNext: (val: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>(value || []);
  const toggle = (l: string) => setSelected(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);

  return (
    <div className="flex-1 flex flex-col px-6 pt-14 pb-8 overflow-y-auto w-full">
      <h2 className="dc-heading text-xl font-semibold text-center mb-1">How do you feel today?</h2>
      <p className="text-muted-foreground text-sm text-center mb-8">Select your symptoms</p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {symptoms.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => toggle(label)}
            className={`dc-glass rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-all ${
              selected.includes(label) ? "!bg-dc-pink-deep/20 border-dc-pink-deep/40 scale-[1.02]" : ""
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      <button onClick={() => onNext(selected)} className="w-full dc-btn-primary text-sm mt-6">Next</button>
    </div>
  );
};

export default SymptomsScreen;
