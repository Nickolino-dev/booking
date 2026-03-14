// Funzione di utilità per gestire il salvataggio e caricamento sicuro da localStorage
export function loadFromLocalStorage(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Errore parsing ${key} da localStorage`, e);
  }
  return fallback;
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Errore salvataggio ${key} su localStorage`, e);
  }
}
