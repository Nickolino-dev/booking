import { Routes, Route, useLocation } from "react-router-dom";
import { BookingsProvider } from "./context/BookingsProvider";
import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const location = useLocation();

  const titles = {
    "/": "Tizy & Lory",
    "/booking": "Prenota appuntamento",
    "/admin": "Dashboard Admin",
  };

  const title = titles[location.pathname] || "Centro Estetico";

  return (
    <BookingsProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
        <AppBar title={title} />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BookingsProvider>
  );
}

export default App;
