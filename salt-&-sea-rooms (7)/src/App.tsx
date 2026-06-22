/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Rooms from './components/Rooms';
import Amenities from './components/Amenities';
import LocationNearby from './components/LocationNearby';
import Gallery from './components/Gallery';
import BookingSection from './components/Booking';
import SiteCustomizer from './components/SiteCustomizer';
import VisualEditingToolbar from './components/VisualEditingToolbar';
import VisualEditorModal from './components/VisualEditorModal';
import { useCustomizer } from './context/CustomizerContext';
import { EditableText, EditableImage } from './components/Editable';

import { REVIEWS } from './data/staticData';
import { Phone, Mail, MapPin, Star, Facebook, Instagram, Heart, Sun, Lock, ShieldAlert, Eye } from 'lucide-react';

export default function App() {
  const { siteSettings, updateSiteSettings, sections, updateSection, isEditingMode } = useCustomizer();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // Admin secure passcode states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('salt_sea_admin_authenticated') === 'true';
    }
    return false;
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = siteSettings.adminPasscode || 'rooms2026';
    if (passcodeInput.trim() === correctPasscode.trim()) {
      localStorage.setItem('salt_sea_admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Λανθασμένος κωδικός πρόσβασης! Δοκιμάστε ξανά.');
    }
  };

  const handleCancelEditing = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      window.location.href = url.pathname; // reload without edit query context
    }
  };

  // Detect active section on scroll to illuminate navbar links
  useEffect(() => {
    const handleScroll = () => {
      const activeIds = sections.filter(sec => sec.visible).map(sec => sec.id);
      const scrollPosition = window.scrollY + 200;

      for (const section of activeIds) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Smooth scroll helper
  const handleScrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Triggers booking transition when choosing specific room cards
  const handleSelectRoomForBooking = (roomId: string) => {
    setSelectedRoomId(roomId);
    handleScrollToSection('booking');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-sky-200 selection:text-sky-900 scroll-smooth">
      {/* Visual Editor Status Bar */}
      {isEditingMode && isAdminAuthenticated && <VisualEditingToolbar />}

      {/* 1. Header Navigation */}
      <Navbar onNavigate={handleScrollToSection} activeSection={activeSection} />

      {/* Dynamic Sections Render Routing */}
      {sections.filter(sec => sec.visible).map((section) => {
        switch (section.id) {
          case 'home':
            return (
              <div key="home">
                <Hero 
                  onBookClick={() => handleScrollToSection('booking')} 
                  onExploreClick={() => handleScrollToSection('rooms')} 
                />
              </div>
            );
          case 'who-we-are':
            return (
              <div key="who-we-are">
                <About />
              </div>
            );
          case 'rooms':
            return (
              <div key="rooms">
                <Rooms onSelectRoomForBooking={handleSelectRoomForBooking} />
              </div>
            );
          case 'amenities':
            return (
              <div key="amenities">
                <Amenities />
              </div>
            );
          case 'location':
            return (
              <div key="location">
                <LocationNearby />
              </div>
            );
          case 'gallery':
            return (
              <div key="gallery">
                <Gallery />
              </div>
            );
          case 'reviews':
            return (
              <section key="reviews" id="reviews" className="py-16 bg-gradient-to-r from-sky-500/10 via-amber-500/5 to-sky-500/10 text-slate-700 font-sans border-b border-warm-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                  <span className="text-xs uppercase font-bold tracking-widest text-sky-600 block mb-2 font-sans">
                    <EditableText
                      fieldKey="revSectionSub"
                      label="Υπότιτλος Κριτικών"
                      value={siteSettings.revSectionSub || "Guest Testimonials"}
                      onSave={(val) => updateSiteSettings({ revSectionSub: val })}
                    />
                  </span>
                  <h2 className="font-serif text-3xl font-light text-slate-800 tracking-tight uppercase mb-10 block">
                    <EditableText
                      fieldKey="revSectionTitle"
                      label="Κύριος Τίτλος Κριτικών"
                      value={siteSettings.revSectionTitle || "What Our Guests Love"}
                      onSave={(val) => updateSiteSettings({ revSectionTitle: val })}
                    />
                  </h2>

                  <div id="reviews-slider" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...REVIEWS, ...(siteSettings.customReviews || [])].map((rev, idx) => {
                      const isCustom = idx >= REVIEWS.length;
                      const dynamicText = isCustom ? rev.text : (siteSettings[`review_text_${idx}`] || rev.text);
                      const dynamicGuest = isCustom ? rev.guest : (siteSettings[`review_guest_${idx}`] || rev.guest);
                      const dynamicDate = isCustom ? rev.date : (siteSettings[`review_date_${idx}`] || rev.date);

                      return (
                        <div 
                          key={isCustom ? `custom-rev-${rev.id}` : idx} 
                          className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between text-left space-y-4"
                        >
                          <div className="space-y-2">
                            {/* Stars list */}
                            <div className="flex gap-1 text-amber-400">
                              {Array.from({ length: rev.score }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed block text-left">
                              {isCustom ? (
                                <span>{dynamicText}</span>
                              ) : (
                                <EditableText
                                  fieldKey={`review_text_${idx}`}
                                  label={`Κείμενο Κριτικής ${idx + 1}`}
                                  value={dynamicText}
                                  onSave={(val) => updateSiteSettings({ [`review_text_${idx}`]: val })}
                                  type="textarea"
                                />
                              )}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-slate-800 text-sm block">
                              {isCustom ? (
                                <span>{dynamicGuest}</span>
                              ) : (
                                <EditableText
                                  fieldKey={`review_guest_${idx}`}
                                  label={`Όνομα Επισκέπτη ${idx + 1}`}
                                  value={dynamicGuest}
                                  onSave={(val) => updateSiteSettings({ [`review_guest_${idx}`]: val })}
                                />
                              )}
                            </h4>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {isCustom ? (
                                <span>{dynamicDate}</span>
                              ) : (
                                <EditableText
                                  fieldKey={`review_date_${idx}`}
                                  label={`Ημερομηνία Κριτικής ${idx + 1}`}
                                  value={dynamicDate}
                                  onSave={(val) => updateSiteSettings({ [`review_date_${idx}`]: val })}
                                />
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          case 'booking':
            return (
              <div id="booking" key="booking" className="border-b border-warm-border/50">
                <BookingSection preSelectedRoomId={selectedRoomId} />
              </div>
            );
          default:
            // Custom-created user page/section from the customizable list!
            if (section.isCustom) {
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="py-24 bg-white border-b border-warm-border/50 relative font-sans"
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                      <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
                        <EditableText
                          fieldKey={`section-title-${section.id}`}
                          label="Τίτλος Προσαρμοσμένης σελίδας"
                          value={section.title}
                          onSave={(val) => updateSection(section.id, { title: val })}
                        />
                      </h2>
                      <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
                      {section.sub && (
                        <p className="text-slate-500 mt-4 text-xs sm:text-sm uppercase tracking-wider block">
                          <EditableText
                            fieldKey={`section-sub-${section.id}`}
                            label="Υπότιτλος Προσαρμοσμένης σελίδας"
                            value={section.sub}
                            onSave={(val) => updateSection(section.id, { sub: val })}
                            type="textarea"
                          />
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                      {section.imageUrl && (
                        <div className="md:col-span-5">
                          <div className="rounded-xl overflow-hidden shadow-sm border border-warm-border bg-warm-bg p-3">
                            <EditableImage
                              fieldKey={`section-image-${section.id}`}
                              label="Εικόνα Προσαρμοσμένης σελίδας"
                              src={section.imageUrl}
                              onSave={(val) => updateSection(section.id, { imageUrl: val })}
                              className="rounded-lg w-full h-[320px] object-cover filter brightness-[0.98]"
                              alt={section.title}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className={section.imageUrl ? "md:col-span-7 space-y-6 text-left" : "md:col-span-12 space-y-6 text-left max-w-3xl mx-auto"}>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans block whitespace-pre-line">
                          <EditableText
                            fieldKey={`section-content-${section.id}`}
                            label="Κείμενο Προσαρμοσμένης σελίδας"
                            value={section.content || "Προσθέστε το κείμενο της σελίδας σας εδώ..."}
                            onSave={(val) => updateSection(section.id, { content: val })}
                            type="textarea"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }
            return null;
        }
      })}

      {/* 11. Footer details */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800 text-left font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Info and vision column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-sky-950 text-sky-400 rounded-full">
                  <Sun className="h-5 w-5 animate-pulse" />
                </div>
                <span className="font-serif text-lg font-bold text-white tracking-wide block">
                  <EditableText
                    fieldKey="siteName"
                    label="Όνομα Καταλύματος"
                    value={siteSettings.siteName}
                    onSave={(val) => updateSiteSettings({ siteName: val })}
                  />
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed block">
                <EditableText
                  fieldKey="footerVisionText"
                  label="Κείμενο Οράματος Φούτερ"
                  value={siteSettings.footerVisionText || "Quiet luxury nestled inside a 4,000 m² Greek garden. Positioned in Sarti-Sykia's pass to give you the ultimate Sithonia vacation experience."}
                  onSave={(val) => updateSiteSettings({ footerVisionText: val })}
                  type="textarea"
                />
              </p>
              <div className="flex space-x-3 text-slate-500">
                <a href="https://facebook.com" className="hover:text-white transition-colors" aria-label="Facebook Link">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://instagram.com" className="hover:text-white transition-colors" aria-label="Instagram Link">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick links block */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-2 text-xs text-left">
                <li>
                  <button onClick={() => handleScrollToSection('home')} className="hover:text-white cursor-pointer transition-colors block text-left">
                    Welcome Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScrollToSection('who-we-are')} className="hover:text-white cursor-pointer transition-colors block text-left">
                    Our Story (About)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScrollToSection('rooms')} className="hover:text-white cursor-pointer transition-colors block text-left">
                    Rooms & Suites
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScrollToSection('amenities')} className="hover:text-white cursor-pointer transition-colors block text-left">
                    Garden & BBQ
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScrollToSection('location')} className="hover:text-white cursor-pointer transition-colors block text-left">
                    Map Location
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Connect With Us</h4>
              <ul className="space-y-3 text-xs leading-relaxed text-left">
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>
                    <EditableText
                      fieldKey="siteAddress"
                      label="Διεύθυνση Καταλύματος"
                      value={siteSettings.siteAddress}
                      onSave={(val) => updateSiteSettings({ siteAddress: val })}
                    />
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-sky-500 shrink-0" />
                  {isEditingMode ? (
                    <span>
                      <EditableText
                        fieldKey="sitePhone"
                        label="Τηλέφωνα Επικοινωνίας"
                        value={siteSettings.sitePhone}
                        onSave={(val) => updateSiteSettings({ sitePhone: val })}
                      />
                    </span>
                  ) : (
                    <a href={`tel:${siteSettings.sitePhone.split(/[,\/]/)[0].trim()}`} className="hover:text-white transition-colors cursor-pointer">
                      {siteSettings.sitePhone}
                    </a>
                  )}
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-sky-500 shrink-0" />
                  {isEditingMode ? (
                    <span className="hover:text-white transition-colors cursor-pointer">
                      <EditableText
                        fieldKey="siteEmail"
                        label="Email Επικοινωνίας"
                        value={siteSettings.siteEmail}
                        onSave={(val) => updateSiteSettings({ siteEmail: val })}
                      />
                    </span>
                  ) : (
                    <a href={`mailto:${siteSettings.siteEmail}`} className="hover:text-white transition-colors cursor-pointer">
                      {siteSettings.siteEmail}
                    </a>
                  )}
                </li>
              </ul>
            </div>

            {/* General policies info card */}
            <div className="space-y-3 p-4 bg-slate-950/40 rounded-xl border border-slate-800">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Guest Rules</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 leading-normal font-sans text-left">
                <li>
                  <EditableText
                    fieldKey="rule_checkin"
                    label="Κανόνας Check-in"
                    value={siteSettings.rule_checkin || "🕒 Check-in from: 14:00"}
                    onSave={(val) => updateSiteSettings({ rule_checkin: val })}
                  />
                </li>
                <li>
                  <EditableText
                    fieldKey="rule_checkout"
                    label="Κανόνας Check-out"
                    value={siteSettings.rule_checkout || "🕚 Check-out before: 11:00"}
                    onSave={(val) => updateSiteSettings({ rule_checkout: val })}
                  />
                </li>
                <li>
                  <EditableText
                    fieldKey="rule_pets"
                    label="Κανόνας Κατοικιδίων"
                    value={siteSettings.rule_pets || "🐾 Pets: Allowed on early notification"}
                    onSave={(val) => updateSiteSettings({ rule_pets: val })}
                  />
                </li>
                <li>
                  <EditableText
                    fieldKey="rule_garden"
                    label="Κανόνας Κήπου"
                    value={siteSettings.rule_garden || "🌿 Garden: Open to guests 24/7"}
                    onSave={(val) => updateSiteSettings({ rule_garden: val })}
                  />
                </li>
                <li>
                  <EditableText
                    fieldKey="rule_parking"
                    label="Κανόνας Parking"
                    value={siteSettings.rule_parking || "🚗 Parking: Free on-site gated space"}
                    onSave={(val) => updateSiteSettings({ rule_parking: val })}
                  />
                </li>
              </ul>
            </div>

          </div>

          <hr className="border-slate-800 my-8" />

          {/* Copyright notice and license index alignment */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              <EditableText
                fieldKey="footerCopyright"
                label="Copyright Notice"
                value={siteSettings.footerCopyright || `© 2026 ${siteSettings.siteName} Sithonia. All Rights Reserved.`}
                onSave={(val) => updateSiteSettings({ footerCopyright: val })}
              />
            </p>
            <div className="flex space-x-4">
              <span>
                <EditableText
                  fieldKey="footerLicence"
                  label="Αριθμός Άδειας ΕΟΤ"
                  value={siteSettings.footerLicence || "EOT License: 1042K123K4567801"}
                  onSave={(val) => updateSiteSettings({ footerLicence: val })}
                />
              </span>
              <span>•</span>
              <span>
                <EditableText
                  fieldKey="footerVibe"
                  label="Λεκτικό Σχεδίασης"
                  value={siteSettings.footerVibe || "Designed with Greece Summer Vibe"}
                  onSave={(val) => updateSiteSettings({ footerVibe: val })}
                />
              </span>
            </div>
            <div className="flex items-center space-x-2.5">
              <p className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                <span>for Greek Hospitality</span>
              </p>
            </div>
          </div>

        </div>
      </footer>
      
      {/* 12. Floating Admin Customizer Drawer */}
      {isEditingMode && isAdminAuthenticated && <SiteCustomizer />}

      {/* Live element editing popup */}
      {isEditingMode && isAdminAuthenticated && <VisualEditorModal />}

      {/* 13. Admin Secure Passcode Lock Screen Overlay */}
      {isEditingMode && !isAdminAuthenticated && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-white/95 text-slate-800 border border-warm-border/80 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto text-center space-y-6 animate-none">
            <div className="mx-auto w-14 h-14 bg-sky-50 text-brand rounded-full flex items-center justify-center border border-sky-100">
              <Lock className="h-6 w-6 animate-none" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-sans font-bold text-lg text-slate-900 leading-tight">
                Κλειδωμένη Περιοχή Διαχειριστή
              </h3>
              <p className="text-xs text-slate-500 leading-normal font-sans pb-1">
                Παρακαλώ εισάγετε τον Κωδικό Πρόσβασης (Passcode) για να ξεκλειδώσετε τα εργαλεία επεξεργασίας.
              </p>
              <div className="inline-block px-2.5 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-[10px] font-sans font-medium border border-blue-100">
                🗝️ Προεπιλεγμένος Κωδικός: <span className="font-mono font-bold select-all bg-white px-1.5 py-0.5 rounded border border-blue-200">rooms2026</span>
              </div>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4 text-left">
              <div>
                <input
                  type="password"
                  placeholder="Εισάγετε τον κωδικό πρόσβασης"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full text-center text-sm p-3 border border-warm-border rounded-lg bg-white/70 focus:outline-none focus:border-brand font-mono tracking-widest text-slate-800 focus:bg-white animate-none"
                  autoFocus
                />
              </div>

              {passcodeError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-[11px] leading-snug rounded-lg border border-red-150 flex items-start space-x-1.5 font-sans">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-red-500 mt-0.5 animate-none" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <div className="flex space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans text-[10px] font-bold uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand hover:bg-brand-dark text-white font-sans text-[10px] font-bold uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Ξεκλείδωμα
                </button>
              </div>
            </form>

            <div className="text-[10px] text-slate-400 font-sans border-t border-slate-100 pt-4">
              Salt & Sea Rooms Security Shield • Protected Area
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Mode Toggle Button */}
      {isEditingMode && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('edit');
                window.location.href = url.pathname;
              }
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full border shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-sans text-xs font-bold uppercase tracking-wider cursor-pointer bg-red-600 hover:bg-red-700 text-white border-red-500"
            title="Έξοδος από Λειτουργία Επεξεργασίας"
          >
            <Eye className="h-4 w-4 text-white" />
            <span>Έξοδος (Normal Site) 👁️</span>
          </button>
        </div>
      )}
    </div>
  );
}
