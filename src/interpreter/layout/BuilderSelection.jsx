import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import createStore from '@/helpers/createStore';

const BuilderSelectionContext = createContext(null);

const noopSubscribe = () => () => {};

/**
 * Komponen terpilih di canvas builder. Id-nya disimpan di store, bukan
 * diteruskan sebagai prop, sehingga saat seleksi berpindah hanya frame
 * komponen lama dan baru yang re-render, bukan seluruh canvas.
 */
export const BuilderSelectionProvider = (props) => {
  const { children, selectedId, onSelect } = props;

  const [store] = useState(() => createStore(selectedId ?? null));
  const latestOnSelect = useRef(onSelect);
  latestOnSelect.current = onSelect;

  useLayoutEffect(() => {
    store.setState(selectedId ?? null);
  }, [selectedId]);

  const value = useMemo(
    () => ({
      store,
      select: (component) => latestOnSelect.current?.(component),
    }),
    [store],
  );

  return (
    <BuilderSelectionContext.Provider value={value}>
      {children}
    </BuilderSelectionContext.Provider>
  );
};

/** `isSelected` untuk komponen `id` dan fungsi `select(component)`. */
export const useBuilderSelection = (id) => {
  const selection = useContext(BuilderSelectionContext);

  const isSelected = useSyncExternalStore(
    selection?.store.subscribe ?? noopSubscribe,
    () => selection?.store.getState() === id,
  );

  return { isSelected, select: selection?.select };
};
