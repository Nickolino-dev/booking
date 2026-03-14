import { useLocation } from "react-router-dom";
import BookingSection from "../components/BookingSection";

function BookingPage({ bookings, addBooking }) {
  const location = useLocation();
  const service = location.state?.service;

  return (
    <div className="page-container">
      <h1 className="section-title">Prenotazioni</h1>
      <p className="section-subtitle">
        Scegli data e orario per il trattamento selezionato.
      </p>

      {service ? (
        <BookingSection
          service={service}
          bookings={bookings}
          addBooking={addBooking}
        />
      ) : (
        <p>Nessun servizio selezionato.</p>
      )}
    </div>
  );
}

export default BookingPage;
