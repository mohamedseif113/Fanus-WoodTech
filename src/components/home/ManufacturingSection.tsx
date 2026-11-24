"use client";

import React from "react";
import { useI18nStore } from "@/store/useI18nStore";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Wrench,
} from "lucide-react";

export const ManufacturingSection: React.FC = () => {
  const { t } = useI18nStore();

  const cards = [
    {
      icon: <Layers className="w-5 h-5 text-wood-700" />,
      title: t.manufacturing.card1Title,
      desc: t.manufacturing.card1Desc,
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-wood-700" />,
      title: t.manufacturing.card2Title,
      desc: t.manufacturing.card2Desc,
    },
    {
      icon: <Wrench className="w-5 h-5 text-wood-700" />,
      title: t.manufacturing.card3Title,
      desc: t.manufacturing.card3Desc,
    },
    {
      icon: <Cpu className="w-5 h-5 text-wood-700" />,
      title: t.manufacturing.card4Title,
      desc: t.manufacturing.card4Desc,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-bold text-wood-700 uppercase tracking-wider">
            {t.manufacturing.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.manufacturing.title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {t.manufacturing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 hover:border-wood-300 hover:shadow-soft-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-soft-sm">
                {c.icon}
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">
                {c.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
