const ForYourselfScreen = ({ value, onNext }: { value: boolean; onNext: (val: boolean) => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">
    <h2 className="dc-heading text-xl font-semibold text-center mb-2">Are you using Dr. Cuterus for yourself?</h2>
    <p className="text-muted-foreground text-sm text-center mb-10">This helps us personalize your experience</p>

    <div className="w-full space-y-4">
      <button onClick={() => onNext(true)} className={`w-full dc-btn-primary text-sm py-4 ${!value ? "opacity-70" : ""}`}>Yes</button>
      <button 
        onClick={() => onNext(false)} 
        className={`w-full dc-glass-strong rounded-2xl py-4 text-sm font-semibold text-foreground hover:bg-white/40 transition-all ${value ? "opacity-70" : "border-dc-pink-deep"}`}
      >
        No, I have a partner code
      </button>
    </div>
  </div>
);

export default ForYourselfScreen;
