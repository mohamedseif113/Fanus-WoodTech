"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18nStore } from "@/store/useI18nStore";
import {
  Box,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants/products";
import { FadeIn } from "@/components/ui/motion";

export const Footer: React.FC = () => {
  const { t } = useI18nStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-charcoal-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* COLUMN 1 & 2: BRAND & ABOUT */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 notranslate" translate="no" suppressHydrationWarning>
              <div className="w-10 h-10 rounded-xl bg-wood-700 flex items-center justify-center text-amber-200">
                <Box className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5 notranslate" translate="no" suppressHydrationWarning>
                <span suppressHydrationWarning className="notranslate" translate="no">Fanus</span>
                <span className="text-wood-400 notranslate" translate="no" suppressHydrationWarning>WoodTech</span>
                <span className="text-xs bg-wood-800 text-amber-200 px-1.5 py-0.5 rounded font-bold notranslate" translate="no" suppressHydrationWarning>3D</span>
              </div>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-normal">
              {t.footer.aboutText}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-white tracking-woodcoder-tag uppercase mb-2">
                {t.footer.newsletterTitle}
              </h4>
              <p className="text-[11px] text-stone-400 mb-2">
                {t.footer.newsletterSubtitle}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder={t.footer.newsletterPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-wood-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-wood-700 hover:bg-wood-600 text-white font-bold text-xs rounded-xl transition-all active:scale-95"
                >
                  {subscribed ? <CheckCircle className="w-4 h-4" /> : t.footer.newsletterSubscribe}
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 3: CATEGORIES */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-woodcoder-tag uppercase">
              {t.footer.categoriesHeader}
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products?category=${c.id}`}
                    className="hover:text-wood-300 transition-colors"
                  >
                    {t.categories[c.nameKey as keyof typeof t.categories] || c.id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-woodcoder-tag uppercase">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-wood-300 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/configurator" className="hover:text-wood-300 transition-colors text-wood-400 font-semibold">
                  {t.nav.configurator}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-wood-300 transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-wood-300 transition-colors">
                  {t.nav.categories}
                </Link>
              </li>
              <li>
                <Link href="/manufacturing" className="hover:text-wood-300 transition-colors">
                  {t.nav.manufacturing}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: CONTACT & FACTORY */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-woodcoder-tag uppercase">
              {t.footer.contactHeader}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-wood-400 flex-shrink-0 mt-0.5" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-wood-400 flex-shrink-0" />
                <span>{t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-wood-400 flex-shrink-0" />
                <span>{t.footer.email}</span>
              </li>
              <li className="pt-2 flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>ISO 9001:2015 & E1 Sertifikalı Üretim</span>
              </li>
            </ul>
          </div>
        </FadeIn>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {t.footer.rightsReserved}</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Gizlilik Politikası</span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Kullanım Koşulları</span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">KVKK Aydınlatma Metni</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
