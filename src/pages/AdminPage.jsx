import { useState } from "react";
import BookingModal from "../components/BookingModal";
import "./AdminPage.css";

function AdminPage({ bookings, deleteBooking }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);

  function formatDateToString(date) {
    return date.toLocaleDateString("sv-SE");
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

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

  function isToday(date) {
    const today = new Date();
    return formatDateToString(date) === formatDateToString(today);
  }

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

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = getWeekDays(startOfWeek);
  const endOfWeek = weekDays[6];

  const sortedBookings = [...bookings].sort((a, b) => {
    const first = `${a.date} ${a.time}`;
    const second = `${b.date} ${b.time}`;
    return first.localeCompare(second);
  });

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1 className="section-title">Dashboard Admin</h1>
      </div>

      <div className="week-range-box">
        <p className="week-range-label">Settimana visualizzata</p>
        <h2 className="week-range-title">
          {formatDisplayDate(startOfWeek)} - {formatDisplayDate(endOfWeek)}
        </h2>
      </div>

      <div className="week-navigation">
        <button className="week-nav-button" onClick={goToPreviousWeek}>
          ← Settimana precedente
        </button>

        <button className="week-nav-button" onClick={goToNextWeek}>
          Settimana successiva →
        </button>
      </div>

      <div className="weekly-calendar">
        {weekDays.map((day) => {
          const dateString = formatDateToString(day);

          const dayBookings = sortedBookings.filter(
            (booking) => booking.date === dateString,
          );

          return (
            <div
              key={dateString}
              className={isToday(day) ? "week-column today" : "week-column"}
            >
              <div className="week-column-header">
                <h3>{day.toLocaleDateString("it-IT", { weekday: "long" })}</h3>
                <p>{dateString}</p>
              </div>

              <div className="week-column-body">
                {dayBookings.length === 0 ? (
                  <p className="week-empty">Nessuna prenotazione</p>
                ) : (
                  <>
                    <p className="week-summary-count">
                      {dayBookings.length} appuntamento
                      {dayBookings.length > 1 ? "i" : ""}
                    </p>

                    <div className="week-summary-list">
                      {dayBookings.map((booking) => (
                        <button
                          key={booking.id}
                          className="week-summary-item"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <span className="week-summary-time">
                            {booking.time}
                          </span>
                          <span className="week-summary-service">
                            {booking.serviceName}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
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
      />
    </div>
  );
}

export default AdminPage;
