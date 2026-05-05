import { useState } from "react";

const helpOptions = [
  { label: "Sync my sex life with my cycle", emoji: "❤️" },
  { label: "Make masturbation work for me", emoji: "🌺" },
  { label: "Spot signs of PCOS or Endo", emoji: "🔍" },
  { label: "Decode my discharge", emoji: "💧" },
  { label: "Manage symptoms & moods", emoji: "💊" },
  { label: "Learn how to orgasm", emoji: "✨" },
];

const HelpScreen = ({ onNext }: { onNext: () => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (l: string) => setSelected(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);

  return (
    <div className="flex-1 flex flex-col px-6 pt-14 pb-8 overflow-y-auto">
      <h2 className="dc-heading text-xl font-semibold text-center mb-1">What can we help you do?</h2>
      <p className="text-muted-foreground text-sm text-center mb-8">Choose as many as you like</p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {helpOptions.map(({ label, emoji }) => (
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

      <button onClick={onNext} disabled={!selected.length} className="w-full dc-btn-primary text-sm mt-6 disabled:opacity-40">
        Next
      </button>
    </div>
  );
};

export default HelpScreen;
