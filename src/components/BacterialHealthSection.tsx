import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import bacterialAwarenessImg from "@/assets/health/bacterial-awareness.jpg";
import dischargeYeastImg from "@/assets/health/discharge-yeast.jpg";
import bvBacteriaImg from "@/assets/health/bv-bacteria.jpg";
import utiHealthImg from "@/assets/health/uti-health.jpg";
import pidHealthImg from "@/assets/health/pid-health.jpg";
import periodBacteriaImg from "@/assets/health/period-bacteria.jpg";
import safeHygieneImg from "@/assets/health/safe-hygiene.jpg";
import doctorAlertImg from "@/assets/health/doctor-alert.jpg";
import fibroidsBacterialImg from "@/assets/health/fibroids-bacterial.jpg";
import heavyAbsentImg from "@/assets/health/heavy-absent.jpg";
import pcosPcodImg from "@/assets/health/pcos-pcod.jpg";
import contraceptionBacterialImg from "@/assets/health/contraception-bacterial.jpg";

interface TopicItem {
  emoji: string;
  text: string;
}

interface BacterialTopic {
  title: string;
  subtitle: string;
  image: string;
  headerEmoji: string;
  items: TopicItem[];
  dos?: string[];
  donts?: string[];
  doctorAlert?: string;
  treatments?: TopicItem[];
  homeRemedies?: TopicItem[];
}

const topics: BacterialTopic[] = [
  {
    title: "Bacterial Health Awareness",
    subtitle: "Understanding infections & prevention",
    image: bacterialAwarenessImg,
    headerEmoji: "🛡️",
    items: [
      { emoji: "🦠", text: "Understand common vaginal & urinary infections" },
      { emoji: "🛡️", text: "Learn prevention tips to stay protected" },
      { emoji: "🩺", text: "Know when to seek medical help" },
    ],
    dos: ["Maintain good intimate hygiene", "Stay hydrated daily", "Wear breathable cotton underwear"],
    donts: ["Don't use scented products on intimate areas", "Don't ignore unusual symptoms"],
    treatments: [
      { emoji: "💊", text: "Antibiotics or antifungals depending on the infection type" },
      { emoji: "🧬", text: "Probiotic supplements to restore healthy vaginal flora" },
      { emoji: "🩺", text: "Regular screening & early detection prevent complications" },
    ],
    homeRemedies: [
      { emoji: "🥛", text: "Eat probiotic-rich foods like yogurt, kefir & kimchi daily" },
      { emoji: "💧", text: "Drink 8+ glasses of water to flush bacteria naturally" },
      { emoji: "🧄", text: "Include garlic in your diet — natural antimicrobial properties" },
      { emoji: "🩲", text: "Switch to 100% cotton underwear & avoid tight clothing" },
    ],
  },
  {
    title: "Discharge & Yeast Infections",
    subtitle: "Recognizing abnormal signs",
    image: dischargeYeastImg,
    headerEmoji: "🌸",
    items: [
      { emoji: "💧", text: "Abnormal discharge (color, consistency, odor) signals an issue" },
      { emoji: "🔥", text: "Yeast infections: itching, burning, thick white discharge" },
      { emoji: "⚠️", text: "Common triggers & early warning signs to watch for" },
    ],
    dos: ["Track discharge changes throughout your cycle", "Wear cotton underwear", "Use unscented products"],
    donts: ["Don't douche", "Don't self-diagnose — confirm with a doctor"],
    doctorAlert: "See a doctor if discharge is green/gray, has a strong odor, or is accompanied by pain",
    treatments: [
      { emoji: "💊", text: "OTC antifungal creams (clotrimazole, miconazole) for yeast infections" },
      { emoji: "💉", text: "Oral fluconazole (single dose) for persistent yeast infections" },
      { emoji: "🧴", text: "Prescription vaginal suppositories for severe cases" },
    ],
    homeRemedies: [
      { emoji: "🥥", text: "Coconut oil — natural antifungal, apply externally for itch relief" },
      { emoji: "🥛", text: "Plain unsweetened yogurt — contains Lactobacillus to restore balance" },
      { emoji: "🛁", text: "Baking soda bath — add 1/4 cup to warm bath for pH relief" },
      { emoji: "🍎", text: "Apple cider vinegar bath — diluted, helps restore vaginal pH" },
      { emoji: "🚫", text: "Reduce sugar intake — yeast feeds on sugar" },
    ],
  },
  {
    title: "Bacterial Vaginosis (BV)",
    subtitle: "Bacterial imbalance explained",
    image: bvBacteriaImg,
    headerEmoji: "🔬",
    items: [
      { emoji: "⚖️", text: "Caused by imbalance in vaginal bacteria — reduced good Lactobacillus" },
      { emoji: "🚿", text: "Triggers: Douching, new/multiple partners, scented products, smoking" },
      { emoji: "👃", text: "Symptoms: Thin gray/white/greenish discharge, strong fishy odor" },
      { emoji: "💊", text: "Easily treatable with antibiotics — seek prompt treatment" },
    ],
    dos: ["Let your vagina self-clean naturally", "Use condoms to reduce risk", "Complete full course of antibiotics"],
    donts: ["Don't douche — it disrupts bacterial balance", "Don't use scented soaps or sprays"],
    doctorAlert: "See a doctor if you notice fishy odor or unusual discharge color",
    treatments: [
      { emoji: "💊", text: "Metronidazole (oral or gel) — 7-day course, most common treatment" },
      { emoji: "🧴", text: "Clindamycin cream — applied intravaginally for 7 days" },
      { emoji: "🔄", text: "Probiotic supplements (Lactobacillus) to prevent recurrence" },
      { emoji: "⚠️", text: "Avoid alcohol during metronidazole treatment (serious side effects)" },
    ],
    homeRemedies: [
      { emoji: "🥛", text: "Probiotic yogurt daily — helps restore Lactobacillus balance" },
      { emoji: "🧄", text: "Garlic supplements — natural antibacterial properties" },
      { emoji: "🌿", text: "Tea tree oil — diluted in carrier oil, apply externally only" },
      { emoji: "💧", text: "Hydrogen peroxide douche (1% solution) — short-term pH correction (consult doctor first)" },
      { emoji: "🐟", text: "Omega-3 rich foods — reduce inflammation & support immune response" },
    ],
  },
  {
    title: "Urinary Tract Infection (UTI)",
    subtitle: "Causes, symptoms & prevention",
    image: utiHealthImg,
    headerEmoji: "💧",
    items: [
      { emoji: "🔥", text: "Burning/pain while urinating, frequent urge with little output" },
      { emoji: "🦠", text: "Caused by bacteria (often E. coli) entering the urethra" },
      { emoji: "⚡", text: "Triggers: Poor wiping habits, holding urine, sexual activity" },
      { emoji: "💧", text: "Drink plenty of water & seek prompt treatment" },
    ],
    dos: ["Wipe front to back", "Urinate after sexual activity", "Stay well hydrated"],
    donts: ["Don't hold urine for long periods", "Don't use irritating feminine products"],
    doctorAlert: "See a doctor if you have blood in urine, fever, or back pain with UTI symptoms",
    treatments: [
      { emoji: "💊", text: "Antibiotics (Nitrofurantoin, Trimethoprim) — 3-7 day course" },
      { emoji: "💉", text: "IV antibiotics for severe/kidney infections requiring hospitalization" },
      { emoji: "💧", text: "Urinary alkalinizers (sodium citrate) for symptom relief" },
      { emoji: "🔄", text: "Low-dose preventive antibiotics for recurrent UTIs" },
    ],
    homeRemedies: [
      { emoji: "🫐", text: "Cranberry juice (unsweetened) or supplements — prevents bacteria adhesion" },
      { emoji: "💧", text: "Drink 2-3 liters of water daily to flush bacteria out" },
      { emoji: "🌿", text: "D-Mannose supplement — natural sugar that prevents E. coli from sticking" },
      { emoji: "🍵", text: "Green tea — contains antioxidants with antimicrobial properties" },
      { emoji: "🧡", text: "Vitamin C — acidifies urine, making it hostile to bacteria" },
      { emoji: "🌡️", text: "Heating pad on lower abdomen for pain & pressure relief" },
    ],
  },
  {
    title: "Pelvic Inflammatory Disease",
    subtitle: "Serious infection awareness",
    image: pidHealthImg,
    headerEmoji: "🚨",
    items: [
      { emoji: "🔴", text: "Serious infection of uterus, fallopian tubes & ovaries" },
      { emoji: "🦠", text: "Often starts from untreated STIs (chlamydia, gonorrhea)" },
      { emoji: "😖", text: "Symptoms: Lower pelvic pain, unusual discharge, pain during sex, fever" },
      { emoji: "⚠️", text: "Can lead to long-term complications if untreated" },
    ],
    dos: ["Get regular STI screenings", "Use protection during sex", "Seek immediate treatment for symptoms"],
    donts: ["Don't ignore pelvic pain", "Don't skip STI tests after unprotected sex"],
    doctorAlert: "See a doctor immediately for pelvic pain with fever, unusual discharge, or bleeding between periods",
    treatments: [
      { emoji: "💊", text: "Combination antibiotics — typically doxycycline + metronidazole for 14 days" },
      { emoji: "💉", text: "IV antibiotics if symptoms are severe or you're pregnant" },
      { emoji: "🏥", text: "Hospitalization may be needed for abscess drainage or severe cases" },
      { emoji: "👫", text: "Partner(s) must also be treated to prevent reinfection" },
    ],
    homeRemedies: [
      { emoji: "🌡️", text: "Warm compress on lower abdomen for pain relief" },
      { emoji: "🧘", text: "Rest & avoid strenuous activity during treatment" },
      { emoji: "🌿", text: "Turmeric & ginger tea — natural anti-inflammatory support" },
      { emoji: "⚠️", text: "Home remedies are NOT a substitute — PID requires medical treatment" },
    ],
  },
  {
    title: "Bacteria & Your Period",
    subtitle: "Why infections increase during periods",
    image: periodBacteriaImg,
    headerEmoji: "📅",
    items: [
      { emoji: "📊", text: "Menstrual blood raises vaginal pH (less acidic environment)" },
      { emoji: "📉", text: "Temporary drop in protective Lactobacillus bacteria" },
      { emoji: "🦠", text: "Blood provides nutrients for harmful bacteria growth" },
      { emoji: "⚠️", text: "Higher risk of BV, yeast infections & UTIs during/after periods" },
    ],
    dos: ["Change menstrual products frequently", "Maintain good hygiene during periods", "Stay hydrated"],
    donts: ["Don't wear a pad or tampon too long", "Don't use scented products during periods"],
    treatments: [
      { emoji: "🧬", text: "Vaginal probiotic suppositories during & after periods" },
      { emoji: "💊", text: "Preventive antifungal if prone to post-period yeast infections" },
      { emoji: "🩺", text: "Consult your doctor about prophylactic treatment if recurrent" },
    ],
    homeRemedies: [
      { emoji: "🥛", text: "Increase probiotic intake during your period (yogurt, kefir)" },
      { emoji: "💧", text: "Drink extra water to maintain body's natural defenses" },
      { emoji: "🌿", text: "Chamomile tea — soothes inflammation & supports immunity" },
      { emoji: "🩲", text: "Use menstrual cups (medical-grade silicone) — less pH disruption than pads" },
    ],
  },
  {
    title: "Safe Hygiene During Periods",
    subtitle: "Daily care & cleanliness",
    image: safeHygieneImg,
    headerEmoji: "🧼",
    items: [
      { emoji: "🩹", text: "Change pads/tampons every 4-6 hours (max 8 hours for tampons)" },
      { emoji: "🚿", text: "Wash vulva with plain warm water only — avoid douching" },
      { emoji: "👆", text: "Wipe front to back after using the toilet" },
      { emoji: "🩲", text: "Wear breathable cotton underwear" },
      { emoji: "🧴", text: "Wash hands before & after changing products" },
    ],
    dos: ["Shower daily during your period", "Use unscented period products", "Dispose of products hygienically"],
    donts: ["Don't use vaginal deodorants", "Don't wear a tampon overnight for more than 8 hours"],
    treatments: [
      { emoji: "🧴", text: "pH-balanced intimate wash (fragrance-free) for external use only" },
      { emoji: "🧬", text: "Probiotic supplements to maintain healthy flora during periods" },
    ],
    homeRemedies: [
      { emoji: "🌿", text: "Neem water rinse — gentle natural antibacterial for external washing" },
      { emoji: "🛁", text: "Warm salt water sitz bath — soothes irritation & prevents infection" },
      { emoji: "🥥", text: "Coconut oil externally — natural moisturizer & mild antimicrobial" },
      { emoji: "☀️", text: "Sun-dry cloth pads if reusable — UV kills residual bacteria" },
    ],
  },
  {
    title: "Doctor Alerts",
    subtitle: "When to seek medical help",
    image: doctorAlertImg,
    headerEmoji: "🩺",
    items: [
      { emoji: "👃", text: "Persistent unusual discharge or strong odor" },
      { emoji: "🔥", text: "Pain/burning while urinating or during sex" },
      { emoji: "😖", text: "Pelvic pain, fever, or bleeding between periods" },
      { emoji: "🩸", text: "Heavy or absent periods that feel abnormal" },
      { emoji: "❤️", text: "Any symptoms that worry you — early check-up prevents complications" },
    ],
    doctorAlert: "Don't wait — early medical attention prevents complications and protects your reproductive health",
    treatments: [
      { emoji: "🧪", text: "Lab tests: Vaginal swab, urine culture, blood work for diagnosis" },
      { emoji: "📷", text: "Ultrasound or imaging to check for fibroids, cysts, or PID" },
      { emoji: "🩺", text: "Pap smear & STI screening as part of routine checkup" },
      { emoji: "📋", text: "Treatment plan tailored to your specific condition & history" },
    ],
    homeRemedies: [
      { emoji: "📓", text: "Keep a symptom diary — record dates, severity & patterns" },
      { emoji: "📸", text: "Photo-document unusual discharge to show your doctor" },
      { emoji: "📋", text: "List all medications & supplements you're taking before your visit" },
      { emoji: "🗣️", text: "Be honest & detailed with your doctor — no question is embarrassing" },
    ],
  },
  {
    title: "Uterine Fibroids",
    subtitle: "Non-cancerous growths explained",
    image: fibroidsBacterialImg,
    headerEmoji: "🔮",
    items: [
      { emoji: "🔬", text: "Non-cancerous growths in/around the uterus" },
      { emoji: "🩸", text: "Common symptoms: Heavy menstrual bleeding, longer periods" },
      { emoji: "😖", text: "Pelvic pressure/pain is a frequent complaint" },
      { emoji: "👩‍⚕️", text: "Treatment ranges from monitoring to medication or surgery" },
    ],
    dos: ["Track your symptoms carefully", "Maintain a healthy weight", "Get regular pelvic exams"],
    donts: ["Don't ignore progressively heavier periods", "Don't self-diagnose — get an ultrasound"],
    doctorAlert: "See a doctor if you experience heavy bleeding, pelvic pressure, or frequent urination",
    treatments: [
      { emoji: "💊", text: "Hormonal therapy (GnRH agonists) to shrink fibroids temporarily" },
      { emoji: "🩺", text: "IUD with levonorgestrel to reduce heavy bleeding" },
      { emoji: "🔪", text: "Myomectomy — surgical removal of fibroids while preserving uterus" },
      { emoji: "🏥", text: "Uterine artery embolization — cuts blood supply to shrink fibroids" },
      { emoji: "💊", text: "Tranexamic acid for heavy bleeding management" },
    ],
    homeRemedies: [
      { emoji: "🥬", text: "Green leafy vegetables — rich in vitamin K, helps with clotting" },
      { emoji: "🌿", text: "Green tea extract — studies show it may help shrink fibroids" },
      { emoji: "🐟", text: "Omega-3 fatty acids — reduce inflammation around fibroids" },
      { emoji: "🏋️‍♀️", text: "Regular exercise — helps manage weight & reduce estrogen levels" },
      { emoji: "🚫", text: "Limit red meat & alcohol — both linked to fibroid growth" },
    ],
  },
  {
    title: "Heavy & Absent Periods",
    subtitle: "Flow patterns & what they mean",
    image: heavyAbsentImg,
    headerEmoji: "🩸",
    items: [
      { emoji: "🌊", text: "Heavy periods (menorrhagia): Can be linked to fibroids or hormonal issues" },
      { emoji: "❌", text: "Absent periods (amenorrhea): May signal hormonal imbalance or stress" },
      { emoji: "📊", text: "Track your cycle & consult a doctor if patterns change significantly" },
      { emoji: "⚖️", text: "Both extremes deserve medical attention — don't normalize abnormal flow" },
    ],
    dos: ["Keep a detailed period diary", "Note flow intensity each day", "Seek medical advice for changes"],
    donts: ["Don't assume heavy periods are 'normal for you'", "Don't ignore missing 3+ periods"],
    doctorAlert: "See a doctor for soaking through a pad/tampon every hour, or missing periods for 3+ months",
    treatments: [
      { emoji: "💊", text: "Hormonal birth control to regulate cycle & reduce flow" },
      { emoji: "💊", text: "Tranexamic acid — reduces heavy bleeding by 30-50%" },
      { emoji: "🩺", text: "Iron supplements for anemia caused by heavy periods" },
      { emoji: "🔬", text: "Endometrial ablation for severe cases unresponsive to medication" },
      { emoji: "🧪", text: "Thyroid function tests — thyroid issues are a common cause" },
    ],
    homeRemedies: [
      { emoji: "🌿", text: "Ginger tea — studies show it can reduce menstrual bleeding" },
      { emoji: "🍋", text: "Vitamin C-rich foods — strengthen blood vessels & improve iron absorption" },
      { emoji: "🫘", text: "Iron-rich foods (lentils, spinach, beans) to combat period-related anemia" },
      { emoji: "🧘", text: "Stress reduction (yoga, meditation) — stress affects cycle regularity" },
      { emoji: "🍌", text: "Cinnamon — traditional remedy that may help regulate periods" },
    ],
  },
  {
    title: "PCOS & PCOD",
    subtitle: "Hormonal disorders explained",
    image: pcosPcodImg,
    headerEmoji: "🔬",
    items: [
      { emoji: "⚖️", text: "PCOD: Ovaries produce many immature eggs due to hormonal imbalance" },
      { emoji: "🔬", text: "PCOS: A metabolic disorder — more severe, affects whole body" },
      { emoji: "📅", text: "Irregular or missed periods are the most common sign" },
      { emoji: "🧬", text: "Excess androgens cause acne, facial hair, hair thinning" },
      { emoji: "⚡", text: "Insulin resistance is common in PCOS — increases diabetes risk" },
      { emoji: "🏋️‍♀️", text: "Weight gain, especially around the belly, is a key symptom" },
      { emoji: "🥚", text: "Can affect fertility — but treatment options are available" },
      { emoji: "🩸", text: "Heavy or prolonged periods may occur when periods do come" },
    ],
    dos: ["Exercise regularly — even 30 min/day helps", "Eat a balanced, low-glycemic diet", "Track your cycle and symptoms", "Get hormonal blood tests done"],
    donts: ["Don't ignore irregular periods", "Don't rely on internet diagnosis", "Don't skip follow-up appointments"],
    doctorAlert: "See a doctor if you have irregular periods, unexplained weight gain, excess facial hair, or difficulty conceiving",
    treatments: [
      { emoji: "💊", text: "Metformin — improves insulin resistance & can restore ovulation" },
      { emoji: "💊", text: "Birth control pills — regulate periods & reduce androgen levels" },
      { emoji: "🧬", text: "Anti-androgen medications (spironolactone) for acne & hair growth" },
      { emoji: "🥚", text: "Clomiphene or Letrozole for fertility/ovulation induction" },
      { emoji: "🔪", text: "Laparoscopic ovarian drilling — for medication-resistant cases" },
      { emoji: "🩺", text: "Regular monitoring: Blood sugar, cholesterol, hormone levels" },
    ],
    homeRemedies: [
      { emoji: "🌿", text: "Spearmint tea (2 cups/day) — studies show it reduces androgen levels" },
      { emoji: "🍎", text: "Apple cider vinegar — may improve insulin sensitivity (1 tbsp in water)" },
      { emoji: "🫘", text: "Inositol supplement — improves ovarian function & insulin sensitivity" },
      { emoji: "🥬", text: "Anti-inflammatory diet: Leafy greens, berries, turmeric, fatty fish" },
      { emoji: "🏃‍♀️", text: "30 min moderate exercise daily — helps regulate hormones & weight" },
      { emoji: "😴", text: "7-9 hours sleep — poor sleep worsens insulin resistance" },
      { emoji: "🍫", text: "Reduce refined carbs & sugar — they spike insulin and worsen PCOS" },
    ],
  },
  {
    title: "Contraception Guide",
    subtitle: "Safe & informed choices",
    image: contraceptionBacterialImg,
    headerEmoji: "💊",
    items: [
      { emoji: "💊", text: "Oral pills: Daily hormone pills — 91% effective with typical use" },
      { emoji: "🔗", text: "IUD (Copper/Hormonal): Long-term, 99% effective, lasts 3-10 years" },
      { emoji: "🛡️", text: "Condoms: Only method that also prevents STIs" },
      { emoji: "💉", text: "Injections: Hormonal shot every 3 months — 94% effective" },
      { emoji: "🩹", text: "Patches & rings: Weekly/monthly hormone delivery options" },
      { emoji: "📅", text: "Natural methods: Fertility awareness — requires careful tracking" },
      { emoji: "🚫", text: "Emergency contraception: Available up to 72 hours after unprotected sex" },
      { emoji: "🗣️", text: "Consult a doctor to find the best method for your body & lifestyle" },
    ],
    dos: ["Discuss options with your healthcare provider", "Use condoms for STI protection regardless of other methods", "Take pills at the same time daily", "Know about emergency contraception"],
    donts: ["Don't stop contraception without a plan", "Don't share prescription contraceptives", "Don't rely solely on withdrawal method"],
    doctorAlert: "See a doctor if you experience severe side effects like chest pain, vision changes, or persistent headaches on hormonal contraception",
    treatments: [
      { emoji: "💊", text: "Combined pill (estrogen + progestin) — most commonly prescribed" },
      { emoji: "💊", text: "Progestin-only pill (mini-pill) — safer for smokers & breastfeeding" },
      { emoji: "🔗", text: "Hormonal IUD (Mirena/Kyleena) — lasts 3-7 years, lightens periods" },
      { emoji: "🔗", text: "Copper IUD (Paragard) — hormone-free, lasts up to 10 years" },
      { emoji: "💉", text: "Depo-Provera shot — every 3 months, no daily commitment" },
      { emoji: "📎", text: "Implant (Nexplanon) — inserted in arm, effective for 3 years" },
    ],
    homeRemedies: [
      { emoji: "📅", text: "Fertility awareness: Track BBT, cervical mucus & cycle length" },
      { emoji: "📱", text: "Use period tracking apps to identify your fertile window" },
      { emoji: "🌿", text: "Neem oil — studied as natural spermicide (consult doctor, not standalone)" },
      { emoji: "⚠️", text: "Natural methods alone are less effective — combine with barrier methods" },
      { emoji: "📓", text: "Keep a side-effects journal when starting new contraception" },
    ],
  },
];

const BacterialHealthSection = ({ searchQuery = "" }: { searchQuery?: string }) => {
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
        <span className="text-lg">🦠</span>
        <h3 className="font-bold text-base text-foreground">Bacterial & Intimate Health</h3>
      </div>

      {filtered.length === 0 && searchQuery && (
        <p className="text-xs text-muted-foreground text-center py-4">No topics match "{searchQuery}"</p>
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

                      {/* Treatment Options */}
                      {topic.treatments && topic.treatments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] font-bold text-primary mb-2 flex items-center gap-1.5">
                            <span className="text-sm">💊</span> Treatment Options
                          </p>
                          <div className="space-y-1.5">
                            {topic.treatments.map((t, j) => (
                              <motion.div
                                key={j}
                                className="flex items-start gap-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-2.5"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (topic.items.length + j) * 0.03 }}
                              >
                                <span className="text-sm shrink-0">{t.emoji}</span>
                                <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-relaxed">{t.text}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Home Remedies */}
                      {topic.homeRemedies && topic.homeRemedies.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] font-bold text-primary mb-2 flex items-center gap-1.5">
                            <span className="text-sm">🏡</span> Home Remedies
                          </p>
                          <div className="space-y-1.5">
                            {topic.homeRemedies.map((r, j) => (
                              <motion.div
                                key={j}
                                className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-2.5"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (topic.items.length + (topic.treatments?.length || 0) + j) * 0.03 }}
                              >
                                <span className="text-sm shrink-0">{r.emoji}</span>
                                <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-relaxed">{r.text}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

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

export default BacterialHealthSection;
