import { useState } from "react";
import { Check } from "lucide-react";

const conditions = [
  "Yeast infections", "Urinary tract infections (UTIs)", "Bacterial Vaginosis (BV)",
  "Polycystic ovary syndrome (PCOS)", "Endometriosis", "Fibroids",
  "I'm not sure", "No, none of the above",
];

const HealthConditionsScreen = ({ value, onNext }: { value: string[]; onNext: (val: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>(value || []);
  const toggle = (c: string) => setSelected(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  return (
    <div className="flex-1 flex flex-col px-6 pt-14 pb-8 overflow-y-auto w-full">
      <h2 className="dc-heading text-xl font-semibold text-center mb-2">Health conditions</h2>
      <p className="text-muted-foreground text-sm text-center mb-6">Select any that apply to you</p>

      <div className="space-y-2.5 flex-1">
        {conditions.map(c => (
          <button
            key={c}
            onClick={() => toggle(c)}
            className={`w-full dc-glass rounded-xl px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-all ${
              selected.includes(c) ? "!bg-dc-pink-deep/20 border-dc-pink-deep/40" : ""
            }`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              selected.includes(c) ? "bg-dc-pink-deep border-dc-pink-deep" : "border-dc-pink-medium"
            }`}>
              {selected.includes(c) && <Check size={12} className="text-primary-foreground" />}
            </div>
            {c}
          </button>
        ))}
      </div>

      <button onClick={() => onNext(selected)} className="w-full dc-btn-primary text-sm mt-6">Next</button>
    </div>
  );
};

export default HealthConditionsScreen;
