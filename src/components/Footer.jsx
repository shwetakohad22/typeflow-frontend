const Footer = () => {
  return (
    <footer className="py-6 text-center text-gray-500 text-sm border-t border-white/5 backdrop-blur-md relative z-10">
      <p>&copy; {new Date().getFullYear()} TypeFlow. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:text-primary transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
