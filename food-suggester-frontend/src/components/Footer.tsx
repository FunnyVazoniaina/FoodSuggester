const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200/50 text-gray-600 py-5 mt-auto flex justify-center">
      <div className="max-w-6xl text-center text-xs">
        © {new Date().getFullYear()} Food Suggester - FunnyVazoniaina
      </div>
    </footer>
  );
};

export default Footer;
