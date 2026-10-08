/**
 * Mencatat nilai store yang dibaca selama satu render (formData.get,
 * uiStore.get, parameter.get, zreport.loading, zquery). Dengan catatan
 * ini komponen hanya di-render ulang jika nilai yang benar-benar dipakainya
 * berubah, bukan setiap kali ada field form mana pun yang berubah.
 *
 * Store berupa `{ getState, subscribe }`. Hasil zquery dicatat dengan
 * store tanpa `subscribe`; perubahannya dipantau lewat QueryObserver.
 */
const createReadTracker = () => {
  const reads = [];
  const queryIds = new Set();

  const read = (store, select) => {
    const value = select(store.getState());
    reads.push({ store, select, value });
    return value;
  };

  const readQuery = (scriptId, store) => {
    queryIds.add(scriptId);
    return read(store, (response) => response?.data);
  };

  const isStale = () =>
    reads.some(
      ({ store, select, value }) => !Object.is(select(store.getState()), value),
    );

  const subscribableStores = () =>
    new Set(reads.map(({ store }) => store).filter((store) => store.subscribe));

  return { isStale, queryIds, read, readQuery, subscribableStores };
};

export default createReadTracker;
