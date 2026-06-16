import React, { useState, useEffect } from 'react';
import { ROOMS } from '../data/staticData';
import { Booking, Room } from '../types';
import { useCustomizer } from '../context/CustomizerContext';
import { Calendar as CalendarIcon, ClipboardCheck, Sparkles, AlertCircle, Heart, User, Mail, DollarSign, CalendarDays, CreditCard, Building, Banknote } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface BookingProps {
  preSelectedRoomId: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;
type MonthType = typeof MONTHS[number];

export default function BookingSection({ preSelectedRoomId }: BookingProps) {
  const { rooms, bookings, addBooking, siteSettings } = useCustomizer();
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  
  // Date range selectors
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  
  // Error / Success messaging
  const [bookingError, setBookingError] = useState<string>('');
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Calendar render config
  const [calendarMonth, setCalendarMonth] = useState<MonthType>('July');

  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'arrival'>('card');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');

  // Sync preselected room
  useEffect(() => {
    if (preSelectedRoomId) {
      setSelectedRoomId(preSelectedRoomId);
    } else if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [preSelectedRoomId, rooms]);

  const activeRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0] || ROOMS[0];

  // Helper: calculate difference in nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = date2.getTime() - date1.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nightsCount = calculateNights();
  const totalPrice = nightsCount * activeRoom.pricePerNight;

  const getMonthConfig = (monthName: MonthType, year: number = 2026) => {
    const monthIndex = MONTHS.indexOf(monthName);
    
    // Total days in month
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    
    // Day of week of the 1st of the month (0 = Sunday, 1 = Monday, ...)
    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    // Monday (1) to Sunday (0) translation to Mon-Sun index (0-6)
    const startingOffset = (firstDayIndex + 6) % 7;
    
    const monthNum = monthIndex + 1;
    const prefix = `${year}-${monthNum < 10 ? '0' : ''}${monthNum}-`;
    
    return { year, monthIndex, totalDays, startingOffset, prefix };
  };

  const currentConf = getMonthConfig(calendarMonth);

  // Get status of a specific day in the selected month
  const getDayStatus = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `${currentConf.prefix}${dayStr}`;

    // 1. Check if inside currently drafted booking selection
    if (checkIn && checkOut) {
      if (dateStr >= checkIn && dateStr <= checkOut) {
        if (dateStr === checkIn) return 'check-in';
        if (dateStr === checkOut) return 'check-out';
        return 'selected-span';
      }
    } else if (checkIn && dateStr === checkIn) {
      return 'check-in-only';
    }

    // 2. Check if booked by any confirmed/pending booking for the current room
    const isBooked = bookings.some(b => {
      if (b.roomId !== selectedRoomId) return false;
      // b.checkIn is YYYY-MM-DD
      // Check if day is between checkIn (inclusive) and checkOut (exclusive, since check-out day room is freed)
      return dateStr >= b.checkIn && dateStr < b.checkOut;
    });

    if (isBooked) return 'booked';
    return 'available';
  };

  // Click handler for calendar cells
  const handleCalendarDayClick = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const clickedDate = `${currentConf.prefix}${dayStr}`;

    setBookingError('');

    // Check if clicked date is already booked by another reservation
    const isOverlapping = bookings.some(b => {
      if (b.roomId !== selectedRoomId) return false;
      return clickedDate >= b.checkIn && clickedDate < b.checkOut;
    });

    if (isOverlapping) {
      setBookingError('The selected date is already occupied by another guest. Please pick an alternative block.');
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      // Set as check-in
      setCheckIn(clickedDate);
      setCheckOut('');
    } else {
      // Set as check-out
      if (clickedDate <= checkIn) {
        // Restart selection
        setCheckIn(clickedDate);
        setCheckOut('');
      } else {
        // Check if there are any bookings in between checkIn and clickedDate
        const hasMiddleBooking = bookings.some(b => {
          if (b.roomId !== selectedRoomId) return false;
          return b.checkIn > checkIn && b.checkIn < clickedDate;
        });

        if (hasMiddleBooking) {
          setBookingError('Your selection overlaps with an occupied booking. Please choose a continuous free block.');
          return;
        }

        setCheckOut(clickedDate);
      }
    }
  };

  // Submit form handler
  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');

    if (!guestName.trim()) {
      setBookingError('Παρακαλώ εισάγετε ένα έγκυρο όνομα επισκέπτη.');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setBookingError('Παρακαλώ καθορίστε μια έγκυρη διεύθυνση email για την επιβεβαίωση της κράτησης.');
      return;
    }
    if (!checkIn || !checkOut) {
      setBookingError('Παρακαλώ επιλέξτε ημερομηνία Check-In και Check-Out στο ημερολόγιο.');
      return;
    }
    if (nightsCount <= 0) {
      setBookingError('Η ημερομηνία Check-Out πρέπει να είναι τουλάχιστον 1 ημέρα μετά την ημερομηνία Check-In.');
      return;
    }
    if (guestsCount > activeRoom.capacity) {
      setBookingError(`Η μέγιστη χωρητικότητα για το ${activeRoom.name} είναι ${activeRoom.capacity} άτομα.`);
      return;
    }

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (!cleanCard || cleanCard.length < 16) {
        setBookingError('Παρακαλώ εισάγετε έναν έγκυρο 16ψηφιο αριθμό κάρτας.');
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/') || cardExpiry.length < 5) {
        setBookingError('Παρακαλώ εισάγετε μια έγκυρη ημερομηνία λήξης (ΜΜ/ΕΕ).');
        return;
      }
      if (!cardCvv.trim() || cardCvv.trim().length < 3) {
        setBookingError('Παρακαλώ εισάγετε έναν έγκυρο 3ψηφιο κωδικό ασφαλείας CVV.');
        return;
      }
    }

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      guestName,
      guestEmail,
      roomId: selectedRoomId,
      checkIn,
      checkOut,
      guestsCount,
      totalPrice,
      status: paymentMethod === 'bank_transfer' ? 'pending' : 'confirmed',
      paymentMethod,
    };

    addBooking(newBooking);
    setCompletedBooking(newBooking);

    // Trigger EmailJS notifications if enabled and configured
    if (siteSettings.emailjs_enabled && siteSettings.emailjs_service_id && siteSettings.emailjs_template_id && siteSettings.emailjs_public_key) {
      const templateParams = {
         booking_id: `SS-${newBooking.id.substring(2, 8).toUpperCase()}`,
        guest_name: newBooking.guestName,
        guest_email: newBooking.guestEmail,
        // Standard fallbacks for EmailJS templates to be compatible with default fields
        email: newBooking.guestEmail,
        to_email: siteSettings.emailjs_to_email || siteSettings.siteEmail || 'iliasmav6@gmail.com',
        to_name: newBooking.guestName,
        from_name: 'Salt & Sea Rooms',
        room_name: rooms.find(r => r.id === newBooking.roomId)?.name || ROOMS.find(r => r.id === newBooking.roomId)?.name || "Room",
        check_in: newBooking.checkIn,
        check_out: newBooking.checkOut,
        nights: nightsCount,
        guests: newBooking.guestsCount,
        total_price: newBooking.totalPrice,
        payment_method: newBooking.paymentMethod === 'bank_transfer' ? 'Τραπεζική Κατάθεση (Bank Transfer)' : newBooking.paymentMethod === 'arrival' ? 'Πληρωμή κατά την Άφιξη (Pay on Arrival)' : 'Πιστωτική/Χρεωστική Κάρτα (Credit Card)',
        payment_status: newBooking.status === 'confirmed' ? 'Confirmed (Επιβεβαιώθηκε)' : 'Pending Direct Deposit (Εκκρεμεί κατάθεση προκαταβολής)',
        admin_to_email: siteSettings.emailjs_to_email || siteSettings.siteEmail || 'iliasmav6@gmail.com',
      };
        room_name: rooms.find(r => r.id === newBooking.roomId)?.name || ROOMS.find(r => r.id === newBooking.roomId)?.name || "Room",
        check_in: newBooking.checkIn,
        check_out: newBooking.checkOut,
        nights: nightsCount,
        guests: newBooking.guestsCount,
        total_price: newBooking.totalPrice,
        payment_method: newBooking.paymentMethod === 'bank_transfer' ? 'Τραπεζική Κατάθεση (Bank Transfer)' : newBooking.paymentMethod === 'arrival' ? 'Πληρωμή κατά την Άφιξη (Pay on Arrival)' : 'Πιστωτική/Χρεωστική Κάρτα (Credit Card)',
        payment_status: newBooking.status === 'confirmed' ? 'Confirmed (Επιβεβαιώθηκε)' : 'Pending Direct Deposit (Εκκρεμεί κατάθεση προκαταβολής)',
        admin_to_email: siteSettings.emailjs_to_email || siteSettings.siteEmail || 'iliasmav6@gmail.com',
      };

      emailjs.send(
        siteSettings.emailjs_service_id,
        siteSettings.emailjs_template_id,
        templateParams,
        siteSettings.emailjs_public_key
      ).then((response) => {
        console.log('Notification email successfully sent via EmailJS!', response.status, response.text);
      }).catch((err) => {
        console.error('Failed to send notification email via EmailJS:', err);
      });
    }
  };

  const handleResetForm = () => {
    setCheckIn('');
    setCheckOut('');
    setGuestName('');
    setGuestEmail('');
    setGuestsCount(2);
    setBookingError('');
    setCompletedBooking(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setPaymentMethod('card');
  };

  // Render Calendar Matrix
  const daysArray = Array.from({ length: currentConf.totalDays }, (_, i) => i + 1);
  const emptyBlocks = Array.from({ length: currentConf.startingOffset }, (_, i) => i);

  return (
    <section id="booking" className="py-24 bg-warm-bg/35 border-b border-warm-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand block mb-2">Book Your Summer</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
            Availability & Interactive Booking
          </h2>
          <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="text-slate-500 mt-4 font-sans text-xs sm:text-sm uppercase tracking-wider">
            Select your room, tap on dates in the visual scheduler calendar to design your ideal stay, and submit the booking request instantly.
          </p>
        </div>

        {completedBooking ? (
          /* Receipt View */
          <div id="booking-receipt" className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-dashed border-brand/50 p-8 sm:p-12 text-center animate-fadeIn">
            <div className="mx-auto w-12 h-12 bg-warm-bg text-brand rounded-full flex items-center justify-center mb-6 border border-warm-border">
              <ClipboardCheck className="h-5 w-5" />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-brand font-bold block">✓ Reservation Request Received</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-slate-800 uppercase tracking-wide">
                Welcome to Salt & Sea, {completedBooking.guestName}!
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Your stay in Halkidiki has been successfully registered. A reservation package has been sent to <strong>{completedBooking.guestEmail}</strong>.
              </p>

              {/* Boarding pass styled details card */}
              <div className="mt-8 mb-6 bg-warm-bg/40 rounded-lg border border-warm-border p-6 text-left space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1.5 px-3 rounded-bl bg-brand text-white font-sans text-[9px] font-bold uppercase tracking-widest">
                  2026 Boarding Pass
                </div>
                
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stay Receipt</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block animate-none">Accommodation Unit</span>
                    <span className="font-serif font-medium text-slate-800 text-sm">
                      {rooms.find(r => r.id === completedBooking.roomId)?.name || ROOMS.find(r => r.id === completedBooking.roomId)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block animate-none">Confirmation Code</span>
                    <span className="font-sans font-bold text-brand uppercase tracking-wider text-sm">SS-{completedBooking.id.substring(2, 8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block animate-none">Check-In Arrival</span>
                    <strong className="text-slate-800">{completedBooking.checkIn} (14:00)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block animate-none">Check-Out Departure</span>
                    <strong className="text-slate-800">{completedBooking.checkOut} (11:00)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block animate-none">Stay Duration & Guests</span>
                    <span className="text-slate-800 font-semibold">{nightsCount} nights • {completedBooking.guestsCount} guests</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block animate-none">Guaranteed Quote</span>
                    <span className="text-brand font-bold text-sm">€{completedBooking.totalPrice} EUR</span>
                  </div>
                  <div className="col-span-2 border-t border-warm-border/60 pt-3">
                    <span className="text-slate-500 block animate-none">Payment Mode & Status</span>
                    <span className="text-slate-800 font-semibold block uppercase tracking-wide text-[10px] mt-0.5">
                      {completedBooking.paymentMethod === 'bank_transfer' ? 'Τραπεζική Κατάθεση (Bank Transfer)' : completedBooking.paymentMethod === 'arrival' ? 'Πληρωμή κατά την Άφιξη (Pay on Arrival)' : 'Πιστωτική/Χρεωστική Κάρτα (Credit Card)'}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block mt-1 border ${
                      completedBooking.paymentMethod === 'bank_transfer'
                        ? 'bg-amber-50 text-amber-850 border-amber-200'
                        : 'bg-emerald-50 text-emerald-850 border-emerald-250'
                    }`}>
                      {completedBooking.paymentMethod === 'bank_transfer' ? 'ΕΚΚΡΕΜΕΙ ΚΑΤΑΘΕΣΗ (PENDING DEPOSIT)' : 'ΕΠΙΒΕΒΑΙΩΘΗΚΕ (CONFIRMED RESERVATION)'}
                    </span>
                  </div>
                </div>
              </div>

              {completedBooking.paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-amber-50/70 text-slate-700 border border-amber-200/60 rounded-lg text-left text-xs mb-6 space-y-1.5 font-sans">
                  <h5 className="font-bold text-[9px] uppercase tracking-wider text-amber-800">
                    {siteSettings.payment_bank_title || "Στοιχεία Κατάθεσης Προκαταβολής"}
                  </h5>
                  <p className="text-[11px] leading-relaxed text-slate-600 mb-2">
                    {siteSettings.payment_bank_instructions ? (
                      siteSettings.payment_bank_instructions.replace('30%', `30% (€${(completedBooking.totalPrice * 0.3).toFixed(2)})`)
                    ) : (
                      `Παρακαλούμε καταθέστε το 30% της κράτησης (€${(completedBooking.totalPrice * 0.3).toFixed(2)}) ή το συνολικό ποσό εντός 48 ωρών για να ολοκληρωθεί η δέσμευση των ημερομηνιών σας.`
                    )}
                  </p>
                  <div className="text-[10px] space-y-0.5 bg-white/70 p-2.5 rounded border border-amber-100">
                    <div><strong>Τράπεζα / Bank:</strong> {siteSettings.payment_bank_name || "Alpha Bank"}</div>
                    <div><strong>IBAN:</strong> {siteSettings.payment_bank_iban || "GR56 0120 3450 0000 1234 5678 901"}</div>
                    <div><strong>Δικαιούχος / Holder:</strong> {siteSettings.payment_bank_holder || "Salt & Sea Rooms (Mavroudis Family)"}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-3">
                <button
                  id="reset-booking-view"
                  onClick={handleResetForm}
                  className="bg-brand hover:bg-brand-dark text-white font-semibold text-[10px] uppercase tracking-widest py-3 px-8 rounded cursor-pointer transition-all duration-200"
                >
                  Create Another Booking
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Booking workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="booking-workspace">
            
            {/* Left: The interactive graphic Calendar (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-warm-border shadow-sm space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-left">
                  <div className="p-2.5 bg-warm-bg text-brand rounded border border-warm-border">
                    <CalendarDays className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-medium text-slate-800 uppercase tracking-wider">
                      Availability Calendar
                    </h3>
                    <p className="text-[10px] text-slate-550 uppercase tracking-wide font-sans">
                      Tap cells to pick check-in & check-out dates
                    </p>
                  </div>
                </div>

                {/* Month Picker Selection */}
                <div className="flex items-center space-x-1.5" id="calendar-month-selector">
                  <button
                    type="button"
                    title="Προηγούμενος Μήνας"
                    onClick={() => {
                      const idx = MONTHS.indexOf(calendarMonth);
                      if (idx > 0) setCalendarMonth(MONTHS[idx - 1]);
                    }}
                    disabled={MONTHS.indexOf(calendarMonth) === 0}
                    className="p-1 px-2.5 border border-warm-border rounded text-xs select-none hover:bg-warm-bg/50 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    ←
                  </button>
                  <select
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(e.target.value as MonthType)}
                    className="px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-warm-border text-slate-705 cursor-pointer focus:outline-none focus:border-brand"
                  >
                    {MONTHS.map(m => {
                      const translations: Record<string, string> = {
                        January: 'Ιανουάριος',
                        February: 'Φεβρουάριος',
                        March: 'Μάρτιος',
                        April: 'Απρίλιος',
                        May: 'Μάιος',
                        June: 'Ιούνιος',
                        July: 'Ιούλιος',
                        August: 'Αύγουστος',
                        September: 'Σεπτέμβριος',
                        October: 'Οκτώβριος',
                        November: 'Νοέμβριος',
                        December: 'Δεκέμβριος'
                      };
                      return (
                        <option key={m} value={m}>
                          {translations[m] || m}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    title="Επόμενος Μήνας"
                    onClick={() => {
                      const idx = MONTHS.indexOf(calendarMonth);
                      if (idx < MONTHS.length - 1) setCalendarMonth(MONTHS[idx + 1]);
                    }}
                    disabled={MONTHS.indexOf(calendarMonth) === MONTHS.length - 1}
                    className="p-1 px-2.5 border border-warm-border rounded text-xs select-none hover:bg-warm-bg/50 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Room Occupancy Key */}
              <div className="p-3 bg-warm-bg/40 rounded border border-warm-border/60 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-center">
                <span className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-white border border-warm-border rounded"></span>
                  <span>Free</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-rose-50 border border-rose-200 rounded"></span>
                  <span>Occupied</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-brand rounded"></span>
                  <span>Check-In</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-warm-bg border border-brand/50 rounded"></span>
                  <span>Selected</span>
                </span>
              </div>

              {/* Interactive Calendar Days Grid */}
              <div className="space-y-2">
                
                {/* Heading Labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold font-sans text-slate-400 uppercase tracking-widest pb-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                {/* Cells array mapping */}
                <div className="grid grid-cols-7 gap-1.5" id="calendar-days-grid">
                  {/* Empty lead offsets */}
                  {emptyBlocks.map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square bg-warm-bg/15 rounded border border-warm-border/10"></div>
                  ))}

                  {/* Active Month Days */}
                  {daysArray.map((day) => {
                    const status = getDayStatus(day);
                    let cellClass = 'bg-white text-slate-700 hover:bg-warm-bg border border-warm-border/60';
                    let spanDot = '';
                    
                    if (status === 'booked') {
                      cellClass = 'bg-rose-50/50 text-rose-350 border border-rose-100/50 cursor-not-allowed';
                    } else if (status === 'check-in' || status === 'check-in-only') {
                      cellClass = 'bg-brand text-white border-brand font-bold';
                      spanDot = '★';
                    } else if (status === 'check-out') {
                      cellClass = 'bg-brand text-white border-brand font-bold';
                      spanDot = '✈';
                    } else if (status === 'selected-span') {
                      cellClass = 'bg-warm-bg text-brand border border-brand/50 font-semibold';
                    }

                    return (
                      <button
                        key={`day-${day}`}
                        id={`cal-day-${calendarMonth}-${day}`}
                        disabled={status === 'booked'}
                        onClick={() => handleCalendarDayClick(day)}
                        className={`aspect-square rounded flex flex-col items-center justify-center p-1 relative text-xs sm:text-sm font-semibold transition-all cursor-pointer ${cellClass}`}
                      >
                        <span>{day}</span>
                        {spanDot && (
                          <span className="absolute bottom-0.5 text-[8px] tracking-tight">{spanDot}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Display Info panel */}
              <div className="bg-accent-gold-light/20 p-4 rounded text-xs text-left border border-warm-border text-slate-600 leading-relaxed font-sans flex items-start gap-2">
                <Heart className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong>Tip:</strong> The calendar calculates the rates dynamically and screens out conflicts based on active reservations for the selected room unit: <strong>{activeRoom.name}</strong>. Switch rooms on the form to examine separate schedules!
                </div>
              </div>
            </div>

            {/* Right: The Booking Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-warm-border shadow-sm space-y-6 text-left">
              <h3 className="font-serif text-base font-medium text-slate-800 flex items-center space-x-2 border-b border-warm-border p-3 uppercase tracking-wider">
                <ClipboardCheck className="h-4.5 w-4.5 text-brand" />
                <span>Accommodation Form</span>
              </h3>

              {bookingError && (
                <div id="form-error-banner" className="p-3 bg-rose-50 border border-rose-100 text-rose-750 text-xs rounded-lg flex items-start space-x-2 font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmission} className="space-y-4" id="booking-formal-inputs">
                
                {/* 1. Selector Room Unit */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Select Apartment Unit</label>
                  <select
                    id="select-room-input"
                    value={selectedRoomId}
                    onChange={(e) => {
                      setSelectedRoomId(e.target.value);
                      setCheckIn('');
                      setCheckOut('');
                      setBookingError('');
                    }}
                    className="w-full text-xs p-3 border border-warm-border rounded-lg focus:outline-none focus:border-brand bg-white"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} — €{r.pricePerNight}/night
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Check-In & Check-Out display */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Check-in Date</label>
                    <input
                      id="input-check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        setBookingError('');
                      }}
                      className="w-full text-[11px] p-3 border border-warm-border rounded-lg bg-warm-bg/25 cursor-pointer focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Check-out Date</label>
                    <input
                      id="input-check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        setBookingError('');
                      }}
                      className="w-full text-[11px] p-3 border border-warm-border rounded-lg bg-warm-bg/25 cursor-pointer focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* 3. Guest Name */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Full Guest Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="input-guest-name"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-3 border border-warm-border rounded-lg focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* 4. Guest Email */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="input-guest-email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-3 border border-warm-border rounded-lg focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* 5. Guests Count slider / stepper */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Number of Guests</label>
                    <span className="text-[10px] font-bold text-slate-500 font-sans uppercase">Max: {activeRoom.capacity}</span>
                  </div>
                  <input
                    id="input-guests-count"
                    type="range"
                    min="1"
                    max={activeRoom.capacity}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-warm-border rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <div className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-bold">
                    Booked for: <strong className="text-brand">{guestsCount} {guestsCount === 1 ? 'Adult' : 'Adults'}</strong>
                  </div>
                </div>

                {/* Total cost break outline */}
                {nightsCount > 0 && (
                  <div id="cost-breakdown-panel" className="p-4 bg-warm-bg/50 rounded-lg border border-warm-border flex flex-col justify-between space-y-2 text-xs animate-fadeIn font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Rate per night</span>
                      <strong className="text-slate-800">€{activeRoom.pricePerNight}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Number of Nights</span>
                      <strong className="text-slate-800">× {nightsCount} nights</strong>
                    </div>
                    <hr className="border-warm-border/60" />
                    <div className="flex justify-between font-serif text-slate-850 font-bold">
                      <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-slate-500">
                        <DollarSign className="h-3.5 w-3.5 text-brand" />
                        <span>Calculated Quote</span>
                      </span>
                      <span className="text-brand text-lg">€{totalPrice} EUR</span>
                    </div>
                  </div>
                )}

                {/* 6. Payment Method selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Τρόπος Πληρωμής / Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Card Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-brand bg-brand/5 text-brand shadow-sm font-semibold'
                          : 'border-warm-border text-slate-550 hover:bg-warm-bg/35'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span className="text-[9px] uppercase tracking-wider block font-sans">Κάρτα</span>
                    </button>

                    {/* Bank Transfer Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-brand bg-brand/5 text-brand shadow-sm font-semibold'
                          : 'border-warm-border text-slate-550 hover:bg-warm-bg/35'
                      }`}
                    >
                      <Building className="h-4 w-4" />
                      <span className="text-[9px] uppercase tracking-wider block font-sans">Κατάθεση</span>
                    </button>

                    {/* Arrival Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('arrival')}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        paymentMethod === 'arrival'
                          ? 'border-brand bg-brand/5 text-brand shadow-sm font-semibold'
                          : 'border-warm-border text-slate-550 hover:bg-warm-bg/35'
                      }`}
                    >
                      <Banknote className="h-4 w-4" />
                      <span className="text-[9px] uppercase tracking-wider block font-sans">Στην Άφιξη</span>
                    </button>
                  </div>

                  {/* Payment Method Details container */}
                  <div className="p-3 bg-warm-bg/30 border border-warm-border/70 rounded-lg text-[11px] text-slate-600 transition-all">
                    {paymentMethod === 'card' && (
                      <div className="space-y-2.5">
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                          {siteSettings.payment_card_instructions || 'Ασφαλής Πληρωμή με Πιστωτική/Χρεωστική Κάρτα (Simulated)'}
                        </p>
                        <div>
                          <input
                            type="text"
                            placeholder="Αριθμός Κάρτας / Card Number"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(formatted);
                            }}
                            className="w-full text-xs p-2.5 border border-warm-border rounded-md bg-white focus:outline-none focus:border-brand"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Λήξη / Expiry (MM/YY)"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 2) {
                                setCardExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
                              } else {
                                setCardExpiry(val);
                              }
                            }}
                            className="w-full text-xs p-2.5 border border-warm-border rounded-md bg-white focus:outline-none focus:border-brand"
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-xs p-2.5 border border-warm-border rounded-md bg-white focus:outline-none focus:border-brand"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <div className="space-y-1 text-left text-slate-600 text-xs">
                        <strong className="text-brand uppercase text-[9px] tracking-wider block mb-1">
                          {siteSettings.payment_bank_title || 'Πληροφορίες Τραπεζικής Κατάθεσης'}
                        </strong>
                        <p className="text-[10px] leading-relaxed text-slate-500 mb-2">
                          {siteSettings.payment_bank_instructions || 'Παρακαλούμε καταθέστε την προκαταβολή (30%) ή το συνολικό ποσό εντός 48 ωρών για να επιβεβαιωθεί η κράτησή σας.'}
                        </p>
                        <div className="bg-white/80 p-2 rounded border border-warm-border/60 text-[10px] space-y-1 font-sans">
                          <div><strong>Τράπεζα:</strong> {siteSettings.payment_bank_name || 'Alpha Bank'}</div>
                          <div><strong>IBAN:</strong> {siteSettings.payment_bank_iban || 'GR56 0120 3450 0000 1234 5678 901'}</div>
                          <div><strong>Δικαιούχος:</strong> {siteSettings.payment_bank_holder || 'Salt & Sea Rooms'}</div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'arrival' && (
                      <div className="text-left text-slate-500 leading-relaxed text-[10px] font-sans">
                        <strong className="text-slate-700 uppercase text-[9px] tracking-wider block mb-1">
                          {siteSettings.payment_arrival_title || 'Πληρωμή κατά την Άφιξη'}
                        </strong>
                        {siteSettings.payment_arrival_instructions || 'Δεν απαιτείται προκαταβολή. Η εξόφληση θα πραγματοποιηθεί με μετρητά ή κάρτα κατά το check-out στο κατάλυμα.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button submits reservation */}
                <button
                  id="confirm-booking-btn"
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-dark text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg shadow-sm transition-all focus:outline-none mt-4 cursor-pointer text-center block"
                >
                  Confirm Reservation Stay
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
