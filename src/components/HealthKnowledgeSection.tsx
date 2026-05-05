import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import cycleBasicsImg from "@/assets/health/cycle-basics.jpg";
import hormonesImg from "@/assets/health/hormones.jpg";
import symptomsImg from "@/assets/health/symptoms.jpg";
import nutritionImg from "@/assets/health/nutrition.jpg";
import hygieneImg from "@/assets/health/hygiene.jpg";
import fertilityImg from "@/assets/health/fertility.jpg";
import pregnancyImg from "@/assets/health/pregnancy.jpg";
import sexualImg from "@/assets/health/sexual-wellness.jpg";
import contraceptionImg from "@/assets/health/contraception.jpg";
import menopauseImg from "@/assets/health/menopause.jpg";
import dischargeImg from "@/assets/health/discharge.jpg";
import pcosImg from "@/assets/health/pcos.jpg";
import fibroidsImg from "@/assets/health/fibroids.jpg";
import heavyImg from "@/assets/health/heavy-periods.jpg";
import absentImg from "@/assets/health/absent-periods.jpg";
import doctorImg from "@/assets/health/doctor.jpg";
import mentalHealthImg from "@/assets/health/mental-health.jpg";
import skincareImg from "@/assets/health/skincare.jpg";
import yeastImg from "@/assets/health/yeast-infection.jpg";
import utisImg from "@/assets/health/utis.jpg";
import bvImg from "@/assets/health/bv.jpg";

interface TopicItem {
  emoji: string;
  text: string;
}

interface HealthTopic {
  title: string;
  subtitle: string;
  image: string;
  headerEmoji: string;
  items: TopicItem[];
  dos?: string[];
  donts?: string[];
  doctorAlert?: string;
}

const topics: HealthTopic[] = [
  {
    title: "Menstrual Cycle Basics",
    subtitle: "Foundation – start here",
    image: cycleBasicsImg,
    headerEmoji: "🌸",
    items: [
      { emoji: "📅", text: "A typical cycle lasts 21–35 days, counting from day 1 of bleeding" },
      { emoji: "🔄", text: "4 phases: Menstrual → Follicular → Ovulation → Luteal" },
      { emoji: "🩸", text: "Period (menstrual phase) lasts 3–7 days on average" },
      { emoji: "🥚", text: "Ovulation happens ~14 days before your next period" },
      { emoji: "🌡️", text: "Basal body temperature rises slightly after ovulation" },
      { emoji: "📊", text: "Tracking your cycle helps predict periods & understand your body" },
    ],
    dos: ["Track your cycle consistently", "Note flow intensity each day", "Learn your unique cycle length"],
    donts: ["Don't assume every cycle is exactly 28 days", "Don't ignore sudden changes in your cycle"],
    doctorAlert: "See a doctor if cycles are shorter than 21 or longer than 35 days consistently",
  },
  {
    title: "Hormones & Body Changes",
    subtitle: "What drives your cycle",
    image: hormonesImg,
    headerEmoji: "🧬",
    items: [
      { emoji: "💜", text: "Estrogen rises in the follicular phase — boosts energy & mood" },
      { emoji: "🟡", text: "Progesterone rises after ovulation — prepares uterus for pregnancy" },
      { emoji: "📉", text: "Both hormones drop before your period — causing PMS symptoms" },
      { emoji: "🧠", text: "FSH & LH from the brain control ovulation timing" },
      { emoji: "⚖️", text: "Hormonal imbalance causes irregular periods, acne, mood swings" },
      { emoji: "🌿", text: "Sleep, diet, stress & exercise all influence hormone levels" },
    ],
    dos: ["Eat balanced meals to support hormonal health", "Get 7-9 hours of sleep", "Exercise regularly but don't overdo it"],
    donts: ["Don't ignore persistent hormonal symptoms", "Don't rely on crash diets"],
    doctorAlert: "Consult a doctor for persistent acne, hair loss, or irregular cycles",
  },
  {
    title: "Symptoms & Concerns",
    subtitle: "What you might experience",
    image: symptomsImg,
    headerEmoji: "🤕",
    items: [
      { emoji: "😖", text: "Cramps (dysmenorrhea) — caused by uterine contractions" },
      { emoji: "🤯", text: "Headaches & migraines — often linked to estrogen drops" },
      { emoji: "😢", text: "Mood swings & irritability — hormonal fluctuations are the cause" },
      { emoji: "🫧", text: "Bloating & water retention — common before and during periods" },
      { emoji: "😴", text: "Fatigue — your body uses extra energy during menstruation" },
      { emoji: "🍫", text: "Food cravings — progesterone increases appetite before periods" },
      { emoji: "💢", text: "Breast tenderness — swelling due to hormonal changes" },
      { emoji: "🔥", text: "Back pain & leg pain — referred pain from uterine cramps" },
    ],
    dos: ["Use heat pads for cramps", "Stay hydrated", "Light exercise can help reduce symptoms"],
    donts: ["Don't suffer in silence — seek help for severe pain", "Don't skip meals"],
    doctorAlert: "See a doctor if pain is severe enough to miss work/school or doesn't respond to OTC painkillers",
  },
  {
    title: "Nutrition Tips",
    subtitle: "How food affects your cycle",
    image: nutritionImg,
    headerEmoji: "🥗",
    items: [
      { emoji: "🥬", text: "Iron-rich foods (spinach, lentils) combat period-related anemia" },
      { emoji: "🐟", text: "Omega-3 fatty acids (fish, flaxseed) reduce inflammation & cramps" },
      { emoji: "🍫", text: "Dark chocolate — magnesium helps with cramps & mood" },
      { emoji: "💧", text: "Stay hydrated — water reduces bloating and headaches" },
      { emoji: "☕", text: "Limit caffeine & salt — they increase bloating & breast tenderness" },
      { emoji: "🍌", text: "Potassium-rich foods (banana, avocado) reduce water retention" },
      { emoji: "🫘", text: "Zinc-rich foods support hormone regulation & immune function" },
      { emoji: "🧘", text: "Stress management (meditation) helps regulate hormones" },
    ],
    dos: ["Eat iron-rich foods during your period", "Include healthy fats in your diet", "Drink herbal teas like ginger & chamomile"],
    donts: ["Don't consume excess sugar or processed food", "Don't skip meals — maintain stable blood sugar"],
  },
  {
    title: "Hygiene Practices",
    subtitle: "Daily care & cleanliness",
    image: hygieneImg,
    headerEmoji: "🧼",
    items: [
      { emoji: "🩹", text: "Change pads every 4-6 hours to prevent bacterial growth" },
      { emoji: "🫧", text: "Tampons should be changed every 4-8 hours (avoid TSS risk)" },
      { emoji: "🥤", text: "Menstrual cups — reusable, eco-friendly, lasts up to 12 hours" },
      { emoji: "🩲", text: "Period underwear — comfortable backup or standalone option" },
      { emoji: "🚿", text: "Wash genital area with plain water — avoid scented products" },
      { emoji: "🚫", text: "Never use douches or vaginal deodorants — they disrupt pH" },
      { emoji: "🗑️", text: "Dispose of products hygienically — wrap and bin, never flush" },
    ],
    dos: ["Wash hands before and after changing products", "Wear breathable cotton underwear", "Shower daily during your period"],
    donts: ["Don't use scented soaps on intimate areas", "Don't wear a tampon overnight for more than 8 hours"],
  },
  {
    title: "Fertility Awareness",
    subtitle: "Understanding your fertile window",
    image: fertilityImg,
    headerEmoji: "🥚",
    items: [
      { emoji: "📅", text: "Fertile window is ~6 days per cycle — 5 days before ovulation + ovulation day" },
      { emoji: "🌡️", text: "Basal body temperature rises 0.2–0.5°C after ovulation" },
      { emoji: "💧", text: "Cervical mucus becomes clear & stretchy (egg-white) near ovulation" },
      { emoji: "📊", text: "OPK (Ovulation Prediction Kits) detect LH surge before ovulation" },
      { emoji: "⏰", text: "Egg survives 12-24 hours after release; sperm lasts up to 5 days" },
      { emoji: "🔄", text: "Irregular cycles make fertility tracking harder — be consistent" },
    ],
    dos: ["Track BBT at the same time every morning", "Monitor cervical mucus changes", "Use OPKs for more accurate ovulation detection"],
    donts: ["Don't rely solely on calendar method for contraception", "Don't stress — stress itself can delay ovulation"],
    doctorAlert: "See a fertility specialist if you've been trying to conceive for 12+ months (or 6 months if over 35)",
  },
  {
    title: "Pregnancy Education",
    subtitle: "Basics of conception & early pregnancy",
    image: pregnancyImg,
    headerEmoji: "🤰",
    items: [
      { emoji: "🥚", text: "Conception happens when sperm meets egg during the fertile window" },
      { emoji: "🩸", text: "Implantation bleeding — light spotting 6-12 days after conception" },
      { emoji: "🤢", text: "Early signs: nausea, missed period, breast tenderness, fatigue" },
      { emoji: "📅", text: "Pregnancy test is most accurate after a missed period" },
      { emoji: "💊", text: "Start folic acid supplements before & during early pregnancy" },
      { emoji: "🚫", text: "Avoid alcohol, smoking, and certain medications when pregnant" },
      { emoji: "🩺", text: "First prenatal visit should be at 6-8 weeks of pregnancy" },
    ],
    dos: ["Take prenatal vitamins with folic acid", "Stay hydrated and eat nutritious meals", "Get regular prenatal checkups"],
    donts: ["Don't consume alcohol or smoke", "Don't take medications without doctor's approval"],
    doctorAlert: "See a doctor immediately for heavy bleeding, severe pain, or fainting during early pregnancy",
  },
  {
    title: "Sexual Wellness",
    subtitle: "Safe & informed choices",
    image: sexualImg,
    headerEmoji: "💕",
    items: [
      { emoji: "🛡️", text: "Use protection — condoms prevent STIs and pregnancy" },
      { emoji: "💊", text: "Birth control pills, IUDs, patches, injections — many options exist" },
      { emoji: "🩸", text: "Sex during period is safe — may relieve cramps" },
      { emoji: "💧", text: "Vaginal dryness is normal — use water-based lubricants" },
      { emoji: "😣", text: "Pain during sex (dyspareunia) — don't ignore it, see a doctor" },
      { emoji: "🧼", text: "Urinate after sex to reduce UTI risk" },
      { emoji: "🗣️", text: "Open communication with partner about comfort & consent" },
      { emoji: "🩺", text: "Regular STI screenings are important for sexual health" },
    ],
    dos: ["Use protection consistently", "Communicate openly with your partner", "Get regular health checkups"],
    donts: ["Don't ignore pain during intercourse", "Don't skip STI screenings"],
  },
  {
    title: "Menopause Awareness",
    subtitle: "Later life stage transition",
    image: menopauseImg,
    headerEmoji: "🌺",
    items: [
      { emoji: "📅", text: "Menopause = no periods for 12 consecutive months (avg age 51)" },
      { emoji: "🔥", text: "Hot flashes & night sweats are the most common symptoms" },
      { emoji: "😴", text: "Sleep disturbances and mood changes are very common" },
      { emoji: "🦴", text: "Bone density decreases — increased risk of osteoporosis" },
      { emoji: "💧", text: "Vaginal dryness and decreased libido may occur" },
      { emoji: "🔄", text: "Perimenopause (transition) can last 4-8 years before menopause" },
      { emoji: "💊", text: "HRT (Hormone Replacement Therapy) helps manage severe symptoms" },
      { emoji: "🏋️‍♀️", text: "Weight-bearing exercise & calcium protect bone health" },
    ],
    dos: ["Stay physically active", "Eat calcium & vitamin D rich foods", "Talk to your doctor about HRT if symptoms are severe"],
    donts: ["Don't ignore bone health", "Don't dismiss mood changes as 'just aging'"],
  },
  {
    title: "Common Period Disorders",
    subtitle: "PCOS, endometriosis & more",
    image: pcosImg,
    headerEmoji: "🩺",
    items: [
      { emoji: "🔬", text: "PCOS — irregular periods, weight gain, acne, excess hair; affects 1 in 10" },
      { emoji: "🔴", text: "Fibroids — non-cancerous uterine growths causing heavy bleeding" },
      { emoji: "💜", text: "Endometriosis — uterine tissue grows outside uterus; causes severe pain" },
      { emoji: "🩸", text: "Menorrhagia — abnormally heavy or prolonged periods" },
      { emoji: "❌", text: "Amenorrhea — absence of periods for 3+ months" },
      { emoji: "😖", text: "Dysmenorrhea — severe menstrual cramps beyond normal discomfort" },
      { emoji: "🦋", text: "Thyroid disorders — hypo/hyperthyroidism directly affect cycles" },
      { emoji: "👩‍⚕️", text: "Early diagnosis is key — don't normalize severe symptoms" },
    ],
    dos: ["Track your symptoms carefully", "Maintain a healthy weight", "Seek early medical advice for irregular patterns"],
    donts: ["Don't dismiss severe pain as 'normal'", "Don't self-diagnose — get proper testing"],
    doctorAlert: "See a doctor for missing 3+ periods, pain that disrupts daily life, or very heavy bleeding",
  },
  {
    title: "Mental Health Support",
    subtitle: "Mood, emotions & well-being",
    image: mentalHealthImg,
    headerEmoji: "🧠",
    items: [
      { emoji: "😢", text: "PMS affects 75% of women — mood swings, irritability, anxiety" },
      { emoji: "🌧️", text: "PMDD — severe form of PMS with debilitating emotional symptoms" },
      { emoji: "🧬", text: "Hormonal fluctuations directly impact serotonin & dopamine levels" },
      { emoji: "🧘", text: "Mindfulness & meditation reduce stress and ease PMS symptoms" },
      { emoji: "🏃‍♀️", text: "Exercise releases endorphins — natural mood boosters" },
      { emoji: "😴", text: "Sleep quality worsens before periods — prioritize rest" },
      { emoji: "💬", text: "Talk to someone — friends, family, or a professional" },
      { emoji: "📓", text: "Mood journaling helps identify patterns & triggers across cycles" },
    ],
    dos: ["Practice self-compassion during PMS", "Maintain a regular sleep schedule", "Seek professional help if emotions feel overwhelming"],
    donts: ["Don't isolate yourself", "Don't dismiss your feelings as 'just hormones'"],
    doctorAlert: "See a doctor if mood symptoms severely impact relationships, work, or daily functioning",
  },
  {
    title: "Skin Care",
    subtitle: "Hormonal skin issues & care",
    image: skincareImg,
    headerEmoji: "✨",
    items: [
      { emoji: "🔬", text: "Hormonal acne peaks before periods — estrogen drops, androgen rises" },
      { emoji: "📍", text: "Breakouts commonly appear on chin, jawline & cheeks" },
      { emoji: "🧴", text: "Use gentle, non-comedogenic products — avoid harsh scrubs" },
      { emoji: "💧", text: "Hydration is key — drink water & use a good moisturizer" },
      { emoji: "🌿", text: "Tea tree oil & niacinamide help with hormonal breakouts" },
      { emoji: "☀️", text: "Always wear sunscreen — hormonal skin is more sensitive to UV" },
      { emoji: "🍎", text: "Anti-inflammatory diet (less sugar, dairy) helps reduce acne" },
      { emoji: "🧼", text: "Wash face twice daily — morning & before bed" },
    ],
    dos: ["Use SPF 30+ daily", "Cleanse gently twice daily", "Track breakout patterns with your cycle"],
    donts: ["Don't pick or pop pimples", "Don't use too many products at once", "Don't skip moisturizer even with oily skin"],
  },
];

const HealthKnowledgeSection = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = searchQuery
    ? topics.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.items.some(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : topics;

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-2 mb-4 mt-5">
        <span className="text-lg">✨</span>
        <h3 className="font-bold text-base text-foreground">Learn About Your Body</h3>
      </div>

      {filtered.length === 0 && searchQuery && (
        <p className="text-xs text-muted-foreground text-center py-4">No health topics match "{searchQuery}"</p>
      )}

      <div className="grid grid-cols-2 gap-3.5">
        {filtered.map((topic, i) => {
          const origIndex = topics.indexOf(topic);
          const isExpanded = expandedIndex === origIndex;
          return (
            <motion.div
              key={topic.title}
              className={`rounded-2xl overflow-hidden ${isExpanded ? "col-span-2" : ""}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              layout
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : origIndex)}
                className="w-full text-left"
              >
                <div className={`relative ${isExpanded ? "h-40" : "aspect-square"} overflow-hidden rounded-2xl`}>
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={512}
                    height={512}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <span className="text-lg drop-shadow-md">{topic.headerEmoji}</span>
                    <h4 className="font-bold text-white text-[11px] leading-tight drop-shadow-md mt-0.5">
                      {topic.title}
                    </h4>
                    {!isExpanded && (
                      <p className="text-[9px] text-white/70 mt-0.5 drop-shadow-md leading-tight line-clamp-1">
                        {topic.subtitle}
                      </p>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="absolute top-2 right-2">
                      <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={18} className="text-white drop-shadow-md" />
                      </motion.div>
                    </div>
                  )}
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
                    <div className="p-3 space-y-2 bg-muted/30 rounded-b-2xl">
                      <p className="text-[11px] text-muted-foreground italic mb-2">{topic.subtitle}</p>

                      {/* Key Points */}
                      {topic.items.map((item, j) => (
                        <motion.div
                          key={j}
                          className="flex items-start gap-2 bg-background/60 rounded-xl p-2.5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.03 }}
                        >
                          <span className="text-base shrink-0">{item.emoji}</span>
                          <p className="text-[11px] text-foreground/80 leading-relaxed">{item.text}</p>
                        </motion.div>
                      ))}

                      {/* Do's & Don'ts */}
                      {(topic.dos || topic.donts) && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {topic.dos && (
                            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-2.5">
                              <p className="text-[10px] font-bold text-green-700 dark:text-green-400 mb-1.5">👍 Do's</p>
                              {topic.dos.map((d, k) => (
                                <p key={k} className="text-[10px] text-green-800 dark:text-green-300 leading-relaxed mb-1">✓ {d}</p>
                              ))}
                            </div>
                          )}
                          {topic.donts && (
                            <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-2.5">
                              <p className="text-[10px] font-bold text-red-700 dark:text-red-400 mb-1.5">❌ Don'ts</p>
                              {topic.donts.map((d, k) => (
                                <p key={k} className="text-[10px] text-red-800 dark:text-red-300 leading-relaxed mb-1">✗ {d}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Doctor Alert */}
                      {topic.doctorAlert && (
                        <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-2.5 mt-2">
                          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1">🩺 When to See a Doctor</p>
                          <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed">{topic.doctorAlert}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthKnowledgeSection;
