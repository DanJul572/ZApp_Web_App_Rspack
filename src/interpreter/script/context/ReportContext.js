/**
 * Diekspos ke script user sebagai `zreport`.
 * `loading` dibaca lewat `read` agar komponen yang memakainya ikut
 * re-render saat report selesai dirender.
 */
const ReportContext = (runtime, read) => {
  const { latest, stores } = runtime;

  return {
    open: (...args) => latest.current.report.open(...args),
    download: (...args) => latest.current.report.download(...args),
    get loading() {
      return read(stores.report, (loading) => loading);
    },
  };
};

export default ReportContext;
