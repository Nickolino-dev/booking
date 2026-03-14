import { useState } from "react";
import services from "../data/services";
import ServiceCard from "../components/ServiceCard";
import BookingSection from "../components/BookingSection";
import { useBookingsContext } from "../context/BookingsContext";

function BookingPage() {
  const [selectedService, setSelectedService] = useState(null);
  const { bookings, addBooking } = useBookingsContext();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Nuova prenotazione</h1>
      <p className="text-gray-600 mb-6">Scegli un trattamento, poi seleziona data e orario.</p>

      {!selectedService && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={() => setSelectedService(service)}
            />
          ))}
        </div>
      )}

      {selectedService && (
        <BookingSection
          service={selectedService}
          bookings={bookings}
          addBooking={addBooking}
        />
      )}
    </div>
  );
}

export default BookingPage;
