"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18nStore } from "@/store/useI18nStore";
import { useCartStore } from "@/store/useCartStore";
import {
  Box,
  ShoppingBag,
  Globe,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Language } from "@/types/i18n";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t, language, setLanguage, initializeLanguage } = useI18nStore();
  const { getTotalCount, setIsOpen, initCart } = useCartStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeLanguage();
    initCart();
  }, [initializeLanguage, initCart]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [pathname]);

  const totalCount = getTotalCount();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/categories", label: t.nav.categories },
    { href: "/configurator", label: t.nav.configurator, isPrimary: true },
    { href: "/manufacturing", label: t.nav.manufacturing },
  ];

  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-2">
        {/* BRAND LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 group notranslate flex-shrink-0"
          translate="no"
          suppressHydrationWarning
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-wood-800 to-wood-950 flex items-center justify-center text-amber-200 shadow-soft-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <Box className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </div>
          <div className="flex flex-col notranslate" translate="no" suppressHydrationWarning>
            <div
              className="font-extrabold text-stone-900 tracking-tight text-base sm:text-lg leading-tight flex items-center gap-1 sm:gap-1.5 notranslate"
              translate="no"
              suppressHydrationWarning
            >
              <span suppressHydrationWarning className="notranslate" translate="no">Fanus</span>
              <span className="text-wood-700 notranslate" translate="no" suppressHydrationWarning>WoodTech</span>
              <span className="text-[9px] sm:text-[10px] bg-wood-100 text-wood-800 font-bold px-1 sm:px-1.5 py-0.5 rounded notranslate" translate="no" suppressHydrationWarning>
                3D
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium text-stone-500 tracking-wider uppercase notranslate hidden min-[360px]:block" translate="no" suppressHydrationWarning>
              Interactive Furniture
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isPrimary) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-wood-800 text-white shadow-soft-sm"
                      : "bg-wood-50 text-wood-800 hover:bg-wood-100 hover:shadow-soft-sm border border-wood-200/70"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:text-stone-900 ${
                  isActive
                    ? "text-wood-800 bg-stone-100/90 font-bold"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS: LANGUAGE SWITCHER & CART */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* LANGUAGE SWITCHER */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all min-h-[36px]"
              aria-label={t.nav.language}
            >
              <Globe className="w-3.5 h-3.5 text-wood-700" />
              <span className="hidden sm:inline">
                {mounted && language === "en" ? "English" : "Türkçe"}
              </span>
              <span className="sm:hidden font-bold text-[11px]">
                {mounted && language === "en" ? "EN" : "TR"}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-soft-lg border border-stone-200 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={() => handleSelectLang("tr")}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between min-h-[40px] ${
                    language === "tr"
                      ? "bg-wood-50 text-wood-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>Türkçe</span>
                  {language === "tr" && <span className="text-wood-600">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang("en")}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between min-h-[40px] ${
                    language === "en"
                      ? "bg-wood-50 text-wood-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>English</span>
                  {language === "en" && <span className="text-wood-600">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* CART BUTTON */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-wood-800 hover:bg-wood-900 text-white text-xs font-bold shadow-soft-sm transition-all min-h-[36px]"
            aria-label={t.nav.cart}
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">{t.nav.cart}</span>
            <span className="w-5 h-5 rounded-full bg-amber-400 text-wood-950 font-extrabold flex items-center justify-center text-[10px]">
              {mounted ? totalCount : 0}
            </span>
          </button>

          {/* MOBILE MENU TOGGLE BUTTON (Touch target >= 40px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN & BACKDROP */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[64px] sm:top-[68px] bg-black/30 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="relative z-40 md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 shadow-soft-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.isPrimary) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-[#3498a7] text-white shadow-soft-sm active:scale-[0.99] min-h-[48px]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                      <span>{link.label}</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">
                      Three.js
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-wood-50 text-wood-950 font-bold border-l-4 border-wood-800"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-wood-800" />}
                </Link>
              );
            })}

            {/* Mobile Language Switcher Inside Drawer */}
            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-stone-500">
                {language === "en" ? "Language / Dil:" : "Dil Seçimi / Language:"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectLang("tr")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    language === "tr"
                      ? "bg-wood-800 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Türkçe
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    language === "en"
                      ? "bg-wood-800 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
