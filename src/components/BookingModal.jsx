import "./BookingModal.css";

function BookingModal({ booking, onClose, deleteBooking }) {
  if (!booking) return null;

  function handleDelete() {
    deleteBooking(booking.id);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Dettaglio appuntamento</h2>
          <button className="modal-close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <p>
            <strong>Servizio:</strong> {booking.serviceName}
          </p>
          <p>
            <strong>Data:</strong> {booking.date}
          </p>
          <p>
            <strong>Ora:</strong> {booking.time}
          </p>
          <p>
            <strong>Cliente:</strong> {booking.customerName}
          </p>
          <p>
            <strong>Telefono:</strong> {booking.customerPhone}
          </p>
          <p>
            <strong>Prezzo:</strong> {booking.servicePrice}€
          </p>
          <p>
            <strong>Durata:</strong> {booking.serviceDuration} minuti
          </p>
        </div>

        <div className="modal-actions">
          <button className="modal-secondary-button" onClick={onClose}>
            Chiudi
          </button>

          <button className="modal-delete-button" onClick={handleDelete}>
            Elimina prenotazione
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
