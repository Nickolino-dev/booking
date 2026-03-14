import { useNavigate } from "react-router-dom";
import services from "../data/services";
import ServiceCard from "../components/ServiceCard";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  function handleSelectService(service) {
    navigate("/booking", {
      state: { service },
    });
  }

  return (
    <div className="page-container">
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="home-hero-badge">Prenotazione online</span>
          <h1 className="section-title">Prenota il tuo appuntamento</h1>
          <p className="section-subtitle">
            Scegli il trattamento che preferisci, seleziona data e orario e
            gestisci tutto in modo semplice.
          </p>
        </div>
      </section>

      <h2>I nostri servizi</h2>

      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBook={() => handleSelectService(service)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
