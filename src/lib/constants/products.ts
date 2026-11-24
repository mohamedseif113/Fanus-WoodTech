import { Product, Category, ProductTranslation } from "@/types/furniture";

export const CATEGORIES: Category[] = [
  {
    id: "display-cabinets",
    nameKey: "displayCabinets",
    descriptionKey: "displayCabinetsDesc",
    iconName: "LayoutGrid",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    productCount: 4,
  },
  {
    id: "bookshelves",
    nameKey: "bookshelves",
    descriptionKey: "bookshelvesDesc",
    iconName: "BookOpen",
    image: "https://images.unsplash.com/photo-1594653303664-83955e81d77a?auto=format&fit=crop&w=800&q=80",
    productCount: 4,
  },
  {
    id: "wardrobes",
    nameKey: "wardrobes",
    descriptionKey: "wardrobesDesc",
    iconName: "DoorClosed",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80",
    productCount: 3,
  },
  {
    id: "tv-units",
    nameKey: "tvUnits",
    descriptionKey: "tvUnitsDesc",
    iconName: "Tv",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    productCount: 3,
  },
  {
    id: "desks",
    nameKey: "desks",
    descriptionKey: "desksDesc",
    iconName: "Monitor",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    productCount: 3,
  },
  {
    id: "kitchen-cabinets",
    nameKey: "kitchenCabinets",
    descriptionKey: "kitchenCabinetsDesc",
    iconName: "ChefHat",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    productCount: 3,
  },
  {
    id: "bathroom-cabinets",
    nameKey: "bathroomCabinets",
    descriptionKey: "bathroomCabinetsDesc",
    iconName: "Bath",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    productCount: 2,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "fanus-display-pro",
    nameKey: "Fanus Master Vitrin Dolabı",
    categoryKey: "display-cabinets",
    descriptionKey: "Masif meşe ve lake birleşimi, modüler iç raf yapısı ve çift kapaklı zarif tasarımıyla oturma ve yemek alanları için ideal sergileme ünitesi.",
    basePrice: 16800,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 120, height: 180, depth: 40 },
    defaultMaterial: "oak",
    defaultShelves: 3,
    defaultDoors: "two-doors",
    features: [
      "18mm E1 Gövde ve Raf Panelleri",
      "Soft-Close Entegre Frenli Menteşeler",
      "Ayarlanabilir Masif Ahşap Konik Ayaklar",
      "8mm Kanallı Gizli Arkalık",
    ],
    translations: {
      tr: {
        name: "Fanus Master Vitrin Dolabı",
        description: "Masif meşe ve lake birleşimi, modüler iç raf yapısı ve çift kapaklı zarif tasarımıyla oturma ve yemek alanları için ideal sergileme ünitesi.",
        features: [
          "18mm E1 Gövde ve Raf Panelleri",
          "Soft-Close Entegre Frenli Menteşeler",
          "Ayarlanabilir Masif Ahşap Konik Ayaklar",
          "8mm Kanallı Gizli Arkalık",
        ],
      },
      en: {
        name: "Fanus Master Display Cabinet",
        description: "Solid oak and lacquer fusion, modular internal shelving, and an elegant double-door design creating the ideal showcase unit for living and dining spaces.",
        features: [
          "18mm E1 Certified Carcass & Shelf Panels",
          "Integrated Soft-Close Damped Hinges",
          "Adjustable Solid Wood Tapered Legs",
          "8mm Concealed Grooved Back Panel",
        ],
      },
    },
  },
  {
    id: "fanus-bookshelf-loft",
    nameKey: "Loft Modüler Kitaplık",
    categoryKey: "bookshelves",
    descriptionKey: "Açık mimarisi, derin raf aralıkları ve yüksek taşıma kapasiteli gövdesiyle çalışma ve yaşam alanlarına dinamizm katar.",
    basePrice: 14200,
    image: "https://images.unsplash.com/photo-1594653303664-83955e81d77a?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 100, height: 200, depth: 32 },
    defaultMaterial: "walnut",
    defaultShelves: 5,
    defaultDoors: "none",
    features: [
      "5 Kademeli Eşit Yük Dağılımlı Raflar",
      "Siyah Metal Baza Destek Sistemi",
      "Duvara Sabitleme Emniyet Kiti",
      "0.8mm Çizilmez ABS Kenar Bantları",
    ],
    translations: {
      tr: {
        name: "Loft Modüler Kitaplık",
        description: "Açık mimarisi, derin raf aralıkları ve yüksek taşıma kapasiteli gövdesiyle çalışma ve yaşam alanlarına dinamizm katar.",
        features: [
          "5 Kademeli Eşit Yük Dağılımlı Raflar",
          "Siyah Metal Baza Destek Sistemi",
          "Duvara Sabitleme Emniyet Kiti",
          "0.8mm Çizilmez ABS Kenar Bantları",
        ],
      },
      en: {
        name: "Loft Modular Bookshelf",
        description: "Open architecture, generous shelf depths, and high load capacity carcass that brings dynamic organization to home offices and living rooms.",
        features: [
          "5-Tier Equal Load Distribution Shelves",
          "Black Architectural Steel Base Frame",
          "Anti-Tip Wall Mounting Safety Kit",
          "0.8mm Scratch-Resistant ABS Edge Banding",
        ],
      },
    },
  },
  {
    id: "fanus-wardrobe-arch",
    nameKey: "Arch Giyinme & Depolama Dolabı",
    categoryKey: "wardrobes",
    descriptionKey: "Dört kapaklı geniş hacmi, sessiz menteşe mekanizmaları ve minimalist kulp detaylarıyla yatak odanız için kusursuz organizasyon.",
    basePrice: 24500,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 160, height: 210, depth: 60 },
    defaultMaterial: "anthracite",
    defaultShelves: 4,
    defaultDoors: "four-doors",
    features: [
      "Askılık ve Çok Katlı Raf Bölmeleri",
      "İpeksi Saten Mat Lake Kaplama",
      "110 Derece Geniş Açılı Menteşeler",
      "Gizli Seviye Ayar Pabuçları",
    ],
    translations: {
      tr: {
        name: "Arch Giyinme & Depolama Dolabı",
        description: "Dört kapaklı geniş hacmi, sessiz menteşe mekanizmaları ve minimalist kulp detaylarıyla yatak odanız için kusursuz organizasyon.",
        features: [
          "Askılık ve Çok Katlı Raf Bölmeleri",
          "İpeksi Saten Mat Lake Kaplama",
          "110 Derece Geniş Açılı Menteşeler",
          "Gizli Seviye Ayar Pabuçları",
        ],
      },
      en: {
        name: "Arch Dressing & Storage Wardrobe",
        description: "Spacious four-door volume, silent hinge mechanisms, and minimalist handle detailing providing flawless organization for your bedroom.",
        features: [
          "Hanging Rail & Multi-Tier Shelf Sections",
          "Silky Satin Matte Lacquer Finish",
          "110-Degree Wide Angle Hinges",
          "Concealed Adjustable Leveling Glides",
        ],
      },
    },
  },
  {
    id: "fanus-tv-linear",
    nameKey: "Linear Medya & TV Konsolu",
    categoryKey: "tv-units",
    descriptionKey: "Geniş ekran televizyonlar ve ses sistemleri için özel kablo yönetim kanalları, bas-aç kapakları ve metal ayak şıklığı.",
    basePrice: 12900,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 180, height: 85, depth: 45 },
    defaultMaterial: "oak",
    defaultShelves: 2,
    defaultDoors: "half-doors",
    features: [
      "Manyetik Bas-Aç Kapak Mekanizması",
      "Havalandırmalı Elektronik Cihaz Bölmesi",
      "Lazer Kesim Elektrostatik Toz Boyalı Ayaklar",
      "Entegre Arka Kablo Geçiş Menfezleri",
    ],
    translations: {
      tr: {
        name: "Linear Medya & TV Konsolu",
        description: "Geniş ekran televizyonlar ve ses sistemleri için özel kablo yönetim kanalları, bas-aç kapakları ve metal ayak şıklığı.",
        features: [
          "Manyetik Bas-Aç Kapak Mekanizması",
          "Havalandırmalı Elektronik Cihaz Bölmesi",
          "Lazer Kesim Elektrostatik Toz Boyalı Ayaklar",
          "Entegre Arka Kablo Geçiş Menfezleri",
        ],
      },
      en: {
        name: "Linear Media & TV Console",
        description: "Dedicated cable management conduits, push-to-open doors, and sleek metal legs engineered for widescreen televisions and audio systems.",
        features: [
          "Magnetic Push-to-Open Door Mechanism",
          "Ventilated Electronic Equipment Compartment",
          "Laser-Cut Powder-Coated Steel Legs",
          "Integrated Rear Cable Management Ports",
        ],
      },
    },
  },
  {
    id: "fanus-desk-atelier",
    nameKey: "Atelier Yönetici Çalışma Masası",
    categoryKey: "desks",
    descriptionKey: "Doğal ahşap dokusu, gizli priz kutusu yuvası ve geniş çalışma yüzeyi ile profesyonel ofis ve ev-ofis kullanımı için üretildi.",
    basePrice: 13500,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 140, height: 80, depth: 70 },
    defaultMaterial: "walnut",
    defaultShelves: 1,
    defaultDoors: "none",
    features: [
      "25mm Güçlendirilmiş Masif Kenarlı Tabla",
      "Ergonomik Oturum Boşluğu ve Kablo Yatağı",
      "Kompakt Depolama Çekmece Modülü",
      "Ağır Hizmet Tipi Çelik Şasi",
    ],
    translations: {
      tr: {
        name: "Atelier Yönetici Çalışma Masası",
        description: "Doğal ahşap dokusu, gizli priz kutusu yuvası ve geniş çalışma yüzeyi ile profesyonel ofis ve ev-ofis kullanımı için üretildi.",
        features: [
          "25mm Güçlendirilmiş Masif Kenarlı Tabla",
          "Ergonomik Oturum Boşluğu ve Kablo Yatağı",
          "Kompakt Depolama Çekmece Modülü",
          "Ağır Hizmet Tipi Çelik Şasi",
        ],
      },
      en: {
        name: "Atelier Executive Desk",
        description: "Natural timber grain, concealed power grommet bay, and an expansive desktop crafted for professional offices and modern work-from-home spaces.",
        features: [
          "25mm Reinforced Solid Edge Desktop",
          "Ergonomic Legroom & Cable Raceways",
          "Compact Storage Drawer Module",
          "Heavy-Duty Welded Steel Subframe",
        ],
      },
    },
  },
  {
    id: "fanus-kitchen-pantry",
    nameKey: "Gourmet Boy Mutfak Kileri",
    categoryKey: "kitchen-cabinets",
    descriptionKey: "Neme dayanıklı gövde yapısı, ayarlanabilir derin rafları ve yüksek saklama kapasitesi ile kiler organizasyonunda mükemmellik.",
    basePrice: 18900,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 90, height: 210, depth: 55 },
    defaultMaterial: "white",
    defaultShelves: 6,
    defaultDoors: "two-doors",
    features: [
      "Neme Dayanıklı PUR Tutkallı Kenarlar",
      "Ağır Kavanoz ve Tencere Taşıma Kapasitesi",
      "Anti-Bakteriyel Kolay Temizlenen Yüzey",
      "Tam Açılır Frenli İç Sepet Uyumu",
    ],
    translations: {
      tr: {
        name: "Gourmet Boy Mutfak Kileri",
        description: "Neme dayanıklı gövde yapısı, ayarlanabilir derin rafları ve yüksek saklama kapasitesi ile kiler organizasyonunda mükemmellik.",
        features: [
          "Neme Dayanıklı PUR Tutkallı Kenarlar",
          "Ağır Kavanoz ve Tencere Taşıma Kapasitesi",
          "Anti-Bakteriyel Kolay Temizlenen Yüzey",
          "Tam Açılır Frenli İç Sepet Uyumu",
        ],
      },
      en: {
        name: "Gourmet Tall Kitchen Pantry",
        description: "Moisture-resistant carcass, deep adjustable shelves, and maximum capacity delivering perfection in kitchen and pantry organization.",
        features: [
          "Moisture-Proof PUR Bonded Edges",
          "Heavy Cookware & Jar Load Rating",
          "Antibacterial Easy-Clean Surface",
          "Full-Extension Damped Pull-Out Basket Ready",
        ],
      },
    },
  },
  {
    id: "fanus-bath-vanity",
    nameKey: "Aura Asma Banyo Dolabı",
    categoryKey: "bathroom-cabinets",
    descriptionKey: "Su sıçramalarına dayanıklı lake yüzeyler, gizli saklama alanları ve estetik hatları ile banyonuza ferahlık kazandırır.",
    basePrice: 11200,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    dimensions: { width: 80, height: 90, depth: 40 },
    defaultMaterial: "anthracite",
    defaultShelves: 2,
    defaultDoors: "two-doors",
    features: [
      "Su İtici Hidrofobik Lake Katmanı",
      "Sifon Boşluklu İç Düzenleme",
      "Gömme Pirinç Kulp Detayı",
      "Gizli Duvar Askı Plakaları",
    ],
    translations: {
      tr: {
        name: "Aura Asma Banyo Dolabı",
        description: "Su sıçramalarına dayanıklı lake yüzeyler, gizli saklama alanları ve estetik hatları ile banyonuza ferahlık kazandırır.",
        features: [
          "Su İtici Hidrofobik Lake Katmanı",
          "Sifon Boşluklu İç Düzenleme",
          "Gömme Pirinç Kulp Detayı",
          "Gizli Duvar Askı Plakaları",
        ],
      },
      en: {
        name: "Aura Floating Bathroom Vanity",
        description: "Splash-resistant lacquered surfaces, concealed storage niches, and sculpted architectural lines bringing serene clarity to your bathroom.",
        features: [
          "Hydrophobic Water-Repellent Lacquer Coat",
          "Plumbing Siphon Cutout Organization",
          "Recessed Solid Brass Pull Detail",
          "Concealed Heavy-Duty Wall Hanging Brackets",
        ],
      },
    },
  },
];

/**
 * Returns localized name, description, and features for any product based on language.
 */
export function getProductContent(
  product: Product,
  lang: string = "tr"
): ProductTranslation {
  const isEn = lang === "en";
  if (product.translations) {
    const t = isEn ? product.translations.en : product.translations.tr;
    if (t) return t;
  }
  return {
    name: product.nameKey,
    description: product.descriptionKey,
    features: product.features,
  };
}
