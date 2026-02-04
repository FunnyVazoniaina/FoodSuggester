import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import { DailySuggestionsCard } from "../components/DailySuggestionsCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = [
    { type: "aliment", icon: "mdi:leaf", title: "Aliment vedette" },
    { type: "conseil", icon: "mdi:lightbulb", title: "Conseil du jour" },
    { type: "suggestion", icon: "mdi:chef-hat", title: "Suggestion du jour" },
  ];

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <>
      <Layout>
        <style>{`
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

        .gradient-text {
          background: linear-gradient(135deg,#FF6B35 0%,#E8472C 50%,#c2185b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

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
        .hero-btn > span { position:relative; z-index:1; }

        .blob {
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }
      `}</style>

        <div className="relative mb-16 overflow-visible">
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

          <div className="relative z-10 py-16 px-4 text-center">
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

            <div className="relative z-10">
              <div className="hero-fade-up hero-delay-1 inline-flex items-center gap-2 bg-[#fff0e5] border border-[#ffe0cc] rounded-full px-4 py-1.5 mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[#A0522D] text-sm font-semibold font-poppins tracking-wide">
                  Nouveau — Cuisinez smarter
                </span>
              </div>

              <h1 className="hero-fade-up hero-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight mb-5">
                <span className="text-[#4A4238]">Food</span>{" "}
                <span className="gradient-text">Suggester</span>
              </h1>

              <p className="hero-fade-up hero-delay-2 text-sm md:text-base lg:text-lg text-[#6B5B4E] font-poppins leading-relaxed max-w-md mx-auto mb-8">
                Trouvez des recettes délicieuses avec les ingrédients que vous
                avez déjà dans votre cuisine — sans perdre de temps.
              </p>

              <div className="hero-fade-up hero-delay-3">
                <button
                  onClick={() => navigate("/search")}
                  className="hero-btn inline-flex items-center gap-2.5 text-white px-6 md:px-7 py-3 md:py-3.5 rounded-full font-semibold font-poppins text-sm md:text-base tracking-wide"
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

        <div className="px-4 py-2 md:py-6 mb-6 md:mb-12">
          <h2 className="text-3xl font-semibold text-center text-[#4A4238] font-poppins mb-8 md:mb-10">
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

        <div className="px-4 mb-12">
          <h3 className="text-2xl font-semibold text-[#4A4238] font-poppins mb-6 text-center md:text-left">
            Découvertes du jour
          </h3>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="relative w-full h-96 bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Carousel Content */}
              <div className="relative w-full h-full">
                {carouselItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-500 ${
                      idx === carouselIndex
                        ? "opacity-100 translate-x-0"
                        : idx < carouselIndex
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                  >
                    <div className="h-full p-4 sm:p-6 flex flex-col items-center justify-center">
                      <DailySuggestionsCard
                        type={item.type as "aliment" | "conseil" | "suggestion"}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {carouselItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === carouselIndex
                        ? "bg-[#FF6B35] w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Carousel Arrows */}
              <button
                onClick={() =>
                  setCarouselIndex(
                    (prev) =>
                      (prev - 1 + carouselItems.length) % carouselItems.length,
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all"
              >
                <Icon
                  icon="mdi:chevron-left"
                  className="w-6 h-6 text-[#FF6B35]"
                />
              </button>
              <button
                onClick={() =>
                  setCarouselIndex((prev) => (prev + 1) % carouselItems.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all"
              >
                <Icon
                  icon="mdi:chevron-right"
                  className="w-6 h-6 text-[#FF6B35]"
                />
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default HomePage;
