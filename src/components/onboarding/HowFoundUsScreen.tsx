import { useState } from "react";
import { Check } from "lucide-react";

const options = [
  "Google Play or Google search",
  "Friends or Family",
  "Instagram or Facebook",
  "TikTok",
  "YouTube or TV",
  "Influencer or Celebrity",
  "Medical professional",
  "Other",
];

const HowFoundUsScreen = ({ value, onNext }: { value: string; onNext: (val: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(value || null);

  return (
    <div className="flex-1 flex flex-col px-8 pt-14 pb-8 overflow-y-auto">
      <h2 className="dc-heading text-xl font-semibold text-center mb-8">How did you find out about us?</h2>

      <div className="space-y-3 flex-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`w-full dc-glass rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all flex items-center justify-between ${
              selected === opt ? "!bg-dc-pink-deep/20 border-dc-pink-deep/40" : ""
            }`}
          >
            {opt}
            {selected === opt && <Check size={16} className="text-dc-pink-deep" />}
          </button>
        ))}
      </div>

      <button 
        onClick={() => selected && onNext(selected)} 
        disabled={!selected} 
        className="w-full dc-btn-primary text-sm mt-6 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default HowFoundUsScreen;
