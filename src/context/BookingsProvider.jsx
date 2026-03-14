import { BookingsContext } from "../context/BookingsContext";
import { useBookings } from "../hooks/useBookings";

export function BookingsProvider({ children }) {
  const bookingsHook = useBookings();
  return (
    <BookingsContext.Provider value={bookingsHook}>
      {children}
    </BookingsContext.Provider>
  );
}
