/**
 * Diekspos ke script user sebagai fungsi `zquery(scriptId, single, field)`.
 *
 * `readQuery(scriptId)` mengembalikan hasil script dari cache react-query
 * (undefined selama belum ada). Di expression, ScriptEngine juga
 * menjalankan query-nya dan me-render ulang komponen saat hasilnya datang.
 * Di mode builder query tidak dijalankan dan hasilnya selalu null.
 */
const QueryContext = ({ isBuilder, readQuery }) => {
  return (scriptId, single = false, field = null) => {
    if (isBuilder) return null;

    const result = readQuery(scriptId);

    if (single) {
      return result && result.length > 0 ? result[0][field].toString() : null;
    }
    return result;
  };
};

export default QueryContext;
