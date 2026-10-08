/**
 * Diekspos ke script user sebagai `zbuilder.crud`.
 * `latest` adalah ref berisi request, config, dan file terbaru.
 */
const Crud = (latest) => {
  // Dikirim sebagai multipart supaya file ikut terkirim dan body bisa
  // dibaca middleware parseJsonData di API
  const create = (body) => {
    const { config, file, request } = latest.current;
    return request.post(config.api.common.create, body, file, false);
  };

  const update = (body) => {
    const { config, file, request } = latest.current;
    return request.post(config.api.common.update, body, file, false);
  };

  const detail = (param) => {
    const { config, request } = latest.current;
    return request.get(config.api.common.detail, param);
  };

  return { create, detail, update };
};

export default Crud;
