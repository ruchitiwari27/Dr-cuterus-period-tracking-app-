import { motion } from "framer-motion";

const DOS = [
  { icon: "🚿", text: "Cleaning with warm water" },
  { icon: "🧴", text: "pH-balanced hygiene products" },
  { icon: "👙", text: "Breathable underwear" },
];

const DONTS = [
  { icon: "🚫", text: "Douching" },
  { icon: "🧼", text: "Scented soap" },
  { icon: "❌", text: "Vaginal deodorants" },
];

const DischargeDecoderSection = () => {
  return (
    <div className="mt-6">
      <motion.div
        className="mx-5 dc-glass-strong rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-bold text-sm mb-3">Hygiene Tips</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold mb-3">Do's</span>
            <div className="space-y-2.5">
              {DOS.map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <span className="text-sm">{icon}</span>
                  <p className="text-[11px] font-medium leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold mb-3">Don'ts</span>
            <div className="space-y-2.5">
              {DONTS.map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <span className="text-sm">{icon}</span>
                  <p className="text-[11px] font-medium leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DischargeDecoderSection;
