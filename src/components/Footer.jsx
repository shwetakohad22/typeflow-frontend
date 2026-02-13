const Footer = () => {
  return (
    <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800 backdrop-blur-sm">
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
