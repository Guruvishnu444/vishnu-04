import { useTheme } from '../ThemeContext';

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer className={`relative border-t py-6 sm:py-8 px-4 sm:px-6 transition-colors ${
      dark ? 'border-white/10' : 'border-slate-200'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Copyright - Centered */}
        <div className="text-center">
          <p className={`text-[0.875rem] mb-2 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
            © {new Date().getFullYear()} Guruvishnu S. All Rights Reserved.<br />
            Fueled By Strong Coffee☕ and Big Ideas🪶
          </p>
        </div>
      </div>
    </footer>
  );
}
