import Script from '@/hooks/Script';

/**
 * Diekspos ke script user sebagai fungsi `zquery(scriptId, single, field)`.
 *
 * Memanggil hook, jadi hanya boleh dipakai di expression property yang
 * dievaluasi saat render — bukan di script aksi (onClick, onLoad).
 * Di mode builder query tidak dijalankan dan hasilnya selalu null.
 */
const QueryContext = ({ isBuilder }) => {
  return (scriptId, single = false, field = null) => {
    const result = Script({ id: isBuilder ? null : scriptId }).val;

    if (isBuilder) return null;

    if (single) {
      return result && result.length > 0 ? result[0][field].toString() : null;
    }
    return result;
  };
};

export default QueryContext;
