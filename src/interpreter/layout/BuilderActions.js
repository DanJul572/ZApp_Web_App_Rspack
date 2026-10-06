import { createContext, useContext } from 'react';

/**
 * Aksi edit content yang bisa dipanggil langsung dari canvas builder
 * (mis. resize kolom grid). Disediakan oleh BuilderDnd; null di luar builder.
 *
 * - `updateComponent(id, updater)`: ganti komponen dengan hasil `updater`
 */
export const BuilderActionsContext = createContext(null);

export const useBuilderActions = () => useContext(BuilderActionsContext);
