function ConfirmBookingModal({ booking, onConfirm, onCancel }) {
  if (!booking) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-md w-full p-6 relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">
          Conferma prenotazione
        </h2>
        <div className="flex flex-col gap-2 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Servizio:</span>{" "}
            {booking.serviceName}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Data:</span> {booking.date}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Ora:</span> {booking.time}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Nome:</span> {booking.customerName}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Telefono:</span>{" "}
            {booking.customerPhone}
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-2 rounded-lg border border-purple-200 bg-white text-purple-700 font-semibold hover:bg-purple-100 transition"
            onClick={onCancel}
            type="button"
          >
            Annulla
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            onClick={onConfirm}
            type="button"
          >
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingModal;
