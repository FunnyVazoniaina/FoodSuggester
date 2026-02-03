import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Layout from "../components/Layout";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  /* ── données statiques ── */
  const steps = [
    {
      icon: "mdi:format-list-bulleted",
      title: "1. Listez vos ingrédients",
      description: "Entrez les ingrédients que vous avez dans votre cuisine.",
    },
    {
      icon: "mdi:restaurant",
      title: "2. Découvrez des recettes",
      description:
        "Obtenez des suggestions de recettes adaptées à vos ingrédients.",
    },
    {
      icon: "mdi:chef-hat",
      title: "3. Cuisinez et savourez",
      description: "Suivez la recette et profitez de votre délicieux repas !",
    },
  ];

  /* ── données fictives – panel gauche ── */
  const benefitsItem = {
    emoji: "🥑",
    name: "Avocat",
    points: [
      "Riches en graisses mono-insaturées — cardioprotecteur.",
      "Excellente source de fibres, vitamines K, E et C.",
      "Les antioxydants lutéine & zéaxanthine protègent les yeux.",
    ],
  };

  const tips = [
    {
      icon: "mdi:clock-outline",
      text: "Préparez vos ingrédients en avance (mise en place) pour cuisiner plus vite.",
    },
    {
      icon: "mdi:water-circle",
      text: "Boire un verre d'eau avant chaque repas aide la digestion.",
    },
    {
      icon: "mdi:colorize",
      text: "Plus votre assiette est colorée, plus elle est riche en nutriments.",
    },
  ];

  const suggestionDuJour = {
    title: "Salade Niçoise Express",
    time: "15 min",
    calories: "380 kcal",
    description:
      "Une version rapide & fraîche avec du thon, des œufs durs, haricots verts et une vinaigrette au miel maison.",
    ingredients: ["Thon", "Œufs", "Haricots verts", "Tomates", "Olives"],
  };

  /* ─────────────────────────────────────────── */
  return (
    <Layout>
      {/* ═══ CSS globaux ═══ */}
      <style>{`
        /* ── animations ── */
        @keyframes heroFadeUp {
          0%   { opacity:0; transform:translateY(24px); }
          100% { opacity:1; transform:translateY(0);    }
        }
        .hero-fade-up {
          opacity: 0;
          animation: heroFadeUp .7s cubic-bezier(.22,1,.36,1) forwards;
        }
        .hero-delay-1 { animation-delay: .10s; }
        .hero-delay-2 { animation-delay: .24s; }
        .hero-delay-3 { animation-delay: .40s; }

        @keyframes panelFadeUp {
          0%   { opacity:0; transform:translateY(18px); }
          100% { opacity:1; transform:translateY(0);    }
        }
        .panel-fade-up {
          opacity: 0;
          animation: panelFadeUp .6s cubic-bezier(.22,1,.36,1) forwards;
        }
        .panel-delay-1 { animation-delay: .18s; }
        .panel-delay-2 { animation-delay: .32s; }
        .panel-delay-3 { animation-delay: .46s; }

        /* ── gradient text ── */
        .gradient-text {
          background: linear-gradient(135deg,#FF6B35 0%,#E8472C 50%,#c2185b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── hero CTA button ── */
        .hero-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,#FF6B35,#E8472C);
          transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease;
        }
        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,107,53,.38);
        }
        .hero-btn::after {
          content:"";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,#ff8a5c,#FF6B35);
          opacity: 0;
          transition: opacity .3s ease;
        }
        .hero-btn:hover::after { opacity:1; }
        .hero-btn > span      { position:relative; z-index:1; }

        /* ── blobs décoratifs ── */
        .blob {
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        /* ── panel cards hover ── */
        .pcard {
          transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease;
        }
        .pcard:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(74,66,56,.12);
        }

        /* ── suggestion card (featured) hover ── */
        .scard {
          transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease;
        }
        .scard:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(255,107,53,.25);
        }

        /* ── mobile horizontal scroll (panel cards) ── */
        .mobile-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 8px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .mobile-scroll::-webkit-scrollbar { display:none; }
        .mobile-scroll > div             { flex: 0 0 260px; }
      `}</style>

      {/* ═══ STEPS ═══ */}
      <div className="bg-[#FFF5EB] px-4 py-12 rounded-xl mb-12">
        <h2 className="text-3xl font-semibold text-center text-[#4A4238] font-poppins mb-10">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center relative px-4"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 right-[-8%] w-[16%] h-[2px] bg-orange-200" />
              )}
              <div className="mb-4">
                <Icon
                  icon={s.icon}
                  width="64"
                  height="64"
                  className="text-[#FF6B35]"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#4A4238] font-poppins mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-[#4A4238]/80 font-poppins max-w-xs">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ZONE HERO + PANEL — wrapper commun ═══ */}
      <div className="relative mb-12 overflow-visible">
        {/* blobs atmosphériques (positionnés à droite) */}
        <div
          className="blob absolute"
          style={{
            width: 300,
            height: 300,
            background: "radial-gradient(circle,#ffe0cc 0%,transparent 70%)",
            top: "-50px",
            right: "-60px",
            opacity: 0.5,
          }}
        />
        <div
          className="blob absolute"
          style={{
            width: 190,
            height: 190,
            background: "radial-gradient(circle,#ffd6b8 0%,transparent 70%)",
            bottom: "-30px",
            right: "12%",
            opacity: 0.35,
          }}
        />

        {/* ─── DESKTOP & TABLET : grille [panel | hero] ─── */}
        <div className="hidden md:grid md:grid-cols-[5fr_7fr] gap-6 items-center relative z-10">
          {/* ── PANEL GAUCHE ── */}
          <div className="flex flex-col gap-4">
            {/* 1 — Bénéfices d'un aliment */}
            <div className="pcard panel-fade-up panel-delay-1 bg-white border border-[#ede5df] rounded-2xl p-5">
              {/* header row */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl leading-none">
                  {benefitsItem.emoji}
                </span>
                <div className="flex flex-col">
                  <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#2d6a4f] bg-[#e6f4ea] rounded-full px-2 py-0.5 w-fit">
                    Aliment vedette
                  </span>
                  <span className="text-sm font-bold text-[#4A4238] font-poppins mt-0.5">
                    {benefitsItem.name}
                  </span>
                </div>
              </div>
              {/* points */}
              <div className="flex flex-col gap-2">
                {benefitsItem.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-md bg-[#e6f4ea] flex items-center justify-center">
                      <Icon
                        icon="mdi:check"
                        width="11"
                        height="11"
                        className="text-[#2d6a4f]"
                      />
                    </span>
                    <p className="text-[0.78rem] text-[#6B5B4E] font-poppins leading-snug">
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Conseils alimentaires */}
            <div className="pcard panel-fade-up panel-delay-2 bg-white border border-[#ede5df] rounded-2xl p-5">
              {/* header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#fef3cd] flex items-center justify-center">
                  <Icon
                    icon="mdi:lightbulb-on"
                    width="14"
                    height="14"
                    className="text-[#d97706]"
                  />
                </div>
                <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#92400e] bg-[#fef3cd] rounded-full px-2 py-0.5">
                  Conseils
                </span>
              </div>
              {/* tips */}
              <div className="flex flex-col gap-2.5">
                {tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg bg-[#fff7ed] flex items-center justify-center">
                      <Icon
                        icon={t.icon}
                        width="12"
                        height="12"
                        className="text-[#d97706]"
                      />
                    </div>
                    <p className="text-[0.78rem] text-[#6B5B4E] font-poppins leading-snug">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 — Suggestion du jour (card mise en avant) */}
            <div
              className="scard panel-fade-up panel-delay-3 rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#fff5ee 0%,#ffe8d6 100%)",
                border: "1px solid #f5d5c0",
              }}
            >
              {/* accent circle décor */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FF6B35] opacity-[0.08]" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#E8472C] opacity-[0.06]" />

              {/* header */}
              <div className="relative z-10 flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#FF6B35] flex items-center justify-center">
                  <Icon
                    icon="mdi:star"
                    width="14"
                    height="14"
                    className="text-white"
                  />
                </div>
                <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#c2410c] bg-[#ffe0cc] rounded-full px-2 py-0.5">
                  Suggestion du jour
                </span>
              </div>

              {/* titre recette */}
              <h4 className="relative z-10 text-sm font-bold text-[#4A4238] font-poppins mb-1">
                {suggestionDuJour.title}
              </h4>

              {/* meta pills */}
              <div className="relative z-10 flex flex-wrap gap-1.5 mb-2">
                <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-[#A0522D] bg-white/60 rounded-full px-2 py-0.5">
                  <Icon icon="mdi:clock-outline" width="11" height="11" />{" "}
                  {suggestionDuJour.time}
                </span>
                <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-[#A0522D] bg-white/60 rounded-full px-2 py-0.5">
                  <Icon icon="mdi:fire" width="11" height="11" />{" "}
                  {suggestionDuJour.calories}
                </span>
              </div>

              {/* description */}
              <p className="relative z-10 text-[0.76rem] text-[#6B5B4E] font-poppins leading-snug mb-2.5">
                {suggestionDuJour.description}
              </p>

              {/* ingrédients */}
              <div className="relative z-10 flex flex-wrap gap-1.5">
                {suggestionDuJour.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-[0.68rem] font-semibold text-[#7c5a3c] bg-white/70 border border-[#f0d5c0] rounded-full px-2 py-0.5"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── HERO DROITE ── */}
          <div className="relative py-16 px-4">
            {/* arc décoratif */}
            <svg
              className="absolute top-2 left-1/2 -translate-x-1/2"
              width="160"
              height="34"
              viewBox="0 0 160 34"
              fill="none"
              style={{ opacity: 0.33 }}
            >
              <path
                d="M16 30 Q80 2 144 30"
                stroke="url(#arcG)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FF6B35" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10 text-center">
              {/* pill badge */}
              <div className="hero-fade-up hero-delay-1 inline-flex items-center gap-2 bg-[#fff0e5] border border-[#ffe0cc] rounded-full px-4 py-1.5 mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[#A0522D] text-sm font-semibold font-poppins tracking-wide">
                  Nouveau — Cuisinez smarter
                </span>
              </div>

              {/* titre */}
              <h1 className="hero-fade-up hero-delay-1 text-5xl lg:text-6xl font-bold font-poppins leading-tight mb-5">
                <span className="text-[#4A4238]">Food</span>{" "}
                <span className="gradient-text">Suggester</span>
              </h1>

              {/* sous-titre */}
              <p className="hero-fade-up hero-delay-2 text-base lg:text-lg text-[#6B5B4E] font-poppins leading-relaxed max-w-md mx-auto mb-8">
                Trouvez des recettes délicieuses avec les ingrédients que vous
                avez déjà dans votre cuisine — sans perdre de temps.
              </p>

              {/* CTA */}
              <div className="hero-fade-up hero-delay-3">
                <button
                  onClick={() => navigate("/search")}
                  className="hero-btn inline-flex items-center gap-2.5 text-white px-7 py-3.5 rounded-full font-semibold font-poppins text-base tracking-wide"
                >
                  <span>
                    <Icon icon="mdi:magnify" width="20" height="20" />
                  </span>
                  <span>Commencer à chercher</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MOBILE (<md) : hero puis cards scroll horizontal ─── */}
        <div className="md:hidden relative z-10">
          {/* hero mobile — centré, compact */}
          <div className="text-center py-10 px-4">
            <div className="hero-fade-up hero-delay-1 inline-flex items-center gap-2 bg-[#fff0e5] border border-[#ffe0cc] rounded-full px-3 py-1 mb-5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[#A0522D] text-xs font-semibold font-poppins tracking-wide">
                Nouveau — Cuisinez smarter
              </span>
            </div>

            <h1 className="hero-fade-up hero-delay-1 text-4xl font-bold font-poppins leading-tight mb-4">
              <span className="text-[#4A4238]">Food</span>{" "}
              <span className="gradient-text">Suggester</span>
            </h1>

            <p className="hero-fade-up hero-delay-2 text-sm text-[#6B5B4E] font-poppins leading-relaxed max-w-xs mx-auto mb-6">
              Trouvez des recettes délicieuses avec les ingrédients que vous
              avez déjà — sans perdre de temps.
            </p>

            <div className="hero-fade-up hero-delay-3">
              <button
                onClick={() => navigate("/search")}
                className="hero-btn inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold font-poppins text-sm tracking-wide"
              >
                <span>
                  <Icon icon="mdi:magnify" width="18" height="18" />
                </span>
                <span>Commencer à chercher</span>
              </button>
            </div>
          </div>

          {/* label + scroll horizontal des 3 cards */}
          <div className="px-4">
            <p className="text-[0.72rem] font-bold uppercase tracking-widest text-[#9a8578] mb-2.5 px-0.5">
              Découvrez aussi →
            </p>
            <div className="mobile-scroll">
              {/* card 1 — Bénéfices */}
              <div className="pcard panel-fade-up panel-delay-1 bg-white border border-[#ede5df] rounded-2xl p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xl leading-none">
                    {benefitsItem.emoji}
                  </span>
                  <div>
                    <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#2d6a4f] bg-[#e6f4ea] rounded-full px-2 py-0.5 inline-block">
                      Aliment vedette
                    </span>
                    <p className="text-xs font-bold text-[#4A4238] font-poppins mt-0.5">
                      {benefitsItem.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {benefitsItem.points.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-md bg-[#e6f4ea] flex items-center justify-center">
                        <Icon
                          icon="mdi:check"
                          width="10"
                          height="10"
                          className="text-[#2d6a4f]"
                        />
                      </span>
                      <p className="text-[0.73rem] text-[#6B5B4E] font-poppins leading-snug">
                        {p}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* card 2 — Conseils */}
              <div className="pcard panel-fade-up panel-delay-2 bg-white border border-[#ede5df] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-lg bg-[#fef3cd] flex items-center justify-center">
                    <Icon
                      icon="mdi:lightbulb-on"
                      width="13"
                      height="13"
                      className="text-[#d97706]"
                    />
                  </div>
                  <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#92400e] bg-[#fef3cd] rounded-full px-2 py-0.5">
                    Conseils
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {tips.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-lg bg-[#fff7ed] flex items-center justify-center">
                        <Icon
                          icon={t.icon}
                          width="11"
                          height="11"
                          className="text-[#d97706]"
                        />
                      </div>
                      <p className="text-[0.73rem] text-[#6B5B4E] font-poppins leading-snug">
                        {t.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* card 3 — Suggestion du jour */}
              <div
                className="scard panel-fade-up panel-delay-3 rounded-2xl p-4 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#fff5ee 0%,#ffe8d6 100%)",
                  border: "1px solid #f5d5c0",
                }}
              >
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-[#FF6B35] opacity-[0.08]" />
                <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full bg-[#E8472C] opacity-[0.06]" />

                <div className="relative z-10 flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-lg bg-[#FF6B35] flex items-center justify-center">
                    <Icon
                      icon="mdi:star"
                      width="13"
                      height="13"
                      className="text-white"
                    />
                  </div>
                  <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#c2410c] bg-[#ffe0cc] rounded-full px-2 py-0.5">
                    Suggestion du jour
                  </span>
                </div>
                <h4 className="relative z-10 text-xs font-bold text-[#4A4238] font-poppins mb-1">
                  {suggestionDuJour.title}
                </h4>
                <div className="relative z-10 flex flex-wrap gap-1 mb-2">
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-[#A0522D] bg-white/60 rounded-full px-1.5 py-0.5">
                    <Icon icon="mdi:clock-outline" width="10" height="10" />{" "}
                    {suggestionDuJour.time}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-[#A0522D] bg-white/60 rounded-full px-1.5 py-0.5">
                    <Icon icon="mdi:fire" width="10" height="10" />{" "}
                    {suggestionDuJour.calories}
                  </span>
                </div>
                <p className="relative z-10 text-[0.72rem] text-[#6B5B4E] font-poppins leading-snug mb-2">
                  {suggestionDuJour.description}
                </p>
                <div className="relative z-10 flex flex-wrap gap-1">
                  {suggestionDuJour.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[0.63rem] font-semibold text-[#7c5a3c] bg-white/70 border border-[#f0d5c0] rounded-full px-1.5 py-0.5"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
