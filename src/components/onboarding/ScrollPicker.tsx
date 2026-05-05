import { useRef, useEffect, useCallback, useMemo } from "react";

interface ScrollPickerProps {
  items: (string | number)[];
  selected: string | number;
  onSelect: (item: string | number) => void;
  suffix?: string;
  itemHeight?: number;
  visibleItems?: number;
  baseFontSize?: string;
  activeFontSize?: string;
}

const ScrollPicker = ({
  items,
  selected,
  onSelect,
  suffix,
  itemHeight = 56,
  visibleItems = 5,
  baseFontSize = "1.1rem",
  activeFontSize = "2rem",
}: ScrollPickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const centerOffset = Math.floor(visibleItems / 2) * itemHeight;
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  const selectedIdx = useMemo(() => items.indexOf(selected), [items, selected]);

  const scrollToItem = useCallback((item: string | number, smooth = false) => {
    if (!scrollRef.current) return;
    const idx = items.indexOf(item);
    if (idx === -1) return;
    scrollRef.current.scrollTo({ top: idx * itemHeight, behavior: smooth ? "smooth" : "auto" });
  }, [items, itemHeight]);

  useEffect(() => {
    // Ensuring centering on first mount and whenever selected changes from outside
    const centerIdx = items.indexOf(selected);
    if (centerIdx !== -1 && scrollRef.current) {
      scrollRef.current.scrollTo({ top: centerIdx * itemHeight, behavior: "auto" });
    }
  }, [items, selected, itemHeight]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (!scrollRef.current) return;
      const idx = Math.round(scrollRef.current.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      if (items[clamped] !== selected) onSelect(items[clamped]);
      scrollRef.current.scrollTo({ top: clamped * itemHeight, behavior: "smooth" });
    }, 80);
  };

  const getItemStyle = (idx: number) => {
    const distance = Math.abs(idx - selectedIdx);
    if (distance === 0) return { opacity: 1, scale: 1.35, fontWeight: 900 };
    if (distance === 1) return { opacity: 0.35, scale: 0.95, fontWeight: 500 };
    if (distance === 2) return { opacity: 0.18, scale: 0.85, fontWeight: 400 };
    return { opacity: 0.08, scale: 0.75, fontWeight: 400 };
  };

  return (
    <div className="relative w-full" style={{ height: visibleItems * itemHeight }}>
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{ height: centerOffset, background: "linear-gradient(to bottom, hsl(var(--background)) 10%, transparent 100%)" }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{ height: centerOffset, background: "linear-gradient(to top, hsl(var(--background)) 10%, transparent 100%)" }}
      />

      {/* Selection highlight band */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{
          top: centerOffset,
          height: itemHeight,
          borderTop: "2px solid hsl(var(--dc-pink-deep))",
          borderBottom: "2px solid hsl(var(--dc-pink-deep))",
        }}
      />

      {/* Scrollable items — NO SCROLLBAR */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-scroll"
        style={{
          paddingTop: centerOffset,
          paddingBottom: centerOffset,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={handleScroll}
      >
        <style>{`
          .scroll-picker-no-bar::-webkit-scrollbar { display: none; }
        `}</style>
        <div ref={(el) => { if (el) el.parentElement?.classList.add("scroll-picker-no-bar"); }}>
          {items.map((item, idx) => {
            const s = getItemStyle(idx);
            const isSelected = idx === selectedIdx;
            return (
              <div
                key={item}
                className="flex items-center justify-center gap-2 cursor-pointer select-none"
                style={{ height: itemHeight }}
                onClick={() => { onSelect(item); scrollToItem(item, true); }}
              >
                <span
                  style={{
                    opacity: s.opacity,
                    transform: `scale(${s.scale})`,
                    fontWeight: s.fontWeight,
                    fontSize: isSelected ? activeFontSize : baseFontSize,
                    color: isSelected ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: isSelected ? "0.02em" : "0",
                  }}
                >
                  {item}
                </span>
                {suffix && isSelected && (
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "hsl(var(--muted-foreground))",
                      opacity: 0.7,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {suffix}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScrollPicker;
