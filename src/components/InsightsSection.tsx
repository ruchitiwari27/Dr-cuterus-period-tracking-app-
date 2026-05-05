import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import snehaAvatar from "@/assets/sneha-avatar.png";
import { differenceInCalendarDays, format } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Label
} from "recharts";
import HealthKnowledgeSection from "./HealthKnowledgeSection";
import BacterialHealthSection from "./BacterialHealthSection";
import LifeStagesSection from "./LifeStagesSection";
import DischargeDecoderSection from "./DischargeDecoderSection";
import { getPeriodBlocks } from "@/lib/periodUtils";

interface InsightsSectionProps {
  periodDates: Date[];
  onOpenProfile?: () => void;
}

const PERIOD_DURATION_DEFAULT = 5;

const InsightsSection = ({ periodDates, onOpenProfile }: InsightsSectionProps) => {
  const sorted = useMemo(
    () => [...periodDates].sort((a, b) => a.getTime() - b.getTime()),
    [periodDates]
  );

  const cycles = useMemo(() => {
    const periodStarts = getPeriodBlocks(sorted);
    if (periodStarts.length < 2) return [];
    
    const result: { start: Date; length: number }[] = [];
    for (let i = 1; i < periodStarts.length; i++) {
      const len = differenceInCalendarDays(periodStarts[i][0], periodStarts[i - 1][0]);
      if (len > 15 && len < 60) {
        result.push({ start: periodStarts[i - 1][0], length: len });
      }
    }
    return result;
  }, [sorted]);

  const cycleVariation = useMemo(() => {
    if (cycles.length < 2) return null;
    const min = Math.min(...cycles.map((c) => c.length));
    const max = Math.max(...cycles.map((c) => c.length));
    return { min, max };
  }, [cycles]);

  const isNormal = (len: number) => len >= 21 && len <= 35;

  const chartData = useMemo(
    () =>
      cycles.map((c) => ({
        date: format(c.start, "MMM dd"),
        length: c.length,
      })),
    [cycles]
  );

  const hasData = sorted.length >= 2 && cycles.length > 0;
  const [searchQuery, setSearchQuery] = useState("");
  

  // Determine which sections match the search
  const q = searchQuery.toLowerCase().trim();
  const sectionMatches = useMemo(() => {
    if (!q) return { cycles: true, knowledge: true, bacterial: true, discharge: true, lifeStages: true };
    const keywords: Record<string, string[]> = {
      cycles: ["cycle", "period", "trend", "length", "irregular", "normal", "variation"],
      knowledge: ["menstrual", "hormone", "symptom", "nutrition", "hygiene", "fertility", "pregnancy", "sexual", "contraception", "menopause", "discharge", "pcos", "fibroid", "heavy", "absent", "doctor", "mental", "skin", "yeast", "uti", "bv", "basics"],
      bacterial: ["bacteria", "intimate", "infection", "vaginal", "ph", "probiotic", "lactobacillus"],
      discharge: ["discharge", "hygiene", "clean", "soap", "douche", "underwear"],
      lifeStages: ["puberty", "teen", "pregnancy", "menopause", "postpartum", "aging", "life stage", "adolescent"],
    };
    return {
      cycles: keywords.cycles.some(k => k.includes(q) || q.includes(k)),
      knowledge: keywords.knowledge.some(k => k.includes(q) || q.includes(k)),
      bacterial: keywords.bacterial.some(k => k.includes(q) || q.includes(k)),
      discharge: keywords.discharge.some(k => k.includes(q) || q.includes(k)),
      lifeStages: keywords.lifeStages.some(k => k.includes(q) || q.includes(k)),
    };
  }, [q]);

  const anyMatch = !q || Object.values(sectionMatches).some(v => v);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header with profile & search */}
      <div className="px-5 pt-6 pb-3 sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/5 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onOpenProfile} className="transition-transform active:scale-95 shrink-0">
            <Avatar className="w-9 h-9 border-2 border-white shadow-sm overflow-hidden shrink-0 text-foreground">
              <AvatarImage src={snehaAvatar} alt="Sneha" className="object-cover" />
              <AvatarFallback><User size={18} /></AvatarFallback>
            </Avatar>
          </button>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search health topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl dc-glass-strong border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Section intro below search */}
        <div className="mt-4">
          <h2 className="text-xl font-extrabold tracking-tight dc-text-gradient leading-tight">Insights</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5 italic">
            Your health knowledge hub — cycles, wellness & more ✨
          </p>
        </div>

        {/* No results */}
        {q && !anyMatch && (
          <div className="mt-6 text-center py-8">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-semibold text-muted-foreground">No topics found for "{searchQuery}"</p>
            <p className="text-xs text-muted-foreground mt-1">Try searching for cycles, hormones, discharge, hygiene...</p>
          </div>
        )}
      </div>

      {/* Health Knowledge Section */}
      {(!q || sectionMatches.knowledge) && (
        <HealthKnowledgeSection searchQuery={searchQuery} />
      )}

      {/* Bacterial & Intimate Health */}
      {(!q || sectionMatches.bacterial) && (
        <BacterialHealthSection searchQuery={searchQuery} />
      )}

      {/* Discharge Decoder */}
      {(!q || sectionMatches.discharge) && (
        <DischargeDecoderSection />
      )}

      {/* Life Stages Section */}
      {(!q || sectionMatches.lifeStages) && (
        <>
          <div className="px-5 mt-6 mb-3">
            <h3 className="dc-heading text-base font-semibold">Life Stages 🌿</h3>
            <p className="text-xs text-muted-foreground mt-1">Understanding your body through every phase of life</p>
          </div>
          <LifeStagesSection searchQuery={searchQuery} />
        </>
      )}
    </div>
  );
};

export default InsightsSection;
