import React, { useState, useEffect } from 'react';
import { useCustomizer } from '../context/CustomizerContext';
import { X, Check, Image as ImageIcon, Sparkles, Smile, RefreshCw, Layers } from 'lucide-react';

const builtInImages = [
  {
    category: 'Δωμάτια / Interiors',
    images: [
      { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80', label: 'Premium Boho Linen' },
      { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80', label: 'Cycladic Minimalist Bed' },
      { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80', label: 'Beige Cozy Bedroom' },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', label: 'Deluxe Cozy Suite' },
      { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', label: 'Sea View Balcony Room' },
      { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80', label: 'Pastel Guest Room' }
    ]
  },
  {
    category: 'Παραλίες / Beaches & Sea',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', label: 'Halkidiki Golden Sand' },
      { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80', label: 'Sithonia Turquoise Cove' },
      { url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80', label: 'Aegean Seaside Pass' },
      { url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=80', label: 'Chania Blue Lagoon' }
    ]
  },
  {
    category: 'Κήπος / Garden & grounds',
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80', label: 'Greek Olive Trees Garden' },
      { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80', label: 'Shady Grass Lawn' },
      { url: 'https://images.unsplash.com/photo-1621259182978-f09e5e2b091f?auto=format&fit=crop&w=1000&q=80', label: 'Rustic BBQ Pergola' },
      { url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80', label: 'Lavender Fields & Thyme' }
    ]
  }
];

export default function VisualEditorModal() {
  const { selectedEditElement, setSelectedEditElement } = useCustomizer();
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (selectedEditElement) {
      setNewValue(selectedEditElement.value);
    }
  }, [selectedEditElement]);

  if (!selectedEditElement) return null;

  const handleSave = () => {
    selectedEditElement.onSave(newValue);
    setSelectedEditElement(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedEditElement(null)}
      />

      {/* Dialog body */}
      <div className="bg-white rounded-2xl shadow-2xl border border-warm-border w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[85vh] animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-warm-border/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-brand-light" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-150">
                Ζωντανή Επεξεργασία / Visual Editor
              </h3>
              <p className="text-[10px] text-slate-400 font-mono capitalize">
                Editing: {selectedEditElement.label}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedEditElement(null)}
            className="p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer text-slate-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content Workspace */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          
          <div className="bg-warm-bg/40 p-3.5 rounded-lg border border-warm-border border-dashed text-xs text-slate-600 leading-relaxed mb-2">
            💡 <strong>Greek / English Supported:</strong> Μπορείτε να πληκτρολογήσετε στην ελληνική ή αγγλική γλώσσα. Οι αλλαγές αποθηκεύονται αμέσως και εμφανίζονται ζωντανά στη σελίδα!
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
              {selectedEditElement.label}
            </label>

            {/* Render input based on edit field type */}
            {selectedEditElement.type === 'text' && (
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full text-sm p-3 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 shadow-2xs"
                placeholder={selectedEditElement.placeholder || 'Type text here...'}
                autoFocus
              />
            )}

            {selectedEditElement.type === 'textarea' && (
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                rows={5}
                className="w-full text-sm p-3 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 shadow-2xs leading-relaxed"
                placeholder={selectedEditElement.placeholder || 'Type long paragraph here...'}
                autoFocus
              />
            )}

            {selectedEditElement.type === 'image' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="p-2.5 bg-slate-100 rounded text-slate-650 flex items-center justify-center shrink-0 border border-warm-border">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full text-xs p-2 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-mono text-slate-800 shadow-2xs text-ellipsis"
                    placeholder="Enter Custom Photo URL here..."
                  />
                </div>

                {/* Built-in high quality greek image picker */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block border-b border-warm-border pb-1">
                    Επιλογή από Premium Φωτογραφίες / Presets Grid
                  </span>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {builtInImages.map((categoryObj) => (
                      <div key={categoryObj.category} className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-wide">
                          {categoryObj.category}
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {categoryObj.images.map((img) => (
                            <button
                              key={img.url}
                              onClick={() => setNewValue(img.url)}
                              className={`p-1 rounded-lg border text-left cursor-pointer transition-all duration-150 overflow-hidden relative group/btn ${
                                newValue === img.url 
                                  ? 'border-brand bg-brand/5 scale-95 shadow-inner' 
                                  : 'border-warm-border hover:border-brand/40 bg-white'
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={img.label}
                                className="h-14 w-full object-cover rounded"
                              />
                              <span className="block text-[8px] mt-1 text-slate-600 text-center truncate italic font-medium">
                                {img.label}
                              </span>
                              {newValue === img.url && (
                                <span className="absolute top-2 right-2 bg-brand text-white p-0.5 rounded-full shadow-xs">
                                  <Check className="h-2 w-2" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-warm-border/50 flex items-center justify-end space-x-3">
          <button
            onClick={() => setSelectedEditElement(null)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 bg-transparent cursor-pointer transition-colors"
          >
            Ακυρο / Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors shadow-sm flex items-center space-x-1"
          >
            <Check className="h-4 w-4" />
            <span>Αποθηκευση / Save ✔</span>
          </button>
        </div>

      </div>
    </div>
  );
}
