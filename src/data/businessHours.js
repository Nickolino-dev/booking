// Configurazione orari di lavoro e chiusure
// Giorni settimana: 0=Dom, 1=Lun, 2=Mar, 3=Mer, 4=Gio, 5=Ven, 6=Sab

export const businessHours = {
  // Intervalli orari per ciascun giorno (stringhe HH:MM)
  weekly: {
    0: [], // Domenica chiuso
    1: [], // Lunedì chiuso
    2: [{ start: "09:00", end: "18:00" }],
    3: [{ start: "09:00", end: "18:00" }],
    4: [{ start: "09:00", end: "18:00" }],
    5: [{ start: "09:00", end: "18:00" }],
    6: [{ start: "09:00", end: "18:00" }],
  },
  // Durata slot in minuti
  intervalMinutes: 15,
  // Date chiuse straordinarie in formato ISO breve (YYYY-MM-DD)
  closedDates: [
    // "2026-08-15", // Ferragosto (esempio)
  ],
};

export function isClosedDate(date) {
  const ds = date.toLocaleDateString("sv-SE");
  return businessHours.closedDates.includes(ds);
}

export function getIntervalsForDate(date) {
  const dow = date.getDay();
  return businessHours.weekly[dow] || [];
}

export function isClosedDay(date) {
  return getIntervalsForDate(date).length === 0 || isClosedDate(date);
}

export function generateTimeSlotsForDate(date) {
  const intervals = getIntervalsForDate(date);
  const step = businessHours.intervalMinutes;
  const slots = [];
  for (const { start, end } of intervals) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const cur = new Date(date);
    cur.setHours(sh, sm, 0, 0);
    const endD = new Date(date);
    endD.setHours(eh, em, 0, 0);
    while (cur <= endD) {
      const h = String(cur.getHours()).padStart(2, "0");
      const m = String(cur.getMinutes()).padStart(2, "0");
      slots.push(`${h}:${m}`);
      cur.setMinutes(cur.getMinutes() + step);
    }
  }
  return slots;
}
