"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  badge,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-b border-stone-200/80 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all ${
          isOpen ? "bg-wood-50/40 text-stone-900" : "hover:bg-stone-50/80 text-stone-700"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className={`${isOpen ? "text-wood-700" : "text-stone-400"}`}>{icon}</span>}
          <span className="text-xs sm:text-sm font-bold tracking-tight">{title}</span>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-stone-100 text-stone-600 border border-stone-200">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-wood-700" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-2 pb-5 bg-white space-y-4 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </div>
  );
};
