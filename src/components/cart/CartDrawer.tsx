"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useCartStore } from "@/store/useCartStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { t, language } = useI18nStore();
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalCount,
    getTotalPrice,
  } = useCartStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("İstanbul");
  const [customerPhone, setCustomerPhone] = useState("");

  if (!isOpen) return null;

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  const handleStartCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrderNum = `FW3D-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNum);
    setOrderCompleted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
    }

    clearCart();
  };

  const handleCloseAll = () => {
    setIsCheckoutModalOpen(false);
    setOrderCompleted(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-charcoal-950/50 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-soft-xl flex flex-col border-l border-stone-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-wood-700" />
                <h3 className="font-extrabold text-stone-900 text-lg">
                  {t.cart.title}
                </h3>
                <span className="bg-wood-100 text-wood-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalCount}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-base">
                    {t.cart.emptyTitle}
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    {t.cart.emptySubtitle}
                  </p>
                  <Link
                    href="/configurator"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-wood-700 hover:bg-wood-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <span>{t.common.designNow}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-3 hover:border-wood-300 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-bold text-wood-700 uppercase tracking-wider">
                          {item.category}
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {item.productName}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Configuration Specs Pills */}
                    <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-stone-200 font-medium">
                        {item.configuration.dimensions.width}x{item.configuration.dimensions.height}x{item.configuration.dimensions.depth} cm
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-stone-200 font-medium capitalize">
                        {item.configuration.material} ({item.configuration.finish})
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-stone-200 font-medium">
                        {item.configuration.shelfCount} Raf
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-stone-200 font-medium capitalize">
                        {item.configuration.doorType}
                      </span>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/70">
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-stone-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-stone-900">
                          {formatCurrency(item.unitPrice * item.quantity, language)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{t.common.freeShipping}</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Ücretsiz</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-bold text-stone-900">
                    {t.common.total} ({totalCount} {t.common.qty}):
                  </span>
                  <span className="text-xl font-black text-wood-900">
                    {formatCurrency(totalPrice, language)}
                  </span>
                </div>

                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3.5 px-4 bg-wood-800 hover:bg-wood-900 text-white font-bold rounded-xl shadow-soft-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <span>{t.cart.checkoutDemo}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT SIMULATION MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-soft-xl border border-stone-200 overflow-hidden">
            {!orderCompleted ? (
              <form onSubmit={handleConfirmOrder} className="p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base">
                      {t.cart.checkoutDemo}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Üretim sipariş simülasyonu
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Ad Soyad / Firma
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Şehir / Bölge
                      </label>
                      <input
                        required
                        type="text"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Telefon
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="0532 000 00 00"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>{t.cart.checkoutDisclaimer}</span>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex justify-between items-center font-bold">
                    <span>Toplam Tutar:</span>
                    <span className="text-base text-wood-900">
                      {formatCurrency(totalPrice, language)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="flex-1 py-2.5 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-3 bg-wood-800 hover:bg-wood-900 text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    {t.cart.confirmDemoOrder}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-xl">
                    {t.cart.orderSuccessTitle}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    {t.cart.orderSuccessDesc}
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 inline-block w-full text-left space-y-1.5">
                  <div className="text-xs text-stone-500">
                    {t.cart.orderNumber}:{" "}
                    <span className="font-mono font-bold text-stone-900">
                      {orderNumber}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">
                    Müşteri:{" "}
                    <span className="font-medium text-stone-800">
                      {customerName} ({customerCity})
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">
                    Durum:{" "}
                    <span className="font-semibold text-emerald-600">
                      CNC Kesim Kuyruğuna Eklendi
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCloseAll}
                  className="w-full py-3 bg-wood-800 hover:bg-wood-900 text-white text-xs font-bold rounded-xl shadow-soft-md transition-all"
                >
                  {t.cart.backToCatalog}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
