import { Calendar, Compass, Star, MapPin } from 'lucide-react';
import { HERO_IMAGE } from '../data/staticData';
import { useCustomizer } from '../context/CustomizerContext';
import PatternBackground from './PatternBackground';
import { EditableText, EditableImage } from './Editable';

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onBookClick, onExploreClick }: HeroProps) {
  const { siteSettings, updateSiteSettings } = useCustomizer();

  return (
    <section
      id="home"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-warm-bg overflow-hidden border-b border-warm-border/50"
    >
      {/* Pattern background */}
      <PatternBackground />

      {/* Decorative lines inspired by clean grid minimalism */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-slate-900"></div>
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-slate-900"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-slate-900"></div>
        <div className="absolute top-1/3 left-0 right-0 h-px bg-slate-900"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Welcoming Text Column */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-accent-gold-light text-accent-gold text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-warm-border">
              <Compass className="h-3.5 w-3.5 text-accent-gold animate-spin-slow" />
              <span>
                <EditableText
                  fieldKey="heroTitle"
                  label="Υπότιτλος Badge / Highlight"
                  value={siteSettings.heroTitle}
                  onSave={(val) => updateSiteSettings({ heroTitle: val })}
                />
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-light tracking-tight text-slate-800 leading-tight">
              <EditableText
                fieldKey="heroHeading"
                label="Κύριος Τίτλος Hero"
                value={siteSettings.heroHeading || "Where Salt Meets the Sweet Seaside Sun"}
                onSave={(val) => updateSiteSettings({ heroHeading: val })}
              />
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-xl">
              <EditableText
                fieldKey="heroSub"
                label="Περιγραφή Hero (Υπότιτλος)"
                value={siteSettings.heroSub}
                onSave={(val) => updateSiteSettings({ heroSub: val })}
                type="textarea"
              />
            </p>

            {/* Quick stats / Features */}
            <div className="grid grid-cols-2 gap-4 border-t border-warm-border pt-6 text-left">
              <div className="flex items-start space-x-2.5">
                <div className="p-2 bg-white rounded-lg border border-warm-border text-brand">
                  <Star className="h-5 w-5 fill-brand text-brand" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs">
                    <EditableText
                      fieldKey="heroStat1Title"
                      label="Τίτλος Στατιστικού 1"
                      value={siteSettings.heroStat1Title || "Renovated 2026"}
                      onSave={(val) => updateSiteSettings({ heroStat1Title: val })}
                    />
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    <EditableText
                      fieldKey="heroStat1Desc"
                      label="Περιγραφή Στατιστικού 1"
                      value={siteSettings.heroStat1Desc || "Premium modern feel"}
                      onSave={(val) => updateSiteSettings({ heroStat1Desc: val })}
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="p-2 bg-white rounded-lg border border-warm-border text-accent-gold">
                  <MapPin className="h-5 w-5 text-accent-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs font-sans">
                    <EditableText
                      fieldKey="heroStat2Title"
                      label="Τίτλος Στατιστικού 2"
                      value={siteSettings.heroStat2Title || "Sykia Beach Close"}
                      onSave={(val) => updateSiteSettings({ heroStat2Title: val })}
                    />
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    <EditableText
                      fieldKey="heroStat2Desc"
                      label="Περιγραφή Στατιστικού 2"
                      value={siteSettings.heroStat2Desc || "5 mins drive to water"}
                      onSave={(val) => updateSiteSettings({ heroStat2Desc: val })}
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                id="hero-book-now"
                onClick={onBookClick}
                className="inline-flex items-center justify-center space-x-2 bg-brand hover:bg-brand-dark text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Your Stay</span>
              </button>
              
              <button
                id="hero-explore-rooms"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center bg-white hover:bg-warm-bg text-brand text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full border border-warm-border shadow-sm transition-colors cursor-pointer"
              >
                <span>Explore Rooms</span>
              </button>
            </div>
          </div>

          {/* Photo Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Photo Card */}
              <div className="bg-white p-3 rounded-2xl shadow-md border border-warm-border transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <EditableImage
                  fieldKey="heroImage"
                  label="Hero Φωτογραφία Εξωτερικού"
                  src={siteSettings.heroImage || HERO_IMAGE}
                  onSave={(val) => updateSiteSettings({ heroImage: val })}
                  className="rounded-xl w-full h-[320px] sm:h-[400px] object-cover filter brightness-[0.98]"
                  alt="Salt & Sea Rooms Exterior and Aegean Horizon"
                  referrerPolicy="no-referrer"
                  animatePan={true}
                />
                <div className="pt-4 pb-2 px-2 flex justify-between items-center bg-white">
                  <div>
                    <span className="font-serif font-medium text-slate-800 text-lg uppercase tracking-wide">
                      <EditableText
                        fieldKey="siteName"
                        label="Όνομα Καταλύματος"
                        value={siteSettings.siteName}
                        onSave={(val) => updateSiteSettings({ siteName: val })}
                      />
                    </span>
                    <span className="block text-[11px] text-brand font-medium tracking-wider uppercase">Sarti-Sykia Pass, Halkidiki</span>
                  </div>
                  <div className="bg-accent-gold-light text-accent-gold text-[10px] font-bold px-2.5 py-1.5 rounded uppercase tracking-wider border border-warm-border font-sans">
                    ★ 5.0 Rating
                  </div>
                </div>
              </div>

              {/* Float Badge 1 */}
              <div className="absolute top-6 -left-6 bg-white px-4 py-2.5 rounded-lg shadow-sm border border-warm-border flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 font-sans">
                  <EditableText
                    fieldKey="heroGatedBadge"
                    label="Κείμενο Κουμπιού/Badge Κρατήσεων"
                    value={siteSettings.heroGatedBadge || "Summer 2026 Reservation Open"}
                    onSave={(val) => updateSiteSettings({ heroGatedBadge: val })}
                  />
                </span>
              </div>

              {/* Float Badge 2 */}
              <div className="absolute -bottom-6 -right-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-warm-border flex flex-col items-center">
                <span className="text-xl font-light font-serif text-brand">
                  <EditableText
                    fieldKey="heroBadgeAreaValue"
                    label="Τιμή Badge"
                    value={siteSettings.heroBadgeAreaValue || "4,000m²"}
                    onSave={(val) => updateSiteSettings({ heroBadgeAreaValue: val })}
                  />
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest font-sans">
                  <EditableText
                    fieldKey="heroBadgeAreaLabel"
                    label="Λεκτικό Badge"
                    value={siteSettings.heroBadgeAreaLabel || "Private Garden"}
                    onSave={(val) => updateSiteSettings({ heroBadgeAreaLabel: val })}
                  />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
