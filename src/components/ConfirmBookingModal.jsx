import "./ConfirmBookingModal.css";

function ConfirmBookingModal({ booking, onConfirm, onCancel }) {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Conferma prenotazione</h2>

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
            <strong>Nome:</strong> {booking.customerName}
          </p>
          <p>
            <strong>Telefono:</strong> {booking.customerPhone}
          </p>
        </div>

        <div className="modal-actions">
          <button className="modal-secondary-button" onClick={onCancel}>
            Annulla
          </button>

          <button className="modal-primary-button" onClick={onConfirm}>
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingModal;
