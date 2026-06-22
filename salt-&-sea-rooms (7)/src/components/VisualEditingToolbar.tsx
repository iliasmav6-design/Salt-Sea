import React from 'react';
import { useCustomizer, BackgroundPatternType } from '../context/CustomizerContext';
import { 
  Sparkles, 
  Settings, 
  Grid, 
  Type, 
  Type as FontIcon, 
  Palette, 
  RefreshCw, 
  Eye, 
  Edit3,
  Check
} from 'lucide-react';

interface FontPreset {
  name: string;
  nameEl: string;
  sans: string;
  serif: string;
}

const fontPresets: FontPreset[] = [
  { name: 'Elegant Editorial', nameEl: 'Κλασικό Playfair & Inter', sans: 'Inter', serif: 'Playfair Display' },
  { name: 'Modern Sans', nameEl: 'Μοντέρνο Space Grotesk', sans: 'Space Grotesk', serif: 'Space Grotesk' },
  { name: 'Stately Palace', nameEl: 'Luxury Cinzel & Inter', sans: 'Inter', serif: 'Cinzel, Playfair Display' },
  { name: 'Warm Warmth', nameEl: 'Ζεστό Lora & Montserrat', sans: 'Montserrat, sans-serif', serif: 'Lora, serif' }
];

interface ColorPreset {
  name: string;
  nameEl: string;
  brandColor: string;
  brandLight: string;
  brandDark: string;
  warmBgColor: string;
  warmBorderColor: string;
  accentGoldColor: string;
}

const colorPresets: ColorPreset[] = [
  {
    name: 'Sithonia Olive',
    nameEl: 'Πράσινο Ελιάς',
    brandColor: '#4D7E7B',
    brandLight: '#A5D7D2',
    brandDark: '#3D6663',
    warmBgColor: '#FAF7F2',
    warmBorderColor: '#E6E0D5',
    accentGoldColor: '#8C7B65',
  },
  {
    name: 'Aegean Dream',
    nameEl: 'Μπλε Αιγαίου',
    brandColor: '#3D6E8A',
    brandLight: '#A4CDDB',
    brandDark: '#1F4A63',
    warmBgColor: '#FAF9F5',
    warmBorderColor: '#D9E6EB',
    accentGoldColor: '#CFAF7B',
  },
  {
    name: 'Clay Terracotta',
    nameEl: 'Τερακότα',
    brandColor: '#9E6751',
    brandLight: '#D9B4A0',
    brandDark: '#733F2B',
    warmBgColor: '#FBF9F1',
    warmBorderColor: '#EADEC9',
    accentGoldColor: '#A79277',
  },
  {
    name: 'Chios Mastic',
    nameEl: 'Μαστίχα Χίου',
    brandColor: '#5C8374',
    brandLight: '#9EC8B9',
    brandDark: '#1B4242',
    warmBgColor: '#FAF8F5',
    warmBorderColor: '#E2ECE9',
    accentGoldColor: '#C0A080',
  },
  {
    name: 'Luxurious Slate',
    nameEl: 'Μαύρο Slate',
    brandColor: '#1E293B',
    brandLight: '#94A3B8',
    brandDark: '#0F172A',
    warmBgColor: '#F8FAFC',
    warmBorderColor: '#E2E8F0',
    accentGoldColor: '#78350F',
  },
];

export default function VisualEditingToolbar() {
  const { 
    isEditingMode, 
    setIsEditingMode, 
    themeSettings, 
    updateThemeSettings, 
    resetAll 
  } = useCustomizer();

  const handleApplyPreset = (preset: ColorPreset) => {
    updateThemeSettings({
      brandColor: preset.brandColor,
      brandLight: preset.brandLight,
      brandDark: preset.brandDark,
      warmBgColor: preset.warmBgColor,
      warmBorderColor: preset.warmBorderColor,
      accentGoldColor: preset.accentGoldColor,
    });
  };

  const currentFontPreset = fontPresets.find(f => f.sans === themeSettings.sansFont && f.serif === themeSettings.serifFont) || fontPresets[0];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 py-3 shadow-lg font-sans text-xs flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
      {/* Brand & Left state Indicator */}
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-brand text-white rounded-lg animate-pulse">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="font-serif font-bold tracking-wide text-slate-150 text-[13px] uppercase">
            Salt & Sea ⚡ Live Builder
          </span>
          <div className="text-[10px] text-slate-400 capitalize flex items-center space-x-1">
            <span>Click elements to change details!</span>
          </div>
        </div>
      </div>

      {/* Center Controls (Editable Settings) */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 transition-all col-span-3">
        
        {/* Toggle Mode button */}
        <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1">
          <button
            onClick={() => setIsModeAndCancel(true)}
            className={`px-3 py-1.5 rounded-md font-bold uppercase text-[9px] tracking-widest flex items-center space-x-1 cursor-pointer transition-all ${
              isEditingMode 
                ? 'bg-brand text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Επεξεργασία (On)</span>
          </button>
          
          <button
            onClick={() => setIsModeAndCancel(false)}
            className={`px-3 py-1.5 rounded-md font-bold uppercase text-[9px] tracking-widest flex items-center space-x-1 cursor-pointer transition-all ${
              !isEditingMode 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Προεπισκόπηση (Eye)</span>
          </button>
        </div>

        {isEditingMode && (
          <>
            {/* Color Palette Presets Quick Dropdown or dot-buttons */}
            <div className="flex items-center space-x-1 bg-slate-950/40 px-2 py-1.5 rounded-lg border border-slate-800/80">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mr-2 hidden sm:inline">
                Χρώματα:
              </span>
              <div className="flex gap-1.5">
                {colorPresets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleApplyPreset(p)}
                    className={`h-4.5 w-4.5 rounded-full border cursor-pointer hover:scale-110 transition-transform ${
                      themeSettings.brandColor === p.brandColor ? 'border-white scale-105 shadow-md ring-2 ring-brand/30' : 'border-slate-600/50'
                    }`}
                    style={{ backgroundColor: p.brandColor }}
                    title={p.nameEl}
                  />
                ))}
              </div>
            </div>

            {/* Background Pattern list */}
            <div className="flex items-center space-x-1 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/80">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mr-2 hidden lg:inline">
                Σχέδια Φόντου:
              </span>
              <div className="flex gap-1">
                {(['dots', 'grid', 'waves', 'stripes', 'tiles', 'meander', 'clean'] as const).map((pat) => (
                  <button
                    key={pat}
                    onClick={() => updateThemeSettings({ selectedPattern: pat })}
                    className={`px-2 py-1 rounded text-[8px] font-extrabold uppercase tracking-widest cursor-pointer transition-colors ${
                      themeSettings.selectedPattern === pat
                        ? 'bg-brand text-white font-bold border border-brand/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Pairings Picker */}
            <div className="flex items-center space-x-1 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/80">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mr-2 hidden lg:inline">
                Γραμματοσειρές:
              </span>
              <select
                value={`${themeSettings.sansFont}-${themeSettings.serifFont}`}
                onChange={(e) => {
                  const [sans, serif] = e.target.value.split('-');
                  updateThemeSettings({ sansFont: sans, serifFont: serif });
                }}
                className="bg-slate-900 border border-slate-800 text-[10px] py-1 px-2 rounded focus:outline-none focus:border-brand font-sans text-slate-200"
              >
                {fontPresets.map((fPF) => (
                  <option key={`${fPF.sans}-${fPF.serif}`} value={`${fPF.sans}-${fPF.serif}`}>
                    {fPF.nameEl}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={resetAll}
          className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer flex items-center space-x-1 border border-slate-705 border-slate-700"
          title="Reset back to default styling and configurations"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Επαναφορά / Reset 🔄</span>
        </button>
      </div>
    </div>
  );

  function setIsModeAndCancel(mode: boolean) {
    if (!mode) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        window.location.href = url.pathname + url.search;
      }
    } else {
      setIsEditingMode(true);
    }
  }
}
