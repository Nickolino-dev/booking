import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const location = useLocation();

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");

    if (savedBookings) {
      return JSON.parse(savedBookings);
    }

    return [];
  });

  function addBooking(newBooking) {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
  }

  function deleteBooking(bookingId) {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== bookingId),
    );
  }

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const titles = {
    "/": "Centro Estetico",
    "/booking": "Prenota appuntamento",
    "/admin": "Dashboard Admin",
  };

  const title = titles[location.pathname] || "Centro Estetico";

  return (
    <div className="app-shell">
      <AppBar title={title} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/booking"
            element={
              <BookingPage bookings={bookings} addBooking={addBooking} />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage bookings={bookings} deleteBooking={deleteBooking} />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
