import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import ConfirmBookingModal from "./ConfirmBookingModal";
import "./BookingSection.css";
import { businessHours, generateTimeSlotsForDate, isClosedDay, isClosedDate } from "../data/businessHours";

function BookingSection({ service, bookings, addBooking }) {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);

  // Gli slot saranno generati dinamicamente per la data selezionata usando businessHours

  function formatDateToString(date) {
    return date.toLocaleDateString("sv-SE");
  }

  const selectedDateString = selectedDate
    ? formatDateToString(selectedDate)
    : "";

  
  const bookedSlots = useMemo(() => {
    if (!selectedDateString || !selectedDate) return [];

    const daySlots = generateTimeSlotsForDate(selectedDate);
    const slots = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sel = new Date(selectedDate);
    sel.setHours(0, 0, 0, 0);
    const isPast = sel < today;

    bookings
      .filter((booking) => booking.date === selectedDateString)
      .filter((b) =>
        // Blocca solo confermato, e completato se nel passato; esclude cancellato e no-show
        b.status === "confermato" || (isPast && b.status === "completato") || (!b.status)
      )
      .forEach((booking) => {
        const startIndex = daySlots.indexOf(booking.time);
        const slotCount = booking.serviceDuration / businessHours.intervalMinutes;

        for (let i = 0; i < slotCount; i++) {
          const slot = daySlots[startIndex + i];
          if (slot) {
            slots.push(slot);
          }
        }
      });

    return slots;
  }, [selectedDateString, selectedDate, bookings]);

  const availableSlots = useMemo(() => {
    if (!selectedDate || isClosedDay(selectedDate) || isClosedDate(selectedDate)) return [];
    const daySlots = generateTimeSlotsForDate(selectedDate);
    const requiredSlots = service.duration / businessHours.intervalMinutes;
    const now = new Date();
    const todayString = formatDateToString(now);
    return daySlots.filter((time, index) => {
      const neededSlots = daySlots.slice(index, index + requiredSlots);
      if (neededSlots.length < requiredSlots) {
        return false;
      }
      const hasBookedSlot = neededSlots.some((slot) =>
        bookedSlots.includes(slot),
      );
      if (hasBookedSlot) {
        return false;
      }
      if (selectedDateString === todayString) {
        const [hours, minutes] = time.split(":").map(Number);
        const slotDate = new Date();
        slotDate.setHours(hours, minutes, 0, 0);
        if (slotDate <= now) {
          return false;
        }
      }
      return true;
    });
  }, [bookedSlots, service.duration, selectedDateString, selectedDate]);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-gray-100">
      <h2 className="text-lg font-bold text-purple-700 mb-2">
        Prenota il tuo appuntamento
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-purple-50 rounded p-3">
        <p className="text-sm text-gray-700">
          <strong>Servizio:</strong> {service.name}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Prezzo:</strong> {service.price}€
        </p>
        <p className="text-sm text-gray-700">
          <strong>Durata:</strong> {service.duration} minuti
        </p>
      </div>
      <label className="font-medium text-gray-700 mt-2">
        Seleziona una data
      </label>
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedTime("");
            setConfirmedBooking(null);
          }}
          disabled={[
            { before: new Date() },
            { dayOfWeek: Object.entries(businessHours.weekly).filter(([_, v]) => v.length === 0).map(([k]) => Number(k)) },
            ...businessHours.closedDates.map((d) => new Date(d)),
          ]}
          animate
        />
      </div>
      {selectedDate && (
        <>
          <label className="font-medium text-gray-700 mt-2">
            Orari disponibili
          </label>
          {selectedDate && (isClosedDay(selectedDate) || isClosedDate(selectedDate)) && (
            <div className="mt-2 p-3 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">
              Il negozio è chiuso in questa data. Seleziona un altro giorno.
            </div>
          )}
          {selectedDate && !(isClosedDay(selectedDate) || isClosedDate(selectedDate)) && (
            availableSlots.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-1 rounded border font-semibold transition-colors ${selectedTime === time ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-red-500">
                Nessun orario disponibile per questo giorno.
              </p>
            )
          )}

          {/* FORM INSERIMENTO DATI CLIENTE E CONFERMA */}
          {selectedTime && selectedDate && !(isClosedDay(selectedDate) || isClosedDate(selectedDate)) && (
            <form
              className="mt-4 flex flex-col gap-3 bg-purple-50 rounded p-4 border border-purple-200"
              onSubmit={(e) => {
                e.preventDefault();
                // Validazione telefono: almeno 8 cifre, solo numeri o +
                const phonePattern = /^\+?\d{8,}$/;
                if (!phonePattern.test(customerPhone)) {
                  setPhoneError(
                    "Inserisci un numero di telefono valido (almeno 8 cifre, solo numeri, opzionale +)",
                  );
                  return;
                }
                setPhoneError("");
                const booking = {
                  id: Date.now(),
                  serviceName: service.name,
                  servicePrice: service.price,
                  serviceDuration: service.duration,
                  date: selectedDateString,
                  time: selectedTime,
                  customerName,
                  customerPhone,
                  status: "confermato",
                };
                setPendingBooking(booking);
              }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                Conferma prenotazione
              </button>
            </form>
          )}

          {/* MODALE DI CONFERMA */}
          {pendingBooking && (
            <ConfirmBookingModal
              booking={pendingBooking}
              onConfirm={() => {
                addBooking(pendingBooking);
                setConfirmedBooking(pendingBooking);
                setPendingBooking(null);
                setSelectedTime("");
                setCustomerName("");
                setCustomerPhone("");
              }}
              onCancel={() => setPendingBooking(null)}
            />
          )}

          {/* MESSAGGIO DI SUCCESSO */}
          {confirmedBooking && (
            <div className="mt-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
              Prenotazione confermata per {confirmedBooking.customerName} il{" "}
              {confirmedBooking.date} alle {confirmedBooking.time}!
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingSection;
