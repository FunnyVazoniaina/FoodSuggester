import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Fonction pour naviguer vers les pages d'auth
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: 'mdi:chef-hat',
      title: 'IA Culinaire',
      description: 'Notre intelligence artificielle analyse vos ingrédients et vous propose des recettes personnalisées en quelques secondes.'
    },
    {
      icon: 'mdi:clock-fast',
      title: 'Économisez du temps',
      description: 'Plus besoin de chercher pendant des heures. Trouvez instantanément des recettes avec ce que vous avez sous la main.'
    },
    {
      icon: 'mdi:leaf',
      title: 'Réduisez le gaspillage',
      description: 'Transformez vos restes en délicieux repas et contribuez à un mode de vie plus durable.'
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      text: "Grâce à Food Suggester, je n'achète plus de nourriture que je n'utilise pas. C'est révolutionnaire !",
      rating: 5
    },
    {
      name: "Thomas K.",
      text: "L'app m'a aidé à découvrir des recettes que je n'aurais jamais pensé à faire. Mes enfants adorent !",
      rating: 5
    },
    {
      name: "Sophie M.",
      text: "Interface intuitive et suggestions pertinentes. Je recommande vivement cette application.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Recettes suggérées" },
    { number: "15K+", label: "Utilisateurs satisfaits" },
    { number: "89%", label: "Réduction du gaspillage" },
    { number: "4.8/5", label: "Note moyenne" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0E5] via-[#fff5eb] to-[#FFF8F1] overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-2xl flex items-center justify-center shadow-lg">
              <Icon icon="mdi:chef-hat" className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#A0522D] font-serif">Food Suggester</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[#4A4238] hover:text-[#FF6B35] transition-colors font-medium">Fonctionnalités</a>
            <a href="#testimonials" className="text-[#4A4238] hover:text-[#FF6B35] transition-colors font-medium">Témoignages</a>
            <button 
              onClick={() => handleNavigation('/login')}
              className="bg-[#FF6B35] hover:bg-[#E85826] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-[#A0522D] leading-tight">
                  <span className="font-serif italic">Cuisine</span>
                  <br />
                  <span className="font-sans">intelligente</span>
                </h1>
                <p className="text-xl text-[#4A4238] leading-relaxed font-light max-w-lg">
                  Transformez vos ingrédients en délicieuses recettes grâce à notre IA culinaire. 
                  <span className="font-medium text-[#FF6B35]"> Zéro gaspillage, 100% saveur.</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="group bg-[#FF6B35] hover:bg-[#E85826] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Icon icon="mdi:rocket-launch" className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Commencer gratuitement
                  </span>
                </button>
                <button className="group border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                onClick={() => window.open('https://www.youtube.com/watch?v=mr5f24gEuG0', '_blank')}
                >
                  <span className="flex items-center justify-center gap-3">
                    <Icon icon="mdi:play-circle" className="w-6 h-6" />
                    Voir la démo
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <Icon icon="mdi:account" className="w-6 h-6 text-white" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-[#A0522D]">15,000+ cuisiniers</p>
                  <p className="text-[#4A4238]">nous font déjà confiance</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-square bg-gradient-to-br from-[#FFF0E5] to-[#fff5eb] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="mdi:food" className="w-24 h-24 text-[#FF6B35]" />
                </div>
                <h3 className="text-2xl font-bold text-[#A0522D] mb-3 font-serif">Recette du jour</h3>
                <p className="text-[#4A4238] mb-4">Spaghetti aux tomates cerises et basilic</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#FF6B35] font-semibold">15 min</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon="mdi:star" className="w-4 h-4 text-[#FF6B35]" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#FF6B35] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#E85826] rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-gradient-to-r from-[#FFF8F1] to-[#FFF0E5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#A0522D] mb-6 font-serif italic">
              Pourquoi choisir Food Suggester ?
            </h2>
            <p className="text-xl text-[#4A4238] max-w-3xl mx-auto leading-relaxed">
              Une expérience culinaire révolutionnaire qui transforme votre façon de cuisiner au quotidien
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-[#FFF0E5]">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon icon={feature.icon} className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#A0522D] mb-4 font-serif">{feature.title}</h3>
                <p className="text-[#4A4238] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#A0522D] mb-4 font-serif italic">En chiffres</h2>
          <p className="text-[#4A4238] text-xl mb-12 max-w-2xl mx-auto">
            Rejoignez une communauté grandissante de passionnés de cuisine
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#FFF0E5]">
                  <div className="text-4xl lg:text-5xl font-bold text-[#FF6B35] mb-2 font-serif">
                    {stat.number}
                  </div>
                  <div className="text-[#4A4238] font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 bg-gradient-to-r from-[#FFF0E5] to-[#fff5eb]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#A0522D] mb-16 font-serif italic">
            Ce que disent nos utilisateurs
          </h2>
          
          <div className="relative">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-[#FFF0E5] transform transition-all duration-500">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Icon key={i} icon="mdi:star" className="w-8 h-8 text-[#FF6B35] mx-1" />
                ))}
              </div>
              <blockquote className="text-2xl text-[#4A4238] mb-8 font-light italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <cite className="text-[#FF6B35] font-bold text-xl not-italic font-serif">
                — {testimonials[currentTestimonial].name}
              </cite>
            </div>
            
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-[#FF6B35] scale-125' : 'bg-[#FF6B35]/30 hover:bg-[#FF6B35]/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#A0522D] mb-6 font-serif italic">
              Simple comme bonjour
            </h2>
            <p className="text-xl text-[#4A4238] max-w-2xl mx-auto">
              Trois étapes suffisent pour transformer vos ingrédients en festin
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: 'mdi:format-list-bulleted', title: 'Listez', desc: 'Entrez simplement les ingrédients disponibles dans votre frigo' },
              { icon: 'mdi:magic-staff', title: 'Découvrez', desc: 'Notre IA génère instantanément des recettes personnalisées' },
              { icon: 'mdi:heart', title: 'Savourez', desc: 'Cuisinez et dégustez des plats délicieux en famille' }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Icon icon={step.icon} className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#A0522D] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#A0522D] mb-4 font-serif">{step.title}</h3>
                <p className="text-[#4A4238] leading-relaxed text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-[#A0522D] to-[#8B4513] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 font-serif italic">
            Prêt à révolutionner
            <br />
            votre cuisine ?
          </h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Rejoignez des milliers de cuisiniers qui ont déjà transformé leur façon de cuisiner. 
            Commencez votre aventure culinaire dès aujourd'hui.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => handleNavigation('/register')}
              className="group bg-white text-[#A0522D] px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Icon icon="mdi:chef-hat" className="w-7 h-7 group-hover:bounce" />
                Créer mon compte
              </span>
            </button>
            
            <div className="flex items-center gap-3 text-white/80">
              <Icon icon="mdi:check-circle" className="w-5 h-5" />
              <span className="font-medium">Gratuit • Sans engagement • 2 min d'inscription</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A4238] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-xl flex items-center justify-center">
                <Icon icon="mdi:chef-hat" className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-serif">Food Suggester</span>
            </div>
            <p className="text-white/70 leading-relaxed max-w-md">
              L'application qui transforme vos ingrédients en inspiration culinaire. 
              Cuisinez malin, savourez mieux.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-[#FF6B35]">Produit</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-[#FF6B35]">Support</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Aide</a></li>
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 mb-4 md:mb-0">
            © 2025 Food Suggester. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors">
              <Icon icon="mdi:facebook" className="w-6 h-6" />
            </a>
            <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors">
              <Icon icon="mdi:twitter" className="w-6 h-6" />
            </a>
            <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors">
              <Icon icon="mdi:instagram" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;