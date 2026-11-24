"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useCartStore } from "@/store/useCartStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Sparkles,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverElevate } from "@/components/ui/motion";

export default function CartPage() {
  const { t, language } = useI18nStore();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalCount,
    getTotalPrice,
  } = useCartStore();

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("İstanbul");
  const [customerPhone, setCustomerPhone] = useState("");

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const genOrder = `FW3D-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(genOrder);
    setOrderCompleted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    }

    clearCart();
  };

  if (orderCompleted) {
    return (
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <FadeIn className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.cart.orderSuccessTitle}
            </h1>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-normal">
              {t.cart.orderSuccessDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 text-left max-w-md mx-auto space-y-2 shadow-soft-sm">
            <div className="text-xs text-stone-500 font-normal">
              {t.cart.orderNumber}: <span className="font-mono font-bold text-stone-900">{orderNumber}</span>
            </div>
            <div className="text-xs text-stone-500 font-normal">
              Müşteri: <span className="font-semibold text-stone-800">{customerName} ({customerCity})</span>
            </div>
            <div className="text-xs text-stone-500 font-normal">
              Durum: <span className="font-bold text-emerald-600">Üretim Planlama & Kesim Kuyruğunda</span>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-sm transition-all"
          >
            <span>{t.cart.backToCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
      <FadeIn className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          {t.cart.title}
        </h1>
        <p className="text-sm text-stone-500 mt-1 font-normal">
          {totalCount} {t.cart.itemCount}
        </p>
      </FadeIn>

      {items.length === 0 ? (
        <FadeIn className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-soft-sm">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto font-normal">
            {t.cart.emptySubtitle}
          </p>
          <div className="pt-2">
            <HoverElevate yOffset={-3} className="inline-block">
              <Link
                href="/configurator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.common.designNow}</span>
              </Link>
            </HoverElevate>
          </div>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List (Left) */}
          <div className="lg:col-span-8 space-y-4">
            <StaggerContainer className="space-y-4">
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-4 hover:border-wood-300 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-semibold text-wood-700 tracking-woodcoder-tag uppercase block">
                          {item.category}
                        </span>
                        <h3 className="font-extrabold text-stone-900 text-base tracking-tight">
                          {item.productName}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200 text-stone-700 font-medium">
                        Ölçüler: {item.configuration.dimensions.width}x{item.configuration.dimensions.height}x{item.configuration.dimensions.depth} cm
                      </span>
                      <span className="bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200 text-stone-700 font-medium capitalize">
                        Malzeme: {item.configuration.material} ({item.configuration.finish})
                      </span>
                      <span className="bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200 text-stone-700 font-medium">
                        {item.configuration.shelfCount} Raf
                      </span>
                      <span className="bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200 text-stone-700 font-medium capitalize">
                        Kapak: {item.configuration.doorType}
                      </span>
                    </div>

                    {/* Price & Qty */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-wood-900">
                          {formatCurrency(item.unitPrice * item.quantity, language)}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Checkout Box (Right) */}
          <FadeIn direction="left" delay={0.2} className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-soft-sm space-y-5">
            <h3 className="font-extrabold text-stone-900 text-base tracking-tight">
              {t.cart.orderSummary}
            </h3>

            <div className="space-y-2 text-xs text-stone-600 border-b border-stone-100 pb-4">
              <div className="flex justify-between">
                <span className="font-normal">{t.common.subtotal}:</span>
                <span className="font-bold text-stone-900">
                  {formatCurrency(totalPrice, language)}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-700">
                <span className="flex items-center gap-1 font-normal">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t.common.freeShipping}:</span>
                </span>
                <span className="font-bold">Ücretsiz</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline font-black">
              <span className="text-stone-900 font-bold">{t.common.total}:</span>
              <span className="text-2xl text-wood-900">
                {formatCurrency(totalPrice, language)}
              </span>
            </div>

            {/* Simulated Checkout Form */}
            <form onSubmit={handleConfirmOrder} className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Ad Soyad
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ahmet Yılmaz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Şehir
                </label>
                <input
                  required
                  type="text"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Telefon
                </label>
                <input
                  required
                  type="tel"
                  placeholder="0532 000 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500 font-sans"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5 font-normal">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>{t.cart.checkoutDisclaimer}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-md transition-all active:scale-[0.99]"
              >
                {t.cart.confirmDemoOrder}
              </button>
            </form>
          </FadeIn>
        </div>
      )}
    </main>
  );
}
