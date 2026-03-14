function ServiceCard({ service, onBook }) {
  const formatPrice = (value) =>
    `€ ${new Intl.NumberFormat("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value))}`;

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 border border-gray-100 hover:shadow-lg transition">
      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
        Trattamento
      </span>
      <h3 className="text-lg font-bold text-gray-800 text-center">
        {service.name}
      </h3>
      <p className="text-gray-600 text-sm">
        Prezzo: <span className="font-semibold">{formatPrice(service.price)}</span>
      </p>
      <p className="text-gray-600 text-sm">
        Durata: <span className="font-semibold">{service.duration} minuti</span>
      </p>
      <button
        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-1.5 rounded transition"
        onClick={onBook}
      >
        Prenota
      </button>
    </div>
  );
}

export default ServiceCard;
