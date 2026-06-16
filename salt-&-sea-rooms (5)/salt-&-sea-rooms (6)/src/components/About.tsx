import { Users, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useCustomizer } from '../context/CustomizerContext';
import { EditableText, EditableImage } from './Editable';

export default function About() {
  const { siteSettings, updateSiteSettings } = useCustomizer();

  return (
    <section
      id="who-we-are"
      className="relative py-24 bg-white border-b border-warm-border/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="block text-[10px] tracking-widest uppercase font-sans font-bold text-brand mb-2">Our Story</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
            WHO WE ARE
          </h2>
          <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="text-slate-500 mt-4 font-sans text-xs sm:text-sm uppercase tracking-wider block">
            <EditableText
              fieldKey="aboutSub"
              label="Υπότιτλος 'Η Ιστορία μας'"
              value={siteSettings.aboutSub}
              onSave={(val) => updateSiteSettings({ aboutSub: val })}
              type="textarea"
            />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Decorative visual block */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Overlapping images or stylized visual frame */}
              <div className="rounded-xl overflow-hidden shadow-sm border border-warm-border bg-warm-bg p-3">
                <EditableImage
                  fieldKey="gardenImage"
                  label="Βασική Φωτογραφία Κήπου / Περιβάλλοντος"
                  src={siteSettings.gardenImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"}
                  onSave={(val) => updateSiteSettings({ gardenImage: val })}
                  className="rounded-lg w-full h-[320px] object-cover filter brightness-[0.98]"
                  alt="Sunny Greek coastal sea of Halkidiki"
                  referrerPolicy="no-referrer"
                  animatePan={true}
                />
                <div className="mt-3 bg-white p-4 rounded-lg border border-warm-border/60 text-center">
                  <p className="font-serif italic text-slate-700 text-xs sm:text-sm">
                    "We wanted to build something peaceful, where children can play freely on the grass and couples can watch the stars under old olive trees."
                  </p>
                  <p className="text-[10px] text-brand font-bold uppercase tracking-widest mt-3">— Elias & Maria, Owners</p>
                </div>
              </div>

              {/* Little badge block */}
              <div className="absolute -top-3 -right-3 bg-brand text-white p-3 rounded-full shadow-sm z-20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Right: Story and Host introduction */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-slate-800 uppercase tracking-tight block">
              <EditableText
                fieldKey="aboutTitle"
                label="Κύριος Τίτλος Πληροφοριών"
                value={siteSettings.aboutTitle}
                onSave={(val) => updateSiteSettings({ aboutTitle: val })}
                type="text"
              />
            </h3>
            
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans block">
              <EditableText
                fieldKey="aboutContent1"
                label="Κείμενο Πληροφοριών (Παράγραφος 1)"
                value={siteSettings.aboutContent1}
                onSave={(val) => updateSiteSettings({ aboutContent1: val })}
                type="textarea"
              />
            </p>
            
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans block">
              <EditableText
                fieldKey="aboutContent2"
                label="Κείμενο Πληροφοριών (Παράγραφος 2)"
                value={siteSettings.aboutContent2}
                onSave={(val) => updateSiteSettings({ aboutContent2: val })}
                type="textarea"
              />
            </p>

            {/* Core Values / Features Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-warm-bg text-brand rounded-lg border border-warm-border">
                  <Users className="h-4.5 w-4.5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-slate-800 text-sm uppercase tracking-wide">Authentic Hospitality</h4>
                  <p className="text-xs text-slate-500 mt-1">Warm family management greeting you with smiles and local tips.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-warm-bg text-brand rounded-lg border border-warm-border">
                  <ShieldCheck className="h-4.5 w-4.5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-slate-800 text-sm uppercase tracking-wide">Renovated Standards (2026)</h4>
                  <p className="text-xs text-slate-500 mt-1">High-end TVs, comfortable posture-mattresses, and updated cookware.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-warm-bg text-brand rounded-lg border border-warm-border">
                  <Heart className="h-4.5 w-4.5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-slate-800 text-sm uppercase tracking-wide">Nature-First Ethos</h4>
                  <p className="text-xs text-slate-500 mt-1">4,000 square meters of pesticide-free gardens, grass yards, and herbs.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-warm-bg text-brand rounded-lg border border-warm-border">
                  <Sparkles className="h-4.5 w-4.5 text-brand" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-slate-800 text-sm uppercase tracking-wide">Perfect Seaside Blend</h4>
                  <p className="text-xs text-slate-500 mt-1">Close to the dynamic energy of Sarti, but fully peaceful at home.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
