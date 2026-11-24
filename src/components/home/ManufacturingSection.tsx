"use client";

import React from "react";
import { useI18nStore } from "@/store/useI18nStore";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Wrench,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverElevate } from "@/components/ui/motion";

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
        <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold text-wood-700 tracking-woodcoder-tag uppercase">
            {t.manufacturing.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.manufacturing.title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-normal">
            {t.manufacturing.subtitle}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <StaggerItem key={i}>
              <HoverElevate yOffset={-6} className="h-full">
                <div className="p-6 sm:p-7 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3.5 hover:border-wood-300 hover:shadow-soft-md transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="w-11 h-11 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shadow-soft-sm">
                      {c.icon}
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-sm tracking-tight leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </HoverElevate>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
