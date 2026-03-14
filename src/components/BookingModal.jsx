function BookingModal({ booking, onClose, deleteBooking, updateBooking }) {
  if (!booking) return null;

  function handleDelete() {
    deleteBooking(booking.id);
    onClose();
  }

  function setStatus(newStatus) {
    updateBooking(booking.id, { status: newStatus });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-md w-full p-6 relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-purple-700">
            Dettaglio appuntamento
          </h2>
          <button
            className="text-gray-400 hover:text-purple-700 text-2xl font-bold px-2 py-1 rounded-full focus:outline-none"
            onClick={onClose}
            type="button"
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div>
            <span className={`text-[11px] font-bold rounded-full px-2 py-0.5 whitespace-nowrap ${
              booking.status === "completato"
                ? "bg-emerald-100 text-emerald-700"
                : booking.status === "no-show"
                ? "bg-orange-100 text-orange-700"
                : booking.status === "cancellato"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {booking.status || "confermato"}
            </span>
          </div>
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
            <span className="font-semibold">Cliente:</span>{" "}
            {booking.customerName}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Telefono:</span>{" "}
            {booking.customerPhone}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Prezzo:</span>{" "}
            € {new Intl.NumberFormat("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(booking.servicePrice)}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Durata:</span>{" "}
            {booking.serviceDuration} minuti
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition"
              onClick={() => setStatus("completato")}
              type="button"
            >
              Segna completato
            </button>
            <button
              className="px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100 transition"
              onClick={() => setStatus("no-show")}
              type="button"
            >
              No-show
            </button>
            <button
              className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition"
              onClick={() => setStatus("confermato")}
              type="button"
            >
              Confermato
            </button>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              className="px-4 py-2 rounded-lg border border-purple-200 bg-white text-purple-700 font-semibold hover:bg-purple-100 transition"
              onClick={onClose}
              type="button"
            >
              Chiudi
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              onClick={handleDelete}
              type="button"
            >
              Elimina prenotazione
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
