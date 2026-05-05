import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import childhoodImg from "@/assets/lifestages/childhood.jpg";
import teenageImg from "@/assets/lifestages/teenage.jpg";
import adultImg from "@/assets/lifestages/adult.jpg";
import menopauseImg from "@/assets/lifestages/menopause.jpg";

interface StageItem {
  emoji: string;
  text: string;
}

interface LifeStage {
  title: string;
  ageRange: string;
  image: string;
  color: string;
  border: string;
  headerEmoji: string;
  description: string;
  items: StageItem[];
}

const stages: LifeStage[] = [
  {
    title: "Childhood",
    ageRange: "8–12 years",
    image: childhoodImg,
    color: "bg-dc-lavender",
    border: "border-dc-lavender-medium",
    headerEmoji: "🌱",
    description: "Pre-Menarche — Education & preparation for your first period",
    items: [
      { emoji: "📚", text: "Puberty education — understanding body changes like breast development & growth spurts" },
      { emoji: "🦋", text: "Emotional readiness — mood swings and new feelings are completely normal" },
      { emoji: "🩸", text: "First period prep — know what to expect: light bleeding, cramps, and how to use pads" },
      { emoji: "🧼", text: "Hygiene basics — daily bathing, clean underwear, and proper intimate care" },
      { emoji: "🥦", text: "Nutrition matters — calcium, iron-rich foods support growing bodies" },
      { emoji: "💬", text: "Open conversations — talk with a trusted adult about body changes" },
      { emoji: "👗", text: "Body awareness — every body develops at its own pace, no comparison needed" },
      { emoji: "❓", text: "FAQ ready — 'Is it normal?' Yes! First periods can be irregular for 1–2 years" },
    ],
  },
  {
    title: "Teenage",
    ageRange: "13–19 years",
    image: teenageImg,
    color: "bg-dc-peach",
    border: "border-dc-pink-medium",
    headerEmoji: "🌸",
    description: "Menarche Stage — Cycle tracking begins, periods may be irregular",
    items: [
      { emoji: "📅", text: "Start tracking your cycle — even irregular periods have patterns over time" },
      { emoji: "🔮", text: "Period prediction — apps use your data to estimate upcoming periods" },
      { emoji: "😊", text: "Mood tracking — hormones affect emotions, tracking helps you understand why" },
      { emoji: "🤕", text: "Cramps & symptoms — learn what's normal and when to see a doctor" },
      { emoji: "🍎", text: "Skin & acne — hormonal acne peaks in teens, proper skincare helps" },
      { emoji: "🥚", text: "Ovulation awareness — understand your fertile window basics" },
      { emoji: "🏫", text: "School-friendly tips — carry emergency supplies, wear dark bottoms on heavy days" },
      { emoji: "💪", text: "Exercise helps — light workouts reduce cramps and boost mood during periods" },
    ],
  },
  {
    title: "Adult",
    ageRange: "20–45 years",
    image: adultImg,
    color: "bg-dc-teal-light",
    border: "border-dc-teal",
    headerEmoji: "💐",
    description: "Reproductive Stage — Advanced tracking, fertility & lifestyle insights",
    items: [
      { emoji: "📊", text: "Accurate cycle prediction — consistent tracking gives precise 1–2 day accuracy" },
      { emoji: "🥚", text: "Ovulation tracking — basal body temperature & cervical mucus signs" },
      { emoji: "🌡️", text: "Fertility window — 6-day window each cycle when conception is possible" },
      { emoji: "🤰", text: "Pregnancy planning — track optimal days for conception or prevention" },
      { emoji: "💊", text: "Contraception management — pill reminders, IUD check dates, method tracking" },
      { emoji: "😤", text: "PMS insights — predict and manage premenstrual symptoms proactively" },
      { emoji: "😴", text: "Lifestyle tracking — sleep, stress, and exercise affect your cycle directly" },
      { emoji: "❤️", text: "Sexual health — track intimacy, libido changes, and partner communication" },
    ],
  },
  {
    title: "Menopause",
    ageRange: "45+ years",
    image: menopauseImg,
    color: "bg-dc-pink",
    border: "border-dc-coral",
    headerEmoji: "🌺",
    description: "Perimenopause → Postmenopause — Hormonal transition & wellness",
    items: [
      { emoji: "🔄", text: "Irregular cycles — periods become unpredictable, gaps of 2–6 months are normal" },
      { emoji: "🔥", text: "Hot flashes — sudden warmth in face/chest, track triggers to manage them" },
      { emoji: "😴", text: "Sleep changes — night sweats and insomnia are common, maintain sleep hygiene" },
      { emoji: "🧠", text: "Mood & memory — brain fog and mood swings due to declining estrogen" },
      { emoji: "🦴", text: "Bone health — calcium + vitamin D + weight-bearing exercise prevent osteoporosis" },
      { emoji: "💊", text: "HRT options — Hormone Replacement Therapy can ease severe symptoms" },
      { emoji: "🧘", text: "Wellness practices — yoga, meditation & balanced diet support this transition" },
      { emoji: "🩺", text: "Regular checkups — mammograms, bone density tests, and heart health monitoring" },
    ],
  },
];

const LifeStagesSection = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = searchQuery
    ? stages.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.items.some(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : stages;

  return (
    <div className="px-4 space-y-3 pb-4">
      {filtered.length === 0 && searchQuery && (
        <p className="text-xs text-muted-foreground text-center py-4">No life stages match "{searchQuery}"</p>
      )}
      {filtered.map((stage, i) => {
        const origIndex = stages.indexOf(stage);
        const isExpanded = expandedIndex === origIndex;
        return (
          <motion.div
            key={stage.title}
            className={`${stage.color} rounded-2xl border ${stage.border} overflow-hidden`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : origIndex)}
              className="w-full text-left"
            >
              <div className="relative h-36 overflow-hidden rounded-t-2xl">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={512}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{stage.headerEmoji}</span>
                      <div>
                        <h4 className="font-bold text-white text-base drop-shadow-md">
                          {stage.title}
                        </h4>
                        <p className="text-[10px] text-white/80 drop-shadow-md">
                          {stage.ageRange}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-white drop-shadow-md" />
                    </motion.div>
                  </div>
                  <p className="text-[10px] text-white/70 mt-1 drop-shadow-md leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-2.5">
                    {stage.items.map((item, j) => (
                      <motion.div
                        key={j}
                        className="flex items-start gap-2.5 bg-background/40 rounded-xl p-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.04 }}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{item.emoji}</span>
                        <p className="text-xs text-foreground/80 leading-relaxed">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LifeStagesSection;
