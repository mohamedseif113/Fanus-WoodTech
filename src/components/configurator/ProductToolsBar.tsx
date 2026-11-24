"use client";

import React from "react";
import {
  Ruler,
  Layers,
  Palette,
  DoorClosed,
  Wrench,
} from "lucide-react";

export type ConfigCategory =
  | "dimensions"
  | "modules"
  | "materials"
  | "doors"
  | "hardware";

interface ProductToolsBarProps {
  activeCategory: ConfigCategory;
  onSelectCategory: (category: ConfigCategory) => void;
  productType?: "tv-stand" | "cabinet";
}

export const ProductToolsBar: React.FC<ProductToolsBarProps> = ({
  activeCategory,
  onSelectCategory,
  productType = "tv-stand",
}) => {
  const tools: {
    id: ConfigCategory;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "dimensions",
      title: "Ölçüler & Boyut",
      icon: (
        <div className="relative flex items-center justify-center">
          <Ruler className="w-6 h-6 text-stone-700" />
          <span className="absolute -bottom-1 -right-1 text-[9px] font-black text-[#3498a7]">
            ⚙
          </span>
        </div>
      ),
    },
    {
      id: "modules",
      title: productType === "tv-stand" ? "Modüller & Bölmeler" : "Raflar & Yerleşim",
      icon: (
        <div className="flex items-center justify-center">
          <Layers className="w-6 h-6 text-stone-700" />
        </div>
      ),
    },
    {
      id: "materials",
      title: "Malzeme & Renkler",
      icon: (
        <div className="flex items-center justify-center">
          <Palette className="w-6 h-6 text-stone-700" />
        </div>
      ),
    },
    {
      id: "doors",
      title: productType === "tv-stand" ? "Kapaklar & Cam" : "Kapak Çeşitleri",
      icon: (
        <div className="flex items-center justify-center">
          <DoorClosed className="w-6 h-6 text-stone-700" />
        </div>
      ),
    },
    {
      id: "hardware",
      title: "Ayaklar & Donanım",
      icon: (
        <div className="flex items-center justify-center">
          <Wrench className="w-6 h-6 text-stone-700" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full px-3 sm:px-6 py-2 select-none">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-soft-sm border border-stone-200/90 p-1.5 sm:p-2 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {tools.map((tool) => {
          const isActive = activeCategory === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectCategory(tool.id)}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 relative ${
                isActive
                  ? "bg-[#e5f5f7] border-2 border-[#3498a7] shadow-sm text-[#196b77] scale-[1.02]"
                  : "hover:bg-stone-50 border-2 border-transparent text-stone-600 hover:text-stone-900"
              }`}
              title={tool.title}
            >
              {tool.icon}
              <span className="hidden md:inline text-xs font-bold tracking-tight">
                {tool.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
