import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import snehaAvatar from "@/assets/sneha-avatar.png";

import menstrualImg from "@/assets/phases/menstrual.jpg";
import follicularImg from "@/assets/phases/follicular.jpg";
import ovulationImg from "@/assets/phases/ovulation.jpg";
import lutealImg from "@/assets/phases/luteal.jpg";
import ayurMenstrualImg from "@/assets/phases/ayurveda-menstrual.jpg";
import ayurFollicularImg from "@/assets/phases/ayurveda-follicular.jpg";
import ayurOvulationImg from "@/assets/phases/ayurveda-ovulation.jpg";
import ayurLutealImg from "@/assets/phases/ayurveda-luteal.jpg";
import ritualsImg from "@/assets/tips/rituals.jpg";
import empoweringImg from "@/assets/tips/empowering.jpg";
import bodyfoodImg from "@/assets/tips/bodyfood.jpg";
import ayurvedicImg from "@/assets/tips/ayurvedic.jpg";
import painReliefImg from "@/assets/tips/pain-relief.jpg";
import hygieneEssImg from "@/assets/tips/hygiene-essentials.jpg";
import nutritionPhasesImg from "@/assets/tips/nutrition-phases.jpg";
import skinExMindImg from "@/assets/tips/skin-exercise-mind.jpg";
import irregularImg from "@/assets/tips/irregular-periods.jpg";
import seeDoctorImg from "@/assets/tips/see-doctor.jpg";

interface Tip {
  emoji: string;
  text: string;
}

interface PhaseData {
  name: string;
  days: string;
  tagline: string;
  heroImage: string;
  color: string;
  border: string;
  accent: string;
  basicRituals: Tip[];
  empoweringRituals: Tip[];
  bodyCareTips: Tip[];
  hygieneTips: Tip[];
  foodTips: Tip[];
  ayurvedicImage: string;
  ayurvedicRemedies: Tip[];
}

interface PracticalTip {
  title: string;
  emoji: string;
  tips: Tip[];
}

const phases: PhaseData[] = [
  {
    name: "Menstrual Phase",
    days: "Days 1–5",
    tagline: "Rest, Release & Restore",
    heroImage: menstrualImg,
    color: "bg-dc-pink",
    border: "border-dc-pink-medium",
    accent: "bg-dc-pink-deep/20",
    basicRituals: [
      { emoji: "😴", text: "Prioritize 8-9 hours of sleep — your body is healing" },
      { emoji: "🫖", text: "Drink warm ginger or chamomile tea to ease cramps" },
      { emoji: "🛁", text: "Take warm baths with Epsom salt for muscle relaxation" },
      { emoji: "🧘", text: "Practice gentle yoga — child's pose & supine twists" },
      { emoji: "📖", text: "Journal your feelings — emotional release is powerful" },
      { emoji: "🍲", text: "Eat warm, cooked meals — soups, stews, and porridge" },
      { emoji: "💧", text: "Stay hydrated — warm water with lemon is ideal" },
      { emoji: "🫂", text: "Say no to overcommitments — rest is productive" },
    ],
    empoweringRituals: [
      { emoji: "🕯️", text: "Create a cozy sanctuary — candles, soft music, dim lights" },
      { emoji: "🎨", text: "Express through art — painting, coloring, or crafting" },
      { emoji: "🌙", text: "Moon gazing meditation — connect with your inner cycles" },
      { emoji: "💌", text: "Write a love letter to your body — gratitude practice" },
      { emoji: "📵", text: "Digital detox for at least 2 hours before bed" },
      { emoji: "🧣", text: "Keep your lower belly & feet warm for comfort" },
      { emoji: "🎵", text: "Listen to healing frequency music (432Hz / 528Hz)" },
      { emoji: "🌸", text: "Practice womb breathing — deep belly breaths" },
    ],
    bodyCareTips: [
      { emoji: "🌡️", text: "Use heat therapy (hot water bottle or warm bath) for cramps" },
      { emoji: "😴", text: "Prioritize rest — your body is actively shedding and healing" },
      { emoji: "🧘", text: "Light stretching only — avoid intense exercise" },
      { emoji: "🧣", text: "Keep your lower abdomen and feet warm for comfort" },
      { emoji: "💆", text: "Gentle self-massage on lower back to ease tension" },
    ],
    hygieneTips: [
      { emoji: "🩹", text: "Change pads/tampons/cups regularly — every 4-6 hours" },
      { emoji: "🩲", text: "Opt for breathable cotton underwear" },
      { emoji: "🧴", text: "Use gentle, fragrance-free intimate wash only externally" },
      { emoji: "🚿", text: "Shower daily — warm water helps with cramp relief too" },
      { emoji: "🧼", text: "Wash hands before & after changing menstrual products" },
    ],
    foodTips: [
      { emoji: "🥬", text: "Iron-rich foods: spinach, lentils, beets, lean meat" },
      { emoji: "🍊", text: "Vitamin C (citrus, berries) for better iron absorption" },
      { emoji: "🐟", text: "Omega-3s (flaxseeds, walnuts) to reduce inflammation" },
      { emoji: "🍲", text: "Warm soups & herbal teas — soothing and nourishing" },
      { emoji: "🍫", text: "Dark chocolate — magnesium helps with cramps & mood" },
      { emoji: "💧", text: "Stay hydrated — warm water with lemon or ginger" },
    ],
    ayurvedicImage: ayurMenstrualImg,
    ayurvedicRemedies: [
      { emoji: "🌿", text: "Ajwain water — boil ajwain seeds, sip warm for cramp relief" },
      { emoji: "🍯", text: "Turmeric milk (Haldi Doodh) — anti-inflammatory & soothing" },
      { emoji: "🫚", text: "Ginger-jaggery decoction — eases pain and boosts circulation" },
      { emoji: "🌺", text: "Hibiscus tea — supports healthy menstrual flow" },
      { emoji: "💆", text: "Warm sesame oil massage on lower abdomen" },
      { emoji: "🍃", text: "Ashoka bark tea — traditional uterine tonic" },
      { emoji: "🥛", text: "Shatavari with warm milk — hormonal balance support" },
      { emoji: "🧂", text: "Avoid cold foods & drinks — stick to warm, grounding meals" },
    ],
  },
  {
    name: "Follicular Phase",
    days: "Days 6–13",
    tagline: "Energize, Create & Bloom",
    heroImage: follicularImg,
    color: "bg-dc-teal-light",
    border: "border-dc-teal",
    accent: "bg-dc-teal/20",
    basicRituals: [
      { emoji: "🏃‍♀️", text: "Increase exercise intensity — HIIT, running, dance cardio" },
      { emoji: "🥗", text: "Eat fresh, light foods — salads, sprouts, fermented foods" },
      { emoji: "🧠", text: "Start new projects — your brain is sharpest now" },
      { emoji: "🌅", text: "Wake up early — your energy peaks in the morning" },
      { emoji: "🥑", text: "Eat estrogen-supporting foods — flaxseeds, avocado, berries" },
      { emoji: "💪", text: "Try strength training — your muscles recover faster now" },
      { emoji: "📝", text: "Plan and organize your month — peak mental clarity" },
      { emoji: "🤝", text: "Schedule social activities — you're naturally more outgoing" },
    ],
    empoweringRituals: [
      { emoji: "🎯", text: "Set bold intentions for the month — write 3 power goals" },
      { emoji: "💃", text: "Dance freely — move your body to upbeat music" },
      { emoji: "🌱", text: "Plant seeds (literally or metaphorically) — growth energy" },
      { emoji: "📸", text: "Document your creative ideas — they flow easily now" },
      { emoji: "🗣️", text: "Have important conversations — your communication is strong" },
      { emoji: "👗", text: "Experiment with style — try bold colors and new looks" },
      { emoji: "📚", text: "Learn something new — your brain absorbs information faster" },
      { emoji: "✨", text: "Affirmation: 'I am creative, capable, and full of energy'" },
    ],
    bodyCareTips: [
      { emoji: "✨", text: "Focus on skin glow — gentle exfoliation and moisturizing" },
      { emoji: "🌟", text: "Skin feels clearer now — great time for new skincare routines" },
      { emoji: "💪", text: "Higher energy — perfect for trying new workouts" },
      { emoji: "🏋️‍♀️", text: "Strength training & HIIT — muscles recover faster in this phase" },
    ],
    hygieneTips: [
      { emoji: "🧼", text: "Continue daily gentle cleansing routine" },
      { emoji: "🧴", text: "Exfoliate gently 1-2 times per week for radiant skin" },
      { emoji: "💧", text: "Hydrate skin inside and out — drink water & moisturize" },
    ],
    foodTips: [
      { emoji: "🥬", text: "Light, fresh foods — leafy greens, broccoli, sprouts" },
      { emoji: "🥑", text: "Healthy fats — avocado, nuts, seeds, olive oil" },
      { emoji: "🥚", text: "Balanced proteins — eggs, chicken, legumes" },
      { emoji: "🫐", text: "Berries & colorful fruits for antioxidants" },
      { emoji: "🌾", text: "Fermented foods — yogurt, kimchi, sauerkraut for gut health" },
    ],
    ayurvedicImage: ayurFollicularImg,
    ayurvedicRemedies: [
      { emoji: "🌿", text: "Triphala — gentle detox and digestive support" },
      { emoji: "🍵", text: "Green tea with tulsi — boosts metabolism and clarity" },
      { emoji: "🥒", text: "Cooling foods — cucumber, mint, coconut water" },
      { emoji: "🌻", text: "Sunflower & pumpkin seeds — support rising estrogen" },
      { emoji: "🍋", text: "Warm lemon water on waking — stimulates Agni (digestive fire)" },
      { emoji: "💐", text: "Aromatherapy with jasmine or ylang ylang" },
      { emoji: "🧘", text: "Surya Namaskar (Sun Salutations) — energizing flow" },
      { emoji: "🌾", text: "Include whole grains — quinoa, millet, brown rice" },
    ],
  },
  {
    name: "Ovulation Phase",
    days: "Days 14–16",
    tagline: "Radiate, Connect & Shine",
    heroImage: ovulationImg,
    color: "bg-dc-peach",
    border: "border-dc-pink-medium",
    accent: "bg-dc-coral/20",
    basicRituals: [
      { emoji: "☀️", text: "Get morning sunlight — boosts vitamin D and mood" },
      { emoji: "💃", text: "High-energy workouts — your stamina is at its peak" },
      { emoji: "🥦", text: "Eat cruciferous veggies — broccoli, cauliflower, kale" },
      { emoji: "💧", text: "Drink extra water — cervical fluid production increases" },
      { emoji: "🤸", text: "Try challenging exercises — rock climbing, kickboxing, sprints" },
      { emoji: "🐟", text: "Omega-3 rich foods — salmon, walnuts, chia seeds" },
      { emoji: "🫐", text: "Antioxidant-rich fruits — berries, pomegranate, citrus" },
      { emoji: "😊", text: "Schedule important meetings — you're magnetic right now" },
    ],
    empoweringRituals: [
      { emoji: "👑", text: "Dress to feel powerful — this is your queen energy phase" },
      { emoji: "❤️", text: "Deepen relationships — your empathy and charm are heightened" },
      { emoji: "🎤", text: "Speak up — pitch ideas, negotiate, present with confidence" },
      { emoji: "📷", text: "Capture your glow — take photos, you're radiating" },
      { emoji: "🌹", text: "Practice self-love rituals — skincare, pampering, grooming" },
      { emoji: "🎉", text: "Celebrate small wins — gratitude amplifies this phase" },
      { emoji: "💝", text: "Express love openly — write notes, give compliments" },
      { emoji: "✨", text: "Affirmation: 'I am radiant, confident, and magnetic'" },
    ],
    bodyCareTips: [
      { emoji: "☀️", text: "Enjoy higher energy for social activities & intense workouts" },
      { emoji: "✨", text: "Skin often looks its best — maintain hydration" },
      { emoji: "🏃‍♀️", text: "Peak stamina — try challenging exercises like sprints or HIIT" },
      { emoji: "💧", text: "Drink extra water — your body needs more hydration now" },
    ],
    hygieneTips: [
      { emoji: "🧼", text: "Stay consistent with your daily hygiene routine" },
      { emoji: "💧", text: "Increased cervical mucus is normal — wear a panty liner if needed" },
      { emoji: "🩲", text: "Choose breathable fabrics to stay comfortable" },
    ],
    foodTips: [
      { emoji: "🫐", text: "Antioxidant-rich: berries, leafy greens, pomegranate" },
      { emoji: "🥑", text: "Healthy fats — avocado, salmon, nuts for hormone support" },
      { emoji: "🎃", text: "Zinc-rich foods — pumpkin seeds, chickpeas support fertility" },
      { emoji: "🥦", text: "Cruciferous veggies help metabolize estrogen properly" },
      { emoji: "💧", text: "Extra hydration — add electrolytes if exercising intensely" },
    ],
    ayurvedicImage: ayurOvulationImg,
    ayurvedicRemedies: [
      { emoji: "🌹", text: "Rose water — cooling, balances Pitta energy" },
      { emoji: "🥥", text: "Coconut oil pulling — oral health and detox" },
      { emoji: "🍃", text: "Brahmi tea — supports mental clarity and calm" },
      { emoji: "🧊", text: "Cooling foods — watermelon, coconut, fennel" },
      { emoji: "🌺", text: "Sandalwood paste on wrists — cooling and calming" },
      { emoji: "🥛", text: "Aloe vera juice — supports reproductive health" },
      { emoji: "💆", text: "Shirodhara-inspired self-massage — pour warm oil on forehead" },
      { emoji: "🪷", text: "Practice Chandra Namaskar (Moon Salutations) in evening" },
    ],
  },
  {
    name: "Luteal Phase",
    days: "Days 17–28",
    tagline: "Slow Down, Nourish & Reflect",
    heroImage: lutealImg,
    color: "bg-dc-lavender",
    border: "border-dc-lavender-medium",
    accent: "bg-dc-lavender-deep/20",
    basicRituals: [
      { emoji: "🧘", text: "Switch to gentle exercise — yoga, pilates, walking" },
      { emoji: "🍫", text: "Dark chocolate — magnesium eases PMS and cravings" },
      { emoji: "🫘", text: "Eat complex carbs — sweet potato, oats, lentils" },
      { emoji: "😌", text: "Reduce commitments — honor your need to slow down" },
      { emoji: "🛌", text: "Earlier bedtime — progesterone makes you sleepier" },
      { emoji: "🥜", text: "Magnesium-rich foods — nuts, seeds, leafy greens" },
      { emoji: "🚫", text: "Limit caffeine & alcohol — they worsen PMS symptoms" },
      { emoji: "🧹", text: "Declutter your space — nesting instinct is real" },
    ],
    empoweringRituals: [
      { emoji: "📓", text: "Reflect and review — journal about the month's progress" },
      { emoji: "🕯️", text: "Evening rituals — candlelight, warm drinks, soft blankets" },
      { emoji: "🎶", text: "Create a calming playlist — lo-fi, nature sounds, mantras" },
      { emoji: "🧺", text: "Prepare for your period — stock up on comfort items" },
      { emoji: "💭", text: "Practice letting go — release what no longer serves you" },
      { emoji: "🎨", text: "Color or doodle — low-effort creativity soothes the mind" },
      { emoji: "🤗", text: "Ask for help without guilt — vulnerability is strength" },
      { emoji: "✨", text: "Affirmation: 'I honor my body's rhythm and wisdom'" },
    ],
    bodyCareTips: [
      { emoji: "😴", text: "Prioritize sleep — progesterone makes you naturally sleepier" },
      { emoji: "🧘", text: "Gentle yoga, pilates, or walking — avoid overexertion" },
      { emoji: "🧠", text: "Stress management is crucial — practice deep breathing" },
      { emoji: "💧", text: "Watch for increased discharge — maintain regular cleanliness" },
      { emoji: "🛌", text: "Earlier bedtime helps manage PMS fatigue" },
    ],
    hygieneTips: [
      { emoji: "💧", text: "Watch for increased discharge — maintain cleanliness" },
      { emoji: "🩲", text: "Panty liners can help with pre-period spotting" },
      { emoji: "🧼", text: "Continue gentle, fragrance-free cleansing routine" },
      { emoji: "🧺", text: "Prepare your period kit — stock up on products in advance" },
    ],
    foodTips: [
      { emoji: "🫘", text: "Complex carbs — sweet potato, oats, lentils stabilize mood" },
      { emoji: "🥜", text: "Magnesium-rich: bananas, dark chocolate, leafy greens" },
      { emoji: "🚫", text: "Reduce salt & caffeine — eases bloating and breast tenderness" },
      { emoji: "🍲", text: "Warm, nourishing meals — soups, stews, herbal teas" },
      { emoji: "🍌", text: "Potassium-rich foods help with water retention" },
      { emoji: "🫚", text: "Ginger tea — helps with nausea and bloating" },
    ],
    ayurvedicImage: ayurLutealImg,
    ayurvedicRemedies: [
      { emoji: "🌿", text: "Ashwagandha — adaptogen for stress & hormonal balance" },
      { emoji: "🫚", text: "Ginger & cinnamon tea — warms and reduces bloating" },
      { emoji: "💆", text: "Abhyanga — warm oil self-massage before bath" },
      { emoji: "🍯", text: "Warm milk with nutmeg & cardamom — promotes deep sleep" },
      { emoji: "🌙", text: "Chyawanprash — Ayurvedic jam for immunity & vitality" },
      { emoji: "🪔", text: "Light a ghee lamp — calming evening ritual" },
      { emoji: "🧂", text: "Black salt (Kala Namak) in water — reduces gas & bloating" },
      { emoji: "🍃", text: "Dashamoola tea — traditional blend for Vata balance" },
    ],
  },
];


const practicalTips: (PracticalTip & { image: string })[] = [
  {
    title: "Period Pain Relief",
    emoji: "🔥",
    image: painReliefImg,
    tips: [
      { emoji: "🌡️", text: "Hot water bottle or heating pad on lower abdomen" },
      { emoji: "🚶‍♀️", text: "Gentle exercise — walking or light yoga" },
      { emoji: "💧", text: "Stay well hydrated — warm water helps most" },
      { emoji: "🫚", text: "Ginger tea, chamomile, or turmeric milk for relief" },
      { emoji: "🧲", text: "Magnesium supplements can reduce cramp intensity" },
      { emoji: "🛁", text: "Warm Epsom salt bath — relaxes muscles and eases pain" },
    ],
  },
  {
    title: "Hygiene Essentials",
    emoji: "🧼",
    image: hygieneEssImg,
    tips: [
      { emoji: "🩹", text: "Use pads, tampons, cups, or period underwear — whatever suits you" },
      { emoji: "🧴", text: "Always wash hands before & after changing products" },
      { emoji: "🚫", text: "Avoid scented products — they irritate and disrupt pH" },
      { emoji: "🔄", text: "Change products every 4-6 hours (max 8 for tampons)" },
      { emoji: "🩲", text: "Breathable cotton underwear reduces infection risk" },
    ],
  },
  {
    title: "Nutrition Across Phases",
    emoji: "🥗",
    image: nutritionPhasesImg,
    tips: [
      { emoji: "🍳", text: "Eat seasonal, home-cooked meals as much as possible" },
      { emoji: "💧", text: "Stay hydrated — at least 8 glasses of water daily" },
      { emoji: "🌾", text: "Include whole grains, proteins & colorful veggies/fruits" },
      { emoji: "🥬", text: "Iron-rich foods during periods — spinach, lentils, beets" },
      { emoji: "🥜", text: "Magnesium during luteal phase — nuts, seeds, dark chocolate" },
      { emoji: "🐟", text: "Omega-3s throughout — salmon, flaxseeds, walnuts" },
    ],
  },
  {
    title: "Skin, Exercise & Mind",
    emoji: "🧠",
    image: skinExMindImg,
    tips: [
      { emoji: "💧", text: "Skin: Hydrate internally & externally; use gentle products" },
      { emoji: "🏃‍♀️", text: "Exercise: Light → moderate → intense → gentle across phases" },
      { emoji: "📓", text: "Mental wellness: Journaling & meditation help with mood swings" },
      { emoji: "🗣️", text: "Talk to supportive people when emotions feel heavy" },
      { emoji: "😴", text: "Consistent sleep schedule regulates hormones naturally" },
    ],
  },
  {
    title: "Irregular Periods",
    emoji: "📅",
    image: irregularImg,
    tips: [
      { emoji: "📊", text: "Track your cycle consistently — apps or a simple diary" },
      { emoji: "😰", text: "Common causes: stress, diet changes, hormonal shifts" },
      { emoji: "😴", text: "Maintain consistent sleep and balanced nutrition" },
      { emoji: "⚖️", text: "Sudden weight changes can affect cycle regularity" },
      { emoji: "🩺", text: "See a doctor if irregular for 3+ months in a row" },
    ],
  },
  {
    title: "When to See a Doctor",
    emoji: "🩺",
    image: seeDoctorImg,
    tips: [
      { emoji: "😖", text: "Periods are very painful and disrupt daily life" },
      { emoji: "📅", text: "Cycles shorter than 21 or longer than 35 days consistently" },
      { emoji: "🩸", text: "Extremely heavy bleeding (soaking a pad/hour)" },
      { emoji: "🤢", text: "Severe symptoms: dizziness, vomiting, prolonged fatigue" },
      { emoji: "❌", text: "Missing periods for 3+ months without pregnancy" },
      { emoji: "⚠️", text: "Any symptom that feels abnormal — trust your instincts" },
    ],
  },
];

const TipCard = ({ tip, index }: { tip: Tip; index: number }) => (
  <motion.div
    className="flex items-start gap-2.5 bg-background/40 rounded-xl p-3"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
  >
    <span className="text-lg shrink-0 mt-0.5">{tip.emoji}</span>
    <p className="text-xs text-foreground/80 leading-relaxed">{tip.text}</p>
  </motion.div>
);

const ImageCategoryCard = ({ title, image, tips, extraImage }: { title: string; image: string; tips: Tip[]; extraImage?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${open ? "col-span-2" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className={`relative ${open ? "h-32" : "aspect-square"} overflow-hidden rounded-2xl`}>
          <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" width={512} height={512} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h4 className="font-bold text-white text-[11px] leading-tight drop-shadow-md">{title}</h4>
            <p className="text-[9px] text-white/70 mt-0.5 drop-shadow-md">{tips.length} tips</p>
          </div>
          {open && (
            <div className="absolute top-2 right-2">
              <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-white drop-shadow-md" />
              </motion.div>
            </div>
          )}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-1.5 bg-muted/30 rounded-b-2xl">
              {extraImage && (
                <div className="rounded-xl overflow-hidden h-24 mb-2">
                  <img src={extraImage} alt={title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              {tips.map((tip, j) => (
                <TipCard key={j} tip={tip} index={j} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const HealthTipsSection = ({ onOpenProfile }: { onOpenProfile?: () => void }) => {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header with profile icon */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/5 shadow-sm">
        <button onClick={onOpenProfile} className="transition-transform active:scale-95 shrink-0">
          <Avatar className="w-10 h-10 border-2 border-dc-pink shadow-sm overflow-hidden flex-shrink-0 text-foreground">
            <AvatarImage src={snehaAvatar} alt="Sneha" className="object-cover" />
            <AvatarFallback><User size={20} /></AvatarFallback>
          </Avatar>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold tracking-tight dc-text-gradient leading-tight">Health Tips</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5 italic">
            Your personalised wellness guide ✨
          </p>
        </div>
      </div>

      {/* Intro text */}
      <motion.div
        className="mx-5 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-bold text-foreground leading-relaxed">
          Simple daily routines, self-care habits & wellness practices to help you feel your best every day.
        </p>
      </motion.div>

      {/* Phase Cards */}
      <div className="px-4 space-y-3 pb-4 mt-2">
        {phases.map((phase, i) => {
          const isExpanded = expandedPhase === i;

          return (
            <motion.div
              key={phase.name}
              className={`${phase.color} rounded-2xl border ${phase.border} overflow-hidden`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : i)}
                className="w-full text-left"
              >
                <div className="relative h-36 overflow-hidden rounded-t-2xl">
                  <img
                    src={phase.heroImage}
                    alt={phase.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                          {phase.days}
                        </span>
                        <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md">
                          {phase.name}
                        </h3>
                        <p className="text-[11px] text-white/80 mt-0.5 italic">
                          {phase.tagline}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={22} className="text-white drop-shadow-md" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expandable Content — 2x2 Image Card Grid */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 grid grid-cols-2 gap-2.5">
                      <ImageCategoryCard
                        title="🌿 Rituals"
                        image={ritualsImg}
                        tips={phase.basicRituals}
                      />
                      <ImageCategoryCard
                        title="✨ Empowering"
                        image={empoweringImg}
                        tips={phase.empoweringRituals}
                      />
                      <ImageCategoryCard
                        title="🍽️ Body & Food"
                        image={bodyfoodImg}
                        tips={[...phase.bodyCareTips, ...phase.hygieneTips, ...phase.foodTips]}
                      />
                      <ImageCategoryCard
                        title="🕉️ Ayurvedic"
                        image={ayurvedicImg}
                        tips={phase.ayurvedicRemedies}
                        extraImage={phase.ayurvedicImage}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>



      {/* Practical Tips Section */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🌷</span>
          <h3 className="font-bold text-base text-foreground">Practical Tips</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          General wellness advice for every phase of your cycle
        </p>
      </div>

      <div className="px-4 pb-6 grid grid-cols-2 gap-3">
        {practicalTips.map((section, i) => (
          <ImageCategoryCard
            key={section.title}
            title={`${section.emoji} ${section.title}`}
            image={section.image}
            tips={section.tips}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthTipsSection;
