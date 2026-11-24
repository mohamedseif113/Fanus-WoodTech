"use client";

import React from "react";
import { useTVStandStore } from "@/store/useTVStandStore";
import { useI18nStore } from "@/store/useI18nStore";
import { Ruler } from "lucide-react";

const PRESET_WIDTHS = [140, 160, 180, 200, 240, 280];

export const TVDimensionsPanel: React.FC = () => {
  const { t } = useI18nStore();
  const { dimensions, setWidth, setHeight, setDepth, setUpperHeight, upperSection } = useTVStandStore();

  return (
    <div className="space-y-5">
      {/* Quick Width Presets */}
      <div>
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
          Hızlı Ölçü Seçimi (cm)
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_WIDTHS.map((pw) => (
            <button
              key={pw}
              onClick={() => setWidth(pw)}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                dimensions.width === pw
                  ? "bg-wood-800 text-white border-wood-800 shadow-sm"
                  : "bg-white text-stone-700 border-stone-200 hover:border-wood-400 hover:bg-stone-50"
              }`}
            >
              {pw}
            </button>
          ))}
        </div>
      </div>

      {/* Total Width Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-wood-600" />
            {t.configurator.tvConsoleWidth}
          </span>
          <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
            <input
              type="number"
              min={100}
              max={300}
              value={dimensions.width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-12 text-right bg-transparent text-xs font-extrabold text-stone-900 focus:outline-none"
            />
            <span className="text-[10px] text-stone-500">cm</span>
          </div>
        </div>
        <input
          type="range"
          min={100}
          max={300}
          step={5}
          value={dimensions.width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full accent-wood-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-stone-400">
          <span>100 cm</span>
          <span>300 cm</span>
        </div>
      </div>

      {/* Base Console Height */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span>{t.configurator.tvConsoleHeight}</span>
          <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
            <input
              type="number"
              min={30}
              max={80}
              value={dimensions.height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-10 text-right bg-transparent text-xs font-extrabold text-stone-900 focus:outline-none"
            />
            <span className="text-[10px] text-stone-500">cm</span>
          </div>
        </div>
        <input
          type="range"
          min={30}
          max={80}
          step={2}
          value={dimensions.height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full accent-wood-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-stone-400">
          <span>30 cm</span>
          <span>80 cm</span>
        </div>
      </div>

      {/* Depth */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span>{t.configurator.tvConsoleDepth}</span>
          <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
            <input
              type="number"
              min={25}
              max={55}
              value={dimensions.depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-10 text-right bg-transparent text-xs font-extrabold text-stone-900 focus:outline-none"
            />
            <span className="text-[10px] text-stone-500">cm</span>
          </div>
        </div>
        <input
          type="range"
          min={25}
          max={55}
          step={2}
          value={dimensions.depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="w-full accent-wood-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-stone-400">
          <span>25 cm</span>
          <span>55 cm</span>
        </div>
      </div>

      {/* Upper Section Height (if active) */}
      {upperSection !== "none" && (
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span>{t.configurator.tvUpperHeight}</span>
            <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              <input
                type="number"
                min={30}
                max={100}
                value={dimensions.upperHeight}
                onChange={(e) => setUpperHeight(Number(e.target.value))}
                className="w-10 text-right bg-transparent text-xs font-extrabold text-stone-900 focus:outline-none"
              />
              <span className="text-[10px] text-stone-500">cm</span>
            </div>
          </div>
          <input
            type="range"
            min={30}
            max={100}
            step={5}
            value={dimensions.upperHeight}
            onChange={(e) => setUpperHeight(Number(e.target.value))}
            className="w-full accent-wood-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>30 cm</span>
            <span>100 cm</span>
          </div>
        </div>
      )}
    </div>
  );
};
