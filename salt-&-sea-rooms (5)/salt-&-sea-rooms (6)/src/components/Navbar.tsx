import { useState, useEffect } from 'react';
import { Waves, Menu, X, Calendar } from 'lucide-react';
import { useCustomizer } from '../context/CustomizerContext';
import { EditableText } from './Editable';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sections, siteSettings, updateSiteSettings } = useCustomizer();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = sections
    .filter((sec) => sec.visible)
    .map((sec) => ({
      label: sec.label,
      id: sec.id,
    }));

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-warm-border py-3'
          : 'bg-warm-bg/90 backdrop-blur-sm py-4 border-b border-warm-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="logo"
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleItemClick('home')}
          >
            <div className="p-2 bg-brand-light rounded-full text-brand transition-transform group-hover:rotate-12 duration-300">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-medium tracking-tight text-slate-800 uppercase block">
                <EditableText
                  fieldKey="siteName"
                  label="Όνομα Καταλύματος"
                  value={siteSettings.siteName || 'Salt & Sea Rooms'}
                  onSave={(val) => updateSiteSettings({ siteName: val })}
                />
              </span>
              <span className="block text-[9px] tracking-widest uppercase font-sans font-semibold text-brand">
                Halkidiki Greece
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-xs font-medium uppercase tracking-widest transition-colors hover:text-brand cursor-pointer ${
                  activeSection === item.id ? 'text-brand font-bold border-b-2 border-brand/40 pb-1' : 'text-slate-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Book Now Button Desktop */}
          <div className="hidden md:block">
            <button
              id="header-booking-btn"
              onClick={() => handleItemClick('booking')}
              className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Now</span>
            </button>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-brand focus:outline-none p-1 pointer-events-auto"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-dropdown" className="md:hidden bg-white border-t border-warm-border mt-2 py-4 px-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-left py-2 px-3 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors ${
                  activeSection === item.id
                    ? 'bg-warm-bg text-brand'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <hr className="border-warm-border my-2" />
            <button
              id="mobile-booking-btn"
              onClick={() => handleItemClick('booking')}
              className="w-full flex items-center justify-center space-x-2 bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-widest text-xs py-3 px-5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Online</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
