import { useState } from "react";
import BookingModal from "../components/BookingModal";
import { useBookingsContext } from "../context/BookingsContext";

function getStartOfWeek(date) {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  newDate.setDate(newDate.getDate() + diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function getWeekDays(startDate) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }
  return days;
}

function formatDateToString(date) {
  return date.toLocaleDateString("sv-SE");
}

function isToday(date) {
  const today = new Date();
  return formatDateToString(date) === formatDateToString(today);
}

function AdminPage() {
  const { bookings, updateBooking, deleteBooking } = useBookingsContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchService, setSearchService] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calcola settimana corrente
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = getWeekDays(startOfWeek);
  const endOfWeek = weekDays[6];
  const weekDates = weekDays.map((d) => formatDateToString(d));

  // Filtri
  const filteredBookings = bookings.filter((b) => {
    const matchName =
      searchName.trim() === "" ||
      (b.customerName &&
        b.customerName.toLowerCase().includes(searchName.toLowerCase()));
    const matchService =
      searchService.trim() === "" ||
      (b.serviceName &&
        b.serviceName.toLowerCase().includes(searchService.toLowerCase()));
    const matchPhone =
      searchPhone.trim() === "" ||
      (b.customerPhone &&
        String(b.customerPhone).toLowerCase().includes(searchPhone.toLowerCase()));
    const matchStatus =
      statusFilter === "all" || (b.status && b.status === statusFilter);
    return matchName && matchService && matchPhone && matchStatus;
  });

  // Prenotazioni della settimana dopo i filtri
  const weekBookings = filteredBookings.filter((b) => weekDates.includes(b.date));

  // KPI settimana
  const weekTotal = weekBookings.length;
  const weekRevenue = weekBookings.reduce(
    (sum, b) => sum + (parseFloat(b.servicePrice) || 0),
    0,
  );
  const weekMinutes = weekBookings.reduce(
    (sum, b) => sum + (parseInt(b.serviceDuration) || 0),
    0,
  );

  function goToPreviousWeek() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  function goToNextWeek() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function exportWeekToCSV() {
    const headers = [
      "ID",
      "Data",
      "Ora",
      "Cliente",
      "Telefono",
      "Servizio",
      "Prezzo",
      "Durata(min)",
    ];
    const rows = weekBookings
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
      .map((b) => [
        b.id,
        b.date,
        b.time,
        b.customerName,
        b.customerPhone,
        b.serviceName,
        b.servicePrice,
        b.serviceDuration,
      ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prenotazioni_${formatDisplayDate(startOfWeek)}-${formatDisplayDate(endOfWeek)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setSearchName("");
    setSearchService("");
    setSearchPhone("");
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Admin</h1>

      {/* FILTRI DI RICERCA */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Cerca per nome cliente..."
          className="px-3 py-2 rounded border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cerca per servizio..."
          className="px-3 py-2 rounded border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cerca per telefono..."
          className="px-3 py-2 rounded border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tutti gli stati</option>
          <option value="confermato">Confermato</option>
          <option value="completato">Completato</option>
          <option value="no-show">No-show</option>
          <option value="cancellato">Cancellato</option>
        </select>
        <button
          className="px-3 py-2 rounded bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
          onClick={clearFilters}
          type="button"
        >
          Pulisci filtri
        </button>
      </div>

      {/* INTESTAZIONE SETTIMANA + KPI */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 bg-purple-50 rounded p-3">
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-sm text-gray-700">Settimana visualizzata</p>
          <h2 className="text-lg font-semibold text-purple-700">
            {formatDisplayDate(startOfWeek)} - {formatDisplayDate(endOfWeek)}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-right">
            <span className="block text-xs text-gray-500">Appuntamenti</span>
            <span className="text-2xl font-bold text-purple-700">{weekTotal}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-gray-500">Ricavi</span>
            <span className="text-2xl font-bold text-emerald-600">€ {weekRevenue.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-gray-500">Minuti</span>
            <span className="text-2xl font-bold text-blue-600">{weekMinutes}</span>
          </div>
        </div>
      </div>

      {/* NAV SETTIMANA + AZIONI */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
          onClick={goToPreviousWeek}
          type="button"
        >
          ← Settimana precedente
        </button>
        <button
          className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
          onClick={goToNextWeek}
          type="button"
        >
          Settimana successiva →
        </button>
        <button
          className="px-3 py-1 rounded bg-white border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition"
          onClick={goToToday}
          type="button"
        >
          Oggi
        </button>
        <button
          className="ml-auto px-3 py-1 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          onClick={exportWeekToCSV}
          type="button"
        >
          Esporta CSV settimana
        </button>
      </div>

      {/* GRIGLIA SETTIMANALE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dateString = formatDateToString(day);
          const dayBookings = weekBookings
            .filter((booking) => booking.date === dateString)
            .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

          const dayRevenue = dayBookings.reduce(
            (sum, b) => sum + (parseFloat(b.servicePrice) || 0),
            0,
          );
          const dayMinutes = dayBookings.reduce(
            (sum, b) => sum + (parseInt(b.serviceDuration) || 0),
            0,
          );

          return (
            <div
              key={dateString}
              className={`rounded-lg border p-2 flex flex-col gap-2 relative ${isToday(day) ? "bg-purple-100 border-purple-500 shadow-lg" : "bg-white border-gray-200"}`}
            >
              <div className="flex flex-col items-center mb-2 relative">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  {day.toLocaleDateString("it-IT", { weekday: "long" })}
                  {isToday(day) && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold animate-pulse">
                      OGGI
                    </span>
                  )}
                </h3>
                <p
                  className={`text-xs ${isToday(day) ? "text-purple-700 font-semibold" : "text-gray-500"}`}
                >
                  {dateString}
                </p>
                {/* Badge ricavi/tempo rimossi per ridurre l'affollamento visivo */}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-700 font-semibold">
                    {dayBookings.length}{" "}
                    {dayBookings.length === 1 ? "appuntamento" : "appuntamenti"}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-xs bg-purple-200 text-purple-800 rounded-full px-2 py-0.5 font-bold">
                      +{dayBookings.length}
                    </span>
                  )}
                </div>
                {dayBookings.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center">Nessuna prenotazione</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {dayBookings.map((booking) => (
                      <button
                        key={booking.id}
                        className="flex items-center gap-2 px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-medium border border-purple-100 hover:border-purple-300 transition text-left shadow-sm w-full overflow-hidden"
                        onClick={() => setSelectedBooking(booking)}
                        style={{ minHeight: "32px" }}
                        type="button"
                      >
                        <span className="font-bold text-purple-700 whitespace-nowrap">{booking.time}</span>
                        <span className="bg-purple-200 text-purple-800 rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap">
                          {booking.serviceName}
                        </span>
                        <span className="text-gray-700 font-semibold truncate max-w-[80px]">
                          {booking.customerName}
                        </span>
                        <span className="text-gray-400 whitespace-nowrap">
                          {booking.customerPhone}
                        </span>
                        <span
                          className={`text-[10px] font-bold rounded-full px-2 py-0.5 whitespace-nowrap ${
                            booking.status === "completato"
                              ? "bg-emerald-100 text-emerald-700"
                              : booking.status === "no-show"
                              ? "bg-orange-100 text-orange-700"
                              : booking.status === "cancellato"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {booking.status || "confermato"}
                        </span>
                        {booking.servicePrice != null && (
                          <span className="ml-auto text-emerald-700 font-bold whitespace-nowrap">€ {booking.servicePrice}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <BookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        deleteBooking={deleteBooking}
        updateBooking={updateBooking}
      />
    </div>
  );
}

export default AdminPage;
