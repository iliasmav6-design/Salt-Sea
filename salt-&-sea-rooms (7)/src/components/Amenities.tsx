import { FlameKindling, Car, Trees, Sparkles, Check } from 'lucide-react';
import { GARDEN_IMAGE } from '../data/staticData';
import { useCustomizer } from '../context/CustomizerContext';
import { EditableText, EditableImage } from './Editable';

export default function Amenities() {
  const { siteSettings, updateSiteSettings } = useCustomizer();

  const highlights = [
    {
      icon: Trees,
      defaultTitle: '4,000 m² Giant Private Garden',
      defaultDesc: 'An expansive pesticide-free green lawn surrounded by mature olive trees, fragrant lavender beds, and wild thyme. Safe for children to play, run, and explore.',
      color: 'bg-warm-bg text-brand border-warm-border/70 hover:border-brand/40',
    },
    {
      icon: FlameKindling,
      defaultTitle: 'Traditional Outdoor Brick BBQ Area',
      defaultDesc: 'A custom masonry stone grill under a gorgeous ivory pergola. Includes a rustic solid wood dining table for unforgettable summer cookouts with the family.',
      color: 'bg-warm-bg text-brand border-warm-border/70 hover:border-brand/40',
    },
    {
      icon: Car,
      defaultTitle: 'Secure Complimentary Parking',
      defaultDesc: 'Worry-free double gates open up to an ample, shaded private parking lot inside the property. Completely free for all family vehicles.',
      color: 'bg-warm-bg text-brand border-warm-border/70 hover:border-brand/40',
    },
  ];

  const additionalAmenities = [
    'Private gated entrance with electronic safety lock',
    'Outdoor garden showers to rinse after the beach',
    'Premium wooden sun loungers under the olive trees',
    'Free high-speed garden-wide Wi-Fi connection',
    'Fragrant herb garden (guests can harvest rosemary & mint)',
    'Shaded reading benches in quiet lavender alcoves',
  ];

  return (
    <section
      id="amenities"
      className="py-24 bg-warm-bg/35 border-b border-warm-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand block mb-2 font-sans">
            <EditableText
              fieldKey="amenitiesSub"
              label="Υπότιτλος 'Παροχές'"
              value={siteSettings.amenitiesSub || "Space & Freedom"}
              onSave={(val) => updateSiteSettings({ amenitiesSub: val })}
            />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
            <EditableText
              fieldKey="amenitiesTitle"
              label="Κύριος Τίτλος 'Παροχές'"
              value={siteSettings.amenitiesTitle || "Our Estate Amenities"}
              onSave={(val) => updateSiteSettings({ amenitiesTitle: val })}
            />
          </h2>
          <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="text-slate-500 mt-4 font-sans text-xs sm:text-sm uppercase tracking-wider block">
            <EditableText
              fieldKey="amenitiesDesc"
              label="Περιγραφή Ενότητας Παροχών"
              value={siteSettings.amenitiesDesc || "Where freedom of space provides absolute rest. Discover our garden conveniences designed for long summer stays."}
              onSave={(val) => updateSiteSettings({ amenitiesDesc: val })}
              type="textarea"
            />
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Big Beautiful Image Card */}
          <div className="lg:col-span-6 relative pb-8 lg:pb-0">
            <div className="relative">
              {/* Highlight badge overlay */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded border border-warm-border flex items-center space-x-1.5 z-10 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent-gold fill-accent-gold" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 font-sans">
                  <EditableText
                    fieldKey="amenitiesLawnBadge"
                    label="Badge Πράσινης Έκτασης"
                    value={siteSettings.amenitiesLawnBadge || "Kids Love Our Lawn"}
                    onSave={(val) => updateSiteSettings({ amenitiesLawnBadge: val })}
                  />
                </span>
              </div>

              {/* Main Image */}
              <div className="rounded-xl overflow-hidden shadow-sm border border-warm-border p-2 bg-white">
                <EditableImage
                  fieldKey="amenityGardenImage"
                  label="Βασική Φωτογραφία Κήπου (Παροχές)"
                  src={siteSettings.amenityGardenImage || GARDEN_IMAGE}
                  onSave={(val) => updateSiteSettings({ amenityGardenImage: val })}
                  className="rounded-lg w-full h-[360px] object-cover filter brightness-[0.98]"
                  alt="4,000 square meter gardens and stone BBQ space at Salt & Sea Rooms"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Little info panel */}
              <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-lg shadow-md border border-warm-border p-5 text-left z-20">
                <h4 className="font-serif font-medium text-slate-800 text-sm uppercase tracking-wider">
                  <EditableText
                    fieldKey="amenitiesEstateTitle"
                    label="Τίτλος Πλαισίου Κήπου"
                    value={siteSettings.amenitiesEstateTitle || "Estate Freedom"}
                    onSave={(val) => updateSiteSettings({ amenitiesEstateTitle: val })}
                  />
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans block">
                  <EditableText
                    fieldKey="amenitiesEstateDesc"
                    label="Περιγραφή Πλαισίου Κήπου"
                    value={siteSettings.amenitiesEstateDesc || "With over 4,000 square meters of secure enclosed private land, you get a luxury of quiet space that standard central apartments cannot offer."}
                    onSave={(val) => updateSiteSettings({ amenitiesEstateDesc: val })}
                    type="textarea"
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Key listed boxes */}
          <div className="lg:col-span-6 space-y-6 pt-8 lg:pt-0 text-left">
            <div className="space-y-4">
              {highlights.map((hlt, idx) => (
                <div
                  key={idx}
                  id={`amenities-hlt-${idx}`}
                  className={`p-5 rounded-lg border flex gap-4 transition-all hover:-translate-y-0.5 ${hlt.color}`}
                >
                  <div className="pt-0.5 bg-white border border-warm-border/60 p-2.5 rounded-lg h-fit text-brand">
                    <hlt.icon className="h-5 w-5 shrink-0" />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="font-serif font-medium text-slate-800 text-base uppercase tracking-wide">
                      <EditableText
                        fieldKey={`amenityHltTitle${idx}`}
                        label={`Τίτλος Παροχής ${idx + 1}`}
                        value={siteSettings[`amenityHltTitle${idx}`] || hlt.defaultTitle}
                        onSave={(val) => updateSiteSettings({ [`amenityHltTitle${idx}`]: val })}
                      />
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed font-sans block">
                      <EditableText
                        fieldKey={`amenityHltDesc${idx}`}
                        label={`Περιγραφή Παροχής ${idx + 1}`}
                        value={siteSettings[`amenityHltDesc${idx}`] || hlt.defaultDesc}
                        onSave={(val) => updateSiteSettings({ [`amenityHltDesc${idx}`]: val })}
                        type="textarea"
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick checkmarks list */}
            <hr className="border-warm-border my-6" />
            
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 font-sans">
                <EditableText
                  fieldKey="amenitiesChecklistHeader"
                  label="Τίτλος Λίστας Παροχών"
                  value={siteSettings.amenitiesChecklistHeader || "More To Enjoy On-Site"}
                  onSave={(val) => updateSiteSettings({ amenitiesChecklistHeader: val })}
                />
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {additionalAmenities.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                    <Check className="h-4 w-4 text-brand shrink-0 animate-pulse" />
                    <span>
                      <EditableText
                        fieldKey={`amenityAdd${idx}`}
                        label={`Επιπλέον Παροχή ${idx + 1}`}
                        value={siteSettings[`amenityAdd${idx}`] || item}
                        onSave={(val) => updateSiteSettings({ [`amenityAdd${idx}`]: val })}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
