import { useState } from "react";
import { Check } from "lucide-react";

const RegularPeriodsScreen = ({ value, onNext }: { value: string; onNext: (val: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(value || null);
  const options = ["Yes", "No", "I don't know"];

  return (
    <div className="flex-1 flex flex-col px-8 pt-14 pb-8 overflow-y-auto w-full">
      <h2 className="dc-heading text-xl font-semibold text-center mb-2">Are your periods regular?</h2>
      <p className="text-muted-foreground text-sm text-center mb-10">A regular period comes every 21–35 days</p>

      <div className="space-y-3 flex-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`w-full dc-glass rounded-xl px-5 py-4 text-left text-sm font-medium flex items-center justify-between transition-all ${
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

export default RegularPeriodsScreen;
