import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import ConfirmBookingModal from "./ConfirmBookingModal";
import "./BookingSection.css";

function BookingSection({ service, bookings, addBooking }) {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);

  function generateTimeSlots(startHour, endHour, intervalMinutes) {
    const slots = [];

    const current = new Date();
    current.setHours(startHour, 0, 0, 0);

    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    while (current <= end) {
      const hours = String(current.getHours()).padStart(2, "0");
      const minutes = String(current.getMinutes()).padStart(2, "0");

      slots.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + intervalMinutes);
    }

    return slots;
  }

  const timeSlots = generateTimeSlots(9, 18, 15);

  function formatDateToString(date) {
    return date.toLocaleDateString("sv-SE");
  }

  const selectedDateString = selectedDate
    ? formatDateToString(selectedDate)
    : "";

  const bookedSlots = useMemo(() => {
    if (!selectedDateString) return [];

    const slots = [];

    bookings
      .filter((booking) => booking.date === selectedDateString)
      .forEach((booking) => {
        const startIndex = timeSlots.indexOf(booking.time);
        const slotCount = booking.serviceDuration / 15;

        for (let i = 0; i < slotCount; i++) {
          const slot = timeSlots[startIndex + i];
          if (slot) {
            slots.push(slot);
          }
        }
      });

    return slots;
  }, [selectedDateString, bookings, timeSlots]);

  const availableSlots = useMemo(() => {
    const requiredSlots = service.duration / 15;

    const now = new Date();
    const todayString = formatDateToString(now);

    return timeSlots.filter((time, index) => {
      const neededSlots = timeSlots.slice(index, index + requiredSlots);

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
  }, [timeSlots, bookedSlots, service.duration, selectedDateString]);

  function handleConfirmBooking() {
    if (!selectedDate) {
      alert("Seleziona una data.");
      return;
    }

    if (!selectedTime) {
      alert("Seleziona un orario.");
      return;
    }

    if (!customerName.trim()) {
      alert("Inserisci il nome.");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Inserisci il telefono.");
      return;
    }

    if (customerPhone.length < 8) {
      alert("Inserisci un numero di telefono valido.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
      date: selectedDateString,
      time: selectedTime,
      customerName,
      customerPhone,
    };

    setPendingBooking(newBooking);
  }

  function confirmBooking() {
    addBooking(pendingBooking);
    setConfirmedBooking(pendingBooking);

    setPendingBooking(null);
    setSelectedTime("");
    setCustomerName("");
    setCustomerPhone("");
  }

  return (
    <div className="booking-card">
      <h2>Prenota il tuo appuntamento</h2>

      <div className="booking-service-box">
        <p>
          <strong>Servizio:</strong> {service.name}
        </p>
        <p>
          <strong>Prezzo:</strong> {service.price}€
        </p>
        <p>
          <strong>Durata:</strong> {service.duration} minuti
        </p>
      </div>

      <label className="booking-label">Seleziona una data</label>

      <div className="calendar-wrapper">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedTime("");
            setConfirmedBooking(null);
          }}
          disabled={{ before: new Date() }}
          animate
        />
      </div>

      {selectedDate && (
        <>
          <label className="booking-label">Orari disponibili</label>

          {availableSlots.length > 0 ? (
            <div className="time-slots">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={
                    selectedTime === time ? "time-slot selected" : "time-slot"
                  }
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p>Nessun orario disponibile per questo giorno.</p>
          )}
        </>
      )}

      {selectedTime && (
        <>
          <div className="booking-fields">
            <input
              className="input-field"
              type="text"
              placeholder="Inserisci il tuo nome"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              className="input-field"
              type="text"
              placeholder="Inserisci il tuo telefono"
              value={customerPhone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setCustomerPhone(onlyNumbers);
              }}
            />
          </div>

          <div className="booking-summary">
            <p>
              <strong>Servizio:</strong> {service.name}
            </p>
            <p>
              <strong>Data:</strong> {selectedDateString}
            </p>
            <p>
              <strong>Ora:</strong> {selectedTime}
            </p>
          </div>

          <button
            type="button"
            className="booking-confirm-button"
            onClick={handleConfirmBooking}
          >
            Conferma prenotazione
          </button>
        </>
      )}

      {confirmedBooking && (
        <div className="booking-confirmed-box">
          <h3>Prenotazione confermata</h3>
          <p>
            <strong>Nome:</strong> {confirmedBooking.customerName}
          </p>
          <p>
            <strong>Telefono:</strong> {confirmedBooking.customerPhone}
          </p>
          <p>
            <strong>Servizio:</strong> {confirmedBooking.serviceName}
          </p>
          <p>
            <strong>Data:</strong> {confirmedBooking.date}
          </p>
          <p>
            <strong>Ora:</strong> {confirmedBooking.time}
          </p>
        </div>
      )}

      <ConfirmBookingModal
        booking={pendingBooking}
        onConfirm={confirmBooking}
        onCancel={() => setPendingBooking(null)}
      />
    </div>
  );
}

export default BookingSection;
