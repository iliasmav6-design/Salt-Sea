import { useState } from 'react';
import { MapPin, Navigation, Car, ShoppingBag, Landmark, Compass, Coffee } from 'lucide-react';
import { useCustomizer } from '../context/CustomizerContext';
import { EditableText } from './Editable';

export default function LocationNearby() {
  const { siteSettings, updateSiteSettings } = useCustomizer();
  const [selectedPin, setSelectedPin] = useState<string>('our-rooms');

  const locationsOfInterest = [
    {
      id: 'our-rooms',
      title: 'Salt & Sea Rooms',
      desc: 'Our property: a peaceful 4,000 m² olive sanctuary strategically positioned in the coastal pass.',
      distanceCar: '0 min',
      distanceWalk: '0 min',
      type: 'home',
    },
    {
      id: 'sykia-beach',
      title: 'Sykia Beach',
      desc: 'Beautiful golden sandy beach with taverns. Wide shore and very clean wind-protected bays.',
      distanceCar: '5 min (3 km)',
      distanceWalk: '30 min',
      type: 'beach',
    },
    {
      id: 'sarti-town',
      title: 'Sarti Center & Promenade',
      desc: 'Vibrant seaside town. Bustling supermarkets, traditional bakeries, souvenir shops, and high-energy restaurants.',
      distanceCar: '6 min (4 km)',
      distanceWalk: '45 min',
      type: 'town',
    },
    {
      id: 'orange-beach',
      title: 'Kavourotrypes (Orange Beach)',
      desc: 'Highly famous turquoise rock coves. Arguably the most exotic crystal-clear water in all Halkidiki.',
      distanceCar: '12 min (10 km)',
      distanceWalk: 'N/A',
      type: 'beach',
    },
  ];

  const nearbyPoints = [
    {
      category: 'Beaches',
      icon: Compass,
      places: [
        'Sykia Beach (5 mins) — Safe shallow waters, fine sand, beautiful beach bars.',
        'Sarti Beach (6 mins) — Long sandy bay facing the magnificent Mount Athos.',
        'Tourkolimnionas & Klimataria Beaches (10 mins) — Windless exotic turquoise lagoons.'
      ]
    },
    {
      category: 'Convenience',
      icon: ShoppingBag,
      places: [
        'Large Discount Supermarkets (5-6 mins) — Easily stock up on family groceries in Sarti.',
        'Local Bakery & Pastry Shop (2 mins) — Fresh hot Greek bougatsa and bread every morning.',
        'Pharmacy & Health Station (6 mins) — Located in center Sarti for absolute safety.'
      ]
    },
    {
      category: 'Dining & Cafés',
      icon: Coffee,
      places: [
        'Sarti Traditional Taverns (6 mins) — Fresh calamari, octopuses, and Greek moussaka.',
        'Sykia Local Butcher Houses (5 mins) — Famous for authentic grilled souvlaki blocks.',
        'Beach Bars & Coffee spots (5 mins) — Cold frappes, organic wines, and relaxing sunbeds.'
      ]
    }
  ];

  return (
    <section id="location" className="py-24 bg-white border-b border-warm-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 font-sans">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand block mb-2">
            <EditableText
              fieldKey="locSub"
              label="Υπότιτλος 'Τοποθεσία'"
              value={siteSettings.locSub || "The Perfect Base"}
              onSave={(val) => updateSiteSettings({ locSub: val })}
            />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
            <EditableText
              fieldKey="locTitle"
              label="Κύριος Τίτλος 'Τοποθεσία'"
              value={siteSettings.locTitle || "Our Location & Nearby Sarti"}
              onSave={(val) => updateSiteSettings({ locTitle: val })}
            />
          </h2>
          <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="text-slate-500 mt-4 font-sans text-xs sm:text-sm uppercase tracking-wider block">
            <EditableText
              fieldKey="locDesc"
              label="Περιγραφή Ενότητας Τοποθεσίας"
              value={siteSettings.locDesc || "Quiet and relaxing on-site, yet just moments away from the most magnificent sand and facilities."}
              onSave={(val) => updateSiteSettings({ locDesc: val })}
              type="textarea"
            />
          </p>
        </div>

        {/* Map and Info Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-20 font-sans" id="location-view">
          
          {/* Left: Pins and Distance Info Card */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 text-left">
            <div className="bg-white p-6 rounded-xl border border-warm-border shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-light text-slate-800 flex items-center space-x-2 uppercase tracking-wide">
                <MapPin className="h-4.5 w-4.5 text-brand" />
                <span>
                  <EditableText
                    fieldKey="locTimesHeader"
                    label="Τίτλος Πλαισίου Αποστάσεων"
                    value={siteSettings.locTimesHeader || "Travel Times"}
                    onSave={(val) => updateSiteSettings({ locTimesHeader: val })}
                  />
                </span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans block">
                <EditableText
                  fieldKey="locTimesDesc"
                  label="Περιγραφή Πλαισίου Αποστάσεων"
                  value={siteSettings.locTimesDesc || "Salt & Sea Rooms lies conveniently between the traditional settlement of Sykia and the lively coastal resort of Sarti. Tap any button to inspect."}
                  onSave={(val) => updateSiteSettings({ locTimesDesc: val })}
                  type="textarea"
                />
              </p>

              <div className="space-y-2 mt-4 font-sans" id="map-positions-list">
                {locationsOfInterest.map((pin) => {
                  const dynamicTitle = siteSettings[`locPinTitle_${pin.id}`] || pin.title;
                  const dynamicCar = siteSettings[`locPinQtyCar_${pin.id}`] || pin.distanceCar;
                  return (
                    <button
                      key={pin.id}
                      id={`pin-select-${pin.id}`}
                      onClick={() => setSelectedPin(pin.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        selectedPin === pin.id
                          ? 'border-brand bg-warm-bg text-brand font-medium'
                          : 'border-warm-border/60 hover:border-brand/40 text-slate-700 bg-slate-50/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={`h-2 w-2 rounded-full ${pin.type === 'home' ? 'bg-brand' : pin.type === 'beach' ? 'bg-brand-light' : 'bg-accent-gold'}`}></span>
                        <span className="text-xs font-bold uppercase tracking-wide">{dynamicTitle}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 shrink-0 font-sans">
                        <Car className="h-3.5 w-3.5 text-brand" />
                        <span>{dynamicCar}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Pin details */}
            {selectedPin && (
              <div id="pin-detail-bubble" className="bg-accent-gold-light/30 border border-warm-border p-5 rounded-lg animate-fadeIn text-left space-y-3">
                <h4 className="font-serif font-medium text-slate-800 text-sm sm:text-base uppercase tracking-wide">
                  <EditableText
                    fieldKey={`locPinTitle_${selectedPin}`}
                    label={`Τίτλος Σημείου: ${selectedPin}`}
                    value={siteSettings[`locPinTitle_${selectedPin}`] || locationsOfInterest.find(l => l.id === selectedPin)?.title || ""}
                    onSave={(val) => updateSiteSettings({ [`locPinTitle_${selectedPin}`]: val })}
                  />
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans block">
                  <EditableText
                    fieldKey={`locPinDesc_${selectedPin}`}
                    label={`Περιγραφή Σημείου: ${selectedPin}`}
                    value={siteSettings[`locPinDesc_${selectedPin}`] || locationsOfInterest.find(l => l.id === selectedPin)?.desc || ""}
                    onSave={(val) => updateSiteSettings({ [`locPinDesc_${selectedPin}`]: val })}
                    type="textarea"
                  />
                </p>
                <div className="pt-2.5 border-t border-warm-border/55 flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider font-sans">
                  <span>
                    🚗 Car:{' '}
                    <EditableText
                      fieldKey={`locPinQtyCar_${selectedPin}`}
                      label={`Car distance: ${selectedPin}`}
                      value={siteSettings[`locPinQtyCar_${selectedPin}`] || locationsOfInterest.find(l => l.id === selectedPin)?.distanceCar || ""}
                      onSave={(val) => updateSiteSettings({ [`locPinQtyCar_${selectedPin}`]: val })}
                    />
                  </span>
                  {locationsOfInterest.find(l => l.id === selectedPin)?.distanceWalk !== 'N/A' && (
                    <span>
                      🚶 Walk:{' '}
                      <EditableText
                        fieldKey={`locPinQtyWalk_${selectedPin}`}
                        label={`Walk distance: ${selectedPin}`}
                        value={siteSettings[`locPinQtyWalk_${selectedPin}`] || locationsOfInterest.find(l => l.id === selectedPin)?.distanceWalk || ""}
                        onSave={(val) => updateSiteSettings({ [`locPinQtyWalk_${selectedPin}`]: val })}
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Map Area */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Beautiful local map visual block */}
            <div className="bg-white border border-warm-border p-2 rounded-xl shadow-sm overflow-hidden h-[300px] sm:h-[400px] relative flex items-center justify-center bg-sky-50">
              {siteSettings.useRealMap ? (
                <iframe
                  src={siteSettings.mapIframeUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12224.512683838495!2d23.978250!3d40.091944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a8f94cb026dd95%3A0xc3fbc19c004c2780!2sSalt%20%26%20Sea%20Rooms!5e0!3m2!1sel!2s!4v1716999999999!5m2!1sel!2s"}
                  className="w-full h-full border-0 rounded-lg z-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Real Location map"
                  id="real-google-map-iframe"
                />
              ) : (
                /* Custom SVG Stylized Map Layout */
                <div className="absolute inset-0 z-0 bg-sky-100/30 flex flex-col justify-between">
                  
                  {/* Visual Elements for a Greek Sea Map */}
                  {/* Aegean Sea */}
                  <div className="absolute inset-x-0 bottom-0 top-1/3 bg-brand-light/20 rounded-t-[50px] border-t border-warm-border overflow-hidden">
                    <div className="absolute inset-0 opacity-10 flex flex-col justify-around">
                      <div className="h-0.5 bg-brand-light/40 w-full animate-wave"></div>
                      <div className="h-0.5 bg-brand-light/40 w-full animate-wave animation-delay-1000"></div>
                    </div>
                    <div className="absolute bottom-4 left-6 text-brand-dark/50 font-serif italic text-xs tracking-widest uppercase">
                      Aegean Sea (Sykia Gulf)
                    </div>
                  </div>

                  {/* Landmass */}
                  <div className="absolute inset-x-0 top-0 bottom-2/3 bg-warm-bg/75 border-b border-warm-border"></div>

                  {/* Sarti Town Coast Area */}
                  <div className="absolute right-12 top-6 w-32 h-20 rounded bg-white border border-warm-border flex flex-col justify-center items-center p-2 text-center">
                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Sarti Town</span>
                    <span className="text-[8px] text-slate-500 font-sans tracking-wide mt-1">Shops & Taverns</span>
                  </div>

                  {/* Road Network Visual Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <path
                      d="M 120,40 Q 350,150 420,100 T 700,280"
                      fill="none"
                      stroke="#8C7B65"
                      strokeWidth="2.5"
                      strokeDasharray="5,4"
                      className="opacity-60"
                    />
                    <text x="180" y="80" fill="#8C7B65" fontSize="9" className="font-sans font-bold uppercase tracking-widest">Main Coastal Route</text>
                  </svg>

                  {/* Interactive Points on the Map visual */}
                  {/* 1. Salt & Sea Rooms */}
                  <button
                    id="map-btn-rooms"
                    onClick={() => setSelectedPin('our-rooms')}
                    className={`absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 p-2 rounded shadow-sm z-20 transition-all duration-300 flex items-center space-x-1 border cursor-pointer ${
                      selectedPin === 'our-rooms'
                        ? 'bg-brand text-white scale-105 border-brand-dark'
                        : 'bg-white text-brand border-warm-border'
                    }`}
                  >
                    <MapPin className="h-4 w-4 fill-current" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      {siteSettings[`locPinTitle_our-rooms`] || 'Salt & Sea Rooms'}
                    </span>
                  </button>

                  {/* 2. Sykia Beach */}
                  <button
                    id="map-btn-sykia"
                    onClick={() => setSelectedPin('sykia-beach')}
                    className={`absolute left-[30%] bottom-16 p-2 rounded shadow-sm z-20 transition-all duration-300 flex items-center space-x-1 border cursor-pointer ${
                      selectedPin === 'sykia-beach'
                        ? 'bg-brand text-white scale-105 border-brand-dark'
                        : 'bg-white text-slate-700 border-warm-border'
                    }`}
                  >
                    <Navigation className="h-4 w-4 transform rotate-45" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-sans">
                      {siteSettings[`locPinTitle_sykia-beach`] || 'Sykia Beach'}
                    </span>
                  </button>

                  {/* 3. Sarti Center */}
                  <button
                    id="map-btn-sarti"
                    onClick={() => setSelectedPin('sarti-town')}
                    className={`absolute right-[22%] top-12 p-2 rounded shadow-sm z-20 transition-all duration-300 flex items-center space-x-1 border cursor-pointer ${
                      selectedPin === 'sarti-town'
                        ? 'bg-brand text-white scale-105 border-brand-dark'
                        : 'bg-white text-slate-700 border-warm-border'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-sans">
                      {siteSettings[`locPinTitle_sarti-town`] || 'Sarti Center'}
                    </span>
                  </button>

                  {/* 4. Orange Beach */}
                  <button
                    id="map-btn-orange"
                    onClick={() => setSelectedPin('orange-beach')}
                    className={`absolute right-10 bottom-24 p-2 rounded shadow-sm z-20 transition-all duration-300 flex items-center space-x-1 border cursor-pointer ${
                      selectedPin === 'orange-beach'
                        ? 'bg-brand text-white scale-105 border-brand-dark'
                        : 'bg-white text-slate-700 border-warm-border'
                    }`}
                  >
                    <Compass className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-sans">
                      {siteSettings[`locPinTitle_orange-beach`] || 'Orange Beach'}
                    </span>
                  </button>
                </div>
              )}

              {/* Informative Corner overlay */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded border border-warm-border z-20 text-left">
                <span className="text-[9px] uppercase font-bold text-brand tracking-widest block font-sans">
                  <EditableText
                    fieldKey="locGuideHeading"
                    label="Μικρός Τίτλος Χάρτη"
                    value={siteSettings.locGuideHeading || "Interactive Guide"}
                    onSave={(val) => updateSiteSettings({ locGuideHeading: val })}
                  />
                </span>
                <span className="text-xs font-serif font-medium text-slate-800 uppercase tracking-wide">
                  <EditableText
                    fieldKey="locGuideSub"
                    label="Τίτλος Χάρτη"
                    value={siteSettings.locGuideSub || "Halkidiki Coastal Pass Map"}
                    onSave={(val) => updateSiteSettings({ locGuideSub: val })}
                  />
                </span>
              </div>
            </div>

            {/* Real embedded maps link reference with switch */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => updateSiteSettings({ useRealMap: !siteSettings.useRealMap })}
                className="bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border border-brand/20 transition-all font-sans cursor-pointer focus:outline-none"
              >
                {siteSettings.useRealMap ? "🔄 Switch to Stylized Visual Map" : "🌐 Pin Real Map (Εμφάνιση Πραγματικού Χάρτη)"}
              </button>

              <a
                href={siteSettings.googleMapsLink || "https://maps.google.com/?q=Sarti+Sykia+Sithonia+Halkidiki"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-brand hover:text-brand-dark font-bold uppercase tracking-widest font-sans"
              >
                <span>🌐 Open in Google Maps Application</span>
              </a>
            </div>
          </div>
        </div>

        {/* Nearby attractions cards layout */}
        <div id="nearby" className="bg-warm-bg/35 p-6 sm:p-10 rounded-xl border border-warm-border text-left">
          <h3 className="font-serif text-2xl font-light text-slate-800 mb-10 text-center sm:text-left uppercase tracking-tight">
            <EditableText
              fieldKey="locLifeHeader"
              label="Κύριος Τίτλος 'Τοπική Ζωή'"
              value={siteSettings.locLifeHeader || "Local Life & Nearby Sarti Spots"}
              onSave={(val) => updateSiteSettings({ locLifeHeader: val })}
            />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nearbyPoints.map((point, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-warm-border space-y-4 shadow-sm text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-warm-bg text-brand rounded border border-warm-border">
                    <point.icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-serif font-medium text-slate-800 text-sm sm:text-base uppercase tracking-wider">
                    <EditableText
                      fieldKey={`locNearbyCategoryHeader_${idx}`}
                      label={`Τίτλος Κατηγορίας ${idx + 1}`}
                      value={siteSettings[`locNearbyCategoryHeader_${idx}`] || point.category}
                      onSave={(val) => updateSiteSettings({ [`locNearbyCategoryHeader_${idx}`]: val })}
                    />
                  </h4>
                </div>
                <ul className="space-y-3.5">
                  {point.places.map((place, pIdx) => (
                    <li key={pIdx} className="text-slate-600 text-xs sm:text-sm flex items-start gap-1.5 leading-relaxed text-left">
                      <span className="text-brand font-bold shrink-0">•</span>
                      <span className="flex-grow">
                        <EditableText
                          fieldKey={`locNearbyPlaceText_${idx}_${pIdx}`}
                          label={`Τοποθεσία κατηγορίας ${idx + 1}, σημείο ${pIdx + 1}`}
                          value={siteSettings[`locNearbyPlaceText_${idx}_${pIdx}`] || place}
                          onSave={(val) => updateSiteSettings({ [`locNearbyPlaceText_${idx}_${pIdx}`]: val })}
                          type="textarea"
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
