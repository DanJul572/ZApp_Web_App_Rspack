/**
 * Store sederhana di luar React. Komponen bisa subscribe dan hanya
 * re-render jika nilai yang dibacanya berubah, berbeda dengan context
 * yang me-render ulang semua consumer setiap kali value berubah.
 *
 * `setState` menerima nilai baru atau fungsi `(prev) => next`.
 */
const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const setState = (next) => {
    const value = typeof next === 'function' ? next(state) : next;
    if (Object.is(value, state)) return;

    state = value;
    for (const listener of [...listeners]) listener();
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
};

export default createStore;

/**
 * Pembaca default untuk factory API yang menerima `read(store, select)`.
 * ScriptEngine mengganti fungsi ini dengan pembaca yang mencatat nilai
 * yang dibaca (lihat interpreter/script/readTracker).
 */
export const readState = (store, select) => select(store.getState());
