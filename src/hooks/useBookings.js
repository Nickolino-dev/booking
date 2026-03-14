import { useEffect, useState } from "react";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

export function useBookings() {
  const [bookings, setBookings] = useState(() => loadFromLocalStorage("bookings", []));

  function addBooking(newBooking) {
    // Inizializza stato default se non presente
    const bookingWithDefaults = {
      status: "confermato", // confermato | completato | no-show | cancellato
      ...newBooking,
    };
    setBookings((prevBookings) => [...prevBookings, bookingWithDefaults]);
  }

  function updateBooking(bookingId, updates) {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b))
    );
  }

  function deleteBooking(bookingId) {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== bookingId)
    );
  }

  useEffect(() => {
    saveToLocalStorage("bookings", bookings);
  }, [bookings]);

  return { bookings, addBooking, updateBooking, deleteBooking };
}
