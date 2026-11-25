export interface AssemblyStepInfo {
  step: number;
  titleTr: string;
  titleEn: string;
  hardware: string[];
  components: string[];
  descriptionTr: string;
  descriptionEn: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export const ASSEMBLY_STEPS: AssemblyStepInfo[] = [
  {
    step: 1,
    titleTr: "AŞAMA 1: Metal Baza Açma Aparatının Montajı",
    titleEn: "Step 1: Metal Bed Base Barrier Assembly",
    hardware: ["4x Akıllı Vida 3.9x16 (-13)"],
    components: ["1x Metal Profil Boru (-21)", "2x Çekme Kulpu (-16)"],
    descriptionTr: "Metal açma aparatı profil borusuna iki adet plastik çekme kulpu 3.9x16 akıllı vidalar ile sabitlenir.",
    descriptionEn: "Mount the two pull handles onto the metal profile bar using 3.9x16 self-drilling screws.",
    camera: {
      position: [1.2, 0.8, 1.4],
      target: [0, 0.45, 0],
    },
  },
  {
    step: 2,
    titleTr: "AŞAMA 2: Baza Montajı (4 Leme)",
    titleEn: "Step 2: Bed Base Metal Frame Assembly (Set of 4)",
    hardware: ["16x Cıvata M6x45 (-3)", "16x Somun M6 (-4)"],
    components: ["2x Yan Profil (-21, -22)", "2x Baş/Ayak Profil", "1x Orta Destek Profili", "4x Köşe Bağlantı Sacı (-8)"],
    descriptionTr: "Metal baza çevre profilleri ve orta destek rayı köşe bağlantı sacları ile birleştirilerek cıvata ve somunlarla sıkılır.",
    descriptionEn: "Assemble the rectangular perimeter steel frame and center spine using the four corner brackets, bolts, and nuts.",
    camera: {
      position: [1.8, 1.4, 2.0],
      target: [0, 0.5, 0],
    },
  },
  {
    step: 3,
    titleTr: "AŞAMA 3: Baş Ucu, Ayak Ucu ve Yan Tahta Montajı",
    titleEn: "Step 3: Head End, Foot End & Side Board Installation",
    hardware: ["32x Şapkalı Akıllı Vida 3.9x19 (-5)"],
    components: ["1x Baş Ucu Tahtası", "1x Ayak Ucu Tahtası", "2x Yan Tahta", "4x Dikey Köşe Köşebenti"],
    descriptionTr: "Döşemeli baş ucu, ayak ucu ve iki yan tahta 90 derece açıyla köşe bağlantı sacları üzerinden vidalanarak ahşap sandık gövde oluşturulur.",
    descriptionEn: "Join the headboard, footboard, and two side boards using corner vertical brackets to form the main wooden bed box.",
    camera: {
      position: [2.3, 1.5, 2.4],
      target: [0, 0.4, 0],
    },
  },
  {
    step: 4,
    titleTr: "AŞAMA 4: Baza Alt Bağlantı Montajı",
    titleEn: "Step 4: Base Bottom Connection Assembly",
    hardware: ["12x Şapkalı Akıllı Vida 3.9x19 (-5)"],
    components: ["3x Metal Alt Bağlantı Demiri (-M1)"],
    descriptionTr: "Üç adet metal alt bağlantı demiri sandık altından sıfır olacak şekilde yan tahtalara vidalanır.",
    descriptionEn: "Fasten the three metal bottom cross tie bars flush across the bottom of the wooden frame.",
    camera: {
      position: [1.9, 1.2, 1.8],
      target: [0, 0.25, 0],
    },
  },
  {
    step: 5,
    titleTr: "AŞAMA 5: Baza Stoperlerinin Montajı",
    titleEn: "Step 5: Installation of Bed Base Stoppers",
    hardware: ["8x Vida"],
    components: ["4x Baza Stoperi (-B1)"],
    descriptionTr: "Baza stoperleri yan tahtaların üst iç kenarlarına yerleştirilerek vidalanır, üst mekanizmanın düzgün oturması sağlanır.",
    descriptionEn: "Install the four bed base stopper brackets along the top interior edges of the side boards.",
    camera: {
      position: [1.5, 1.1, 1.5],
      target: [0, 0.4, 0],
    },
  },
  {
    step: 6,
    titleTr: "AŞAMA 6: Ayak Montajı",
    titleEn: "Step 6: Foot Assembly",
    hardware: ["24x Şapkalı Sunta Vidası 3.5x25 (-14)"],
    components: ["4x Üçgen Tabanlı Baza Ayağı"],
    descriptionTr: "Dört adet konik baza ayağı sandık alt köşelerine vidalanarak sağlam bir zemin desteği oluşturulur.",
    descriptionEn: "Mount the four tapered feet with triangular flanges onto the bottom four corners with screws.",
    camera: {
      position: [2.1, 0.7, 2.1],
      target: [0, 0.2, 0],
    },
  },
  {
    step: 7,
    titleTr: "AŞAMA 7: Bazanın İçerisine Zemin Matının Yerleşimi",
    titleEn: "Step 7: Placing the Floor Mat Inside the Bed Base",
    hardware: ["Aletsiz Geçme"],
    components: ["2x Taban Zemin Matı / Sunta"],
    descriptionTr: "İki parça zemin matı sandık içerisine alt bağlantı demirlerinin üzerine serilerek depolama tabanı tamamlanır.",
    descriptionEn: "Lower the two interior floor boards onto the cross tie bars to create the internal storage floor.",
    camera: {
      position: [1.6, 1.7, 1.8],
      target: [0, 0.35, 0],
    },
  },
  {
    step: 8,
    titleTr: "AŞAMA 8: Latanın Bazaya Montajı",
    titleEn: "Step 8: Mounting the Slats to the Bed Base",
    hardware: ["24x Plastik Lata Tutucu (-9)", "Vida (-5)"],
    components: ["12x Kavisli Ahşap Lata (L-1)", "1x Metal Üst İskelet"],
    descriptionTr: "12 adet esnek kavisli ahşap lata uçlarına plastik kılıflar takılarak metal iskelet profillerine sabitlenir.",
    descriptionEn: "Fit the 12 curved wooden slats into end caps and mount them across the upper metal frame.",
    camera: {
      position: [1.9, 1.4, 2.0],
      target: [0, 0.55, 0],
    },
  },
  {
    step: 9,
    titleTr: "AŞAMA 9: Baza Bariyer ve Makasın Montajı",
    titleEn: "Step 9: Installation of Bed Base Barrier and Mechanism",
    hardware: ["8x Cıvata M8x20 (T-23)", "2x Cıvata M8x30 (T-24)", "Cıvata (-3)", "Vida (-14)"],
    components: ["2x Makas Mekanizması (T1-T2)", "2x Gazlı Amortisör Pistonu", "2x Yan Bariyer Çerçevesi (F1-F2)"],
    descriptionTr: "Açılır makas kolları, gazlı amortisörler ve bariyer korkulukları sandığın iç yan panellerine monte edilir.",
    descriptionEn: "Install the left and right scissor lift mechanisms, gas lift pistons with safety locks, and side barrier frames.",
    camera: {
      position: [1.7, 1.1, 1.6],
      target: [0, 0.45, 0],
    },
  },
  {
    step: 10,
    titleTr: "AŞAMA 10: Köşe Tutucuların Montajı",
    titleEn: "Step 10: Assembling Mattress Corner Retainers",
    hardware: ["Geçmeli Tel Pim"],
    components: ["2x Yatak Tutucu Köşe Teli (-E1)"],
    descriptionTr: "Yatak açıldığında kaymasını engelleyen U formlu yatak tutucu teller latanın köşe yuvalarına takılır.",
    descriptionEn: "Insert the mattress retainer wire loops into the corner sockets of the slatted frame to keep the mattress secure.",
    camera: {
      position: [1.3, 1.0, 1.5],
      target: [0, 0.5, 0.6],
    },
  },
  {
    step: 11,
    titleTr: "AŞAMA 11: Bazanın Bariyer ve Makas Kısmına Montajı",
    titleEn: "Step 11: Installation to Storage Bed Mechanism",
    hardware: ["4x Cıvata M6x60 (-7)", "4x Somun M6 (-4)"],
    components: ["1x Hazır Üst Lata Tablası", "2x Makas Üst Taşıyıcı Kolu"],
    descriptionTr: "Hazırlanan üst latalı çerçeve, açık konumdaki makas kollarına cıvata ve somunlarla bağlanarak hareketli sistem tamamlanır.",
    descriptionEn: "Mount the complete upper slatted deck onto the angled scissor mechanism arms using M6x60 bolts and nuts.",
    camera: {
      position: [2.3, 1.5, 2.5],
      target: [0, 0.6, 0],
    },
  },
  {
    step: 12,
    titleTr: "AŞAMA 12: Bazanın Bitmiş Görüntüsü",
    titleEn: "Step 12: The Finished Look of the Bed Base",
    hardware: ["Montaj Tamamlandı"],
    components: ["Tamamlanmış Tek Kişilik Yatay Baza"],
    descriptionTr: "Tüm montaj adımları tamamlandı. Gazlı amortisör destekli bazanız güvenli, sessiz ve geniş depolama hacmiyle kullanıma hazır.",
    descriptionEn: "Assembly complete. The single horizontal storage bed is fully operational with smooth gas-lift assist and expansive internal storage.",
    camera: {
      position: [2.5, 1.4, 2.8],
      target: [0, 0.45, 0],
    },
  },
];
