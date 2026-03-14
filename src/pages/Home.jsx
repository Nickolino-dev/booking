import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-12">
      <section className="flex flex-col items-center text-center gap-4 mb-10">
        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          Beauty Booking
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Cura, bellezza e benessere
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Benvenuta/o nel nostro centro. Scopri i nostri trattamenti e prenota in pochi passaggi.
        </p>
        <div className="flex gap-3 mt-2">
          <Link
            to="/booking"
            className="px-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Nuova prenotazione
          </Link>
          <a
            href="#servizi"
            className="px-4 py-2 rounded-md border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition"
          >
            Scopri di più
          </a>
        </div>
      </section>

      <section id="servizi" className="grid md:grid-cols-3 gap-6 text-left">
        <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Professionalità</h3>
          <p className="text-gray-600 text-sm">Team qualificato e prodotti selezionati per garantire qualità e risultati.</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Ambiente accogliente</h3>
          <p className="text-gray-600 text-sm">Un luogo pensato per il tuo relax, con attenzione ai dettagli.</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Prenotazione semplice</h3>
          <p className="text-gray-600 text-sm">Scegli il trattamento, la data e l’orario: al resto pensiamo noi.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
