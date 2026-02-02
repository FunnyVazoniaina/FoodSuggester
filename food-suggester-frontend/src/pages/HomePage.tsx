import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../components/Layout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'mdi:restaurant',
      title: 'Suggestions de recettes',
      description: 'Obtenez des suggestions de recettes basées sur les ingrédients que vous avez déjà.'
    },
    {
      icon: 'mdi:heart',
      title: 'Favoris',
      description: 'Enregistrez vos recettes préférées pour y accéder facilement plus tard.'
    },
    {
      icon: 'mdi:history',
      title: 'Historique de recherche',
      description: 'Consultez vos recherches précédentes pour retrouver facilement vos recettes.'
    },
    {
      icon: 'mdi:account',
      title: 'Profil personnalisé',
      description: 'Personnalisez votre expérience avec un profil utilisateur dédié.'
    }
  ];

  const steps = [
    {
      icon: 'mdi:format-list-bulleted',
      title: '1. Listez vos ingrédients',
      description: 'Entrez les ingrédients que vous avez dans votre cuisine.'
    },
    {
      icon: 'mdi:restaurant',
      title: '2. Découvrez des recettes',
      description: 'Obtenez des suggestions de recettes adaptées à vos ingrédients.'
    },
    {
      icon: 'mdi:chef-hat',
      title: '3. Cuisinez et savourez',
      description: 'Suivez la recette et profitez de votre délicieux repas !'
    }
  ];

  return (
    <Layout>
      {/* Hero section */}
      <div className="text-center py-12 px-4 md:px-8 bg-gradient-to-br from-[#FFF0E5] to-[#fff5eb] rounded-xl mb-12 relative shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-food.png')] bg-[length:200px] bg-center bg-no-repeat"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#A0522D] font-poppins mb-4">Food Suggester</h1>
          <p className="text-lg text-[#4A4238] font-medium font-poppins leading-relaxed mb-6">
            Trouvez des recettes délicieuses avec les ingrédients que vous avez déjà dans votre cuisine
          </p>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 border-2 border-[#FF6B35] text-[#FF6B35] hover:text-[#E85826] hover:border-[#E85826] hover:bg-[#fff3eb] px-6 py-3 rounded-lg font-semibold font-poppins transition"
          >
            <Icon icon="mdi:magnify" width="20" />
            Commencer à chercher
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-[#4A4238] font-poppins mb-10">Nos fonctionnalités</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-[#FFFCF7] rounded-2xl p-6 text-center shadow hover:-translate-y-2 transition transform border border-orange-100"
            >
              <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-[#fff0e5aa] rounded-full">
                <Icon icon={f.icon} width="36" height="36" className="text-[#FF6B35]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4A4238] font-poppins mb-2">{f.title}</h3>
              <p className="text-sm text-[#4A4238]/80 font-poppins leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps section */}
      <div className="bg-[#FFF5EB] px-4 py-12 rounded-xl mb-12">
        <h2 className="text-3xl font-semibold text-center text-[#4A4238] font-poppins mb-10">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center relative px-4">
              {/* Ligne de connexion entre les étapes (pour desktop uniquement) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 right-[-8%] w-[16%] h-[2px] bg-orange-200"></div>
              )}
              <div className="mb-4">
                <Icon icon={s.icon} width="64" height="64" className="text-[#FF6B35]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4A4238] font-poppins mb-2">{s.title}</h3>
              <p className="text-sm text-[#4A4238]/80 font-poppins max-w-xs">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
