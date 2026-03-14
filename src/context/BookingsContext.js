import { createContext, useContext } from "react";

export const BookingsContext = createContext(null);

export function useBookingsContext() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error(
      "useBookingsContext deve essere usato all'interno di BookingsProvider",
    );
  }
  return context;
}
