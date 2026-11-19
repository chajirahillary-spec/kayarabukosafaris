"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Calendar, ChevronLeft, ChevronRight, X, ChevronDown, Sparkles } from "lucide-react";

export interface MonthPickerProps {
  id?: string;
  name?: string;
  value?: string; // Format: "YYYY-MM" (e.g., "2026-10")
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const MONTHS = [
  { num: "01", short: "Jan", full: "January", note: "Peak Season" },
  { num: "02", short: "Feb", full: "February", note: "Peak Season" },
  { num: "03", short: "Mar", full: "March", note: "Calm Plains" },
  { num: "04", short: "Apr", full: "April", note: "Green Season" },
  { num: "05", short: "May", full: "May", note: "Green Season" },
  { num: "06", short: "Jun", full: "June", note: "Early Migration" },
  { num: "07", short: "Jul", full: "July", note: "Migration Peak" },
  { num: "08", short: "Aug", full: "August", note: "Migration Peak" },
  { num: "09", short: "Sep", full: "September", note: "Migration Peak" },
  { num: "10", short: "Oct", full: "October", note: "Migration Peak" },
  { num: "11", short: "Nov", full: "November", note: "Short Rains" },
  { num: "12", short: "Dec", full: "December", note: "Festive Safari" },
];

const SEASONS = [
  {
    name: "Great Migration",
    badge: "Jul – Oct",
    defaultMonth: "08",
    icon: "🦁",
  },
  {
    name: "Dry Season",
    badge: "Jan – Feb",
    defaultMonth: "01",
    icon: "☀️",
  },
  {
    name: "Green Season",
    badge: "Apr – May",
    defaultMonth: "04",
    icon: "🌿",
  },
];

export function MonthPicker({
  id,
  name = "when",
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Anytime / Select month",
  className = "",
}: MonthPickerProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;

  const now = new Date();
  const currentYearNum = now.getFullYear();

  // Parse currently selected year or fallback to current year
  const initialYear = selectedValue ? parseInt(selectedValue.split("-")[0], 10) : currentYearNum;
  const [viewYear, setViewYear] = useState<number>(Number.isNaN(initialYear) ? currentYearNum : initialYear);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (monthNum: string) => {
    const formatted = `${viewYear}-${monthNum}`;
    if (controlledValue === undefined) {
      setInternalValue(formatted);
    }
    onChange?.(formatted);
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onChange?.("");
    setIsOpen(false);
  };

  // Helper to format display text
  const getDisplayText = () => {
    if (!selectedValue) return placeholder;
    const parts = selectedValue.split("-");
    if (parts.length === 2) {
      const year = parts[0];
      const monthObj = MONTHS.find((m) => m.num === parts[1]);
      if (monthObj) {
        return `${monthObj.full} ${year}`;
      }
    }
    return selectedValue;
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for standard HTML form submission (e.g., in SafariSearchBar) */}
      <input type="hidden" id={inputId} name={name} value={selectedValue} />

      {/* Luxury Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`flex h-11 sm:h-12 w-full min-w-0 items-center justify-between rounded-ka border px-3.5 text-xs sm:text-sm transition-all focus:outline-none ${
          isOpen
            ? "border-green bg-ivory ring-2 ring-gold/40 shadow-sm"
            : selectedValue
            ? "border-green/60 bg-cream/30 text-forest font-medium"
            : "border-charcoal/20 bg-cream/20 text-charcoal/80 hover:bg-cream/40"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar className={`h-4 w-4 shrink-0 transition-colors ${selectedValue ? "text-forest" : "text-charcoal/40"}`} />
          <span className={`truncate text-left ${selectedValue ? "text-charcoal font-semibold" : "text-charcoal/60"}`}>
            {getDisplayText()}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {selectedValue ? (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClear();
              }}
              aria-label="Clear selected month"
              className="rounded-full p-1 text-charcoal/40 hover:bg-charcoal/10 hover:text-charcoal transition"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : (
            <ChevronDown className={`h-4 w-4 text-charcoal/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          )}
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Select safari travel month"
          className="absolute left-0 sm:left-auto right-0 top-full z-50 mt-2 w-full min-w-[300px] max-w-[340px] rounded-ka border border-gold/40 bg-ivory p-4 shadow-2xl shadow-forest/20 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Popover Header: Year Switcher */}
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3 mb-3">
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.max(currentYearNum, y - 1))}
              disabled={viewYear <= currentYearNum}
              aria-label="Previous year"
              className={`rounded-full p-1.5 transition ${
                viewYear <= currentYearNum
                  ? "opacity-30 cursor-not-allowed text-charcoal/30"
                  : "hover:bg-cream text-forest hover:text-green"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="font-display text-lg font-bold text-forest tracking-wide">
                {viewYear}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.16em] text-gold font-semibold">
                Safari Season
              </span>
            </div>

            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              aria-label="Next year"
              className="rounded-full p-1.5 hover:bg-cream text-forest hover:text-green transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Safari Season Shortcuts */}
          <div className="mb-3">
            <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
              <Sparkles className="h-3 w-3 text-gold" />
              <span>Prime Seasons</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {SEASONS.map((season) => (
                <button
                  key={season.name}
                  type="button"
                  onClick={() => handleSelect(season.defaultMonth)}
                  className="flex flex-col items-center justify-center rounded-md border border-charcoal/15 bg-cream/30 hover:bg-forest hover:border-forest hover:text-ivory py-1.5 px-1 text-center transition group"
                >
                  <span className="text-xs">{season.icon}</span>
                  <span className="text-[10.5px] font-medium leading-tight group-hover:text-ivory text-charcoal">
                    {season.name}
                  </span>
                  <span className="text-[9px] text-charcoal/60 group-hover:text-gold-light">
                    {season.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 12-Month Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {MONTHS.map((m) => {
              const formattedMonth = `${viewYear}-${m.num}`;
              const isSelected = selectedValue === formattedMonth;
              const isMigration = ["07", "08", "09", "10"].includes(m.num);

              return (
                <button
                  key={m.num}
                  type="button"
                  onClick={() => handleSelect(m.num)}
                  className={`group relative flex flex-col items-center justify-center rounded-ka py-2.5 px-2 transition border ${
                    isSelected
                      ? "border-green bg-green text-ivory shadow-md ring-2 ring-gold"
                      : "border-charcoal/15 bg-ivory hover:border-gold hover:bg-cream/50 text-charcoal"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? "text-ivory" : "text-forest group-hover:text-green"
                    }`}
                  >
                    {m.short}
                  </span>
                  <span
                    className={`text-[9px] leading-tight ${
                      isSelected
                        ? "text-gold-light"
                        : isMigration
                        ? "text-gold font-medium"
                        : "text-charcoal/50"
                    }`}
                  >
                    {m.note}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Popover Footer */}
          <div className="mt-3.5 pt-2.5 border-t border-charcoal/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-medium text-charcoal/60 hover:text-forest underline underline-offset-2"
            >
              Reset to anytime
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-forest hover:bg-green text-ivory px-3 py-1 text-[11px] font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
