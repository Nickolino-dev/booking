import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "./BookingModal.css";
import { businessHours, generateTimeSlotsForDate, isClosedDay, isClosedDate } from "../data/businessHours";
import services from "../data/services";

function formatDateToString(date) {
  return date.toLocaleDateString("sv-SE");
}

function NewBookingModal({ open, onClose, onCreate }) {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedServiceId(services[0]?.id ?? null);
      setSelectedDate(null);
      setSelectedTime("");
      setCustomerName("");
      setCustomerPhone("");
      setPhoneError("");
    }
  }, [open]);

  const service = useMemo(() => services.find((s) => s.id === selectedServiceId) || services[0], [selectedServiceId]);

  const selectedDateString = selectedDate ? formatDateToString(selectedDate) : "";

  const daySlots = useMemo(() => {
    if (!selectedDate) return [];
    if (isClosedDay(selectedDate) || isClosedDate(selectedDate)) return [];
    return generateTimeSlotsForDate(selectedDate);
  }, [selectedDate]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const requiredSlots = service.duration / businessHours.intervalMinutes;
    return daySlots.filter((time, index) => {
      const needed = daySlots.slice(index, index + requiredSlots);
      if (needed.length < requiredSlots) return false;
      return true;
    });
  }, [daySlots, service]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const phonePattern = /^\+?\d{8,}$/;
    if (!phonePattern.test(customerPhone)) {
      setPhoneError("Inserisci un numero di telefono valido (almeno 8 cifre, solo numeri, opzionale +)");
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
    onCreate(booking);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-4xl w-full mx-auto p-4 md:p-6 relative"
        style={{ maxHeight: '90vh', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg md:text-xl font-bold text-purple-700">Nuova prenotazione</h2>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-purple-700">×</button>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: 'calc(90vh - 160px)' }}>
          {/* Left: calendario */}
          <div className="overflow-auto rounded p-2 bg-purple-50 border border-purple-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(d) => setSelectedDate(d)}
              disabled={[{ before: new Date() }, { dayOfWeek: Object.entries(businessHours.weekly).filter(([_, v]) => v.length === 0).map(([k]) => Number(k)) }, ...businessHours.closedDates.map((d) => new Date(d))]}
            />
          </div>

          {/* Right: form e orari */}
          <div className="flex flex-col gap-3 overflow-auto p-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Servizio</label>
              <select value={selectedServiceId} onChange={(e) => setSelectedServiceId(Number(e.target.value))} className="mt-1 block w-full rounded border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - € {s.price}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-gray-700">Orario</label>
              {selectedDate ? (
                (isClosedDay(selectedDate) || isClosedDate(selectedDate)) ? (
                  <div className="mt-2 p-3 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">Il negozio è chiuso in questa data. Seleziona un altro giorno.</div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableSlots.length > 0 ? availableSlots.map((time) => (
                      <button key={time} type="button" onClick={() => setSelectedTime(time)} className={`px-3 py-1 rounded border font-semibold transition-colors ${selectedTime === time ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"}`}>{time}</button>
                    )) : <p className="text-red-500">Nessun orario disponibile per questo giorno.</p>}
                  </div>
                )
              ) : (
                <p className="text-gray-500 text-sm mt-2">Seleziona una data per vedere gli orari disponibili</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Cognome</label>
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 mt-2">
                <label className="block text-sm font-medium text-gray-700">Numero di telefono</label>
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500" />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>
              <div className="flex-1 mt-2">
                <label className="block text-sm font-medium text-gray-700">Email (opzionale)</label>
                <input value={""} onChange={() => {}} placeholder="es. nome@dominio.it" className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-purple-200 bg-white text-purple-700 font-semibold hover:bg-purple-100 transition">Annulla</button>
              <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">Aggiungi prenotazione</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBookingModal;
