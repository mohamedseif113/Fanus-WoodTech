"use client";

import React from "react";
import { useI18nStore } from "@/store/useI18nStore";
import { Sliders, Palette, Calculator, Factory } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverElevate } from "@/components/ui/motion";

export const HowItWorks: React.FC = () => {
  const { t } = useI18nStore();

  const steps = [
    {
      num: "01",
      icon: <Sliders className="w-5 h-5 text-wood-700" />,
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
    },
    {
      num: "02",
      icon: <Palette className="w-5 h-5 text-wood-700" />,
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
    },
    {
      num: "03",
      icon: <Calculator className="w-5 h-5 text-wood-700" />,
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
    },
    {
      num: "04",
      icon: <Factory className="w-5 h-5 text-wood-700" />,
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold text-wood-700 tracking-woodcoder-tag uppercase">
            {t.howItWorks.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-normal">
            {t.howItWorks.subtitle}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((s, idx) => (
            <StaggerItem key={idx}>
              <HoverElevate yOffset={-6} className="h-full">
                <div className="bg-stone-50/70 p-6 sm:p-7 rounded-2xl border border-stone-200/80 relative space-y-4 hover:border-wood-300 hover:shadow-soft-md transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/80 shadow-soft-sm flex items-center justify-center">
                        {s.icon}
                      </div>
                      <span className="text-2xl font-black text-stone-300 font-mono tracking-tighter">
                        {s.num}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {s.desc}
                    </p>
                  </div>
                  <div className="w-full h-1 bg-gradient-to-r from-wood-200 to-transparent rounded-full mt-4" />
                </div>
              </HoverElevate>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
