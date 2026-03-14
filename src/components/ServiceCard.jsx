import "./ServiceCard.css";

function ServiceCard({ service, onBook }) {
  return (
    <div className="service-card">
      <span className="service-card-badge">Trattamento</span>
      <h3 className="service-card-title">{service.name}</h3>
      <p className="service-card-meta">Prezzo: {service.price}€</p>
      <p className="service-card-meta">Durata: {service.duration} minuti</p>

      <button className="service-card-button" onClick={onBook}>
        Prenota
      </button>
    </div>
  );
}

export default ServiceCard;
