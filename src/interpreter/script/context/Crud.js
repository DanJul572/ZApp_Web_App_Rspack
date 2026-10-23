/**
 * Diekspos ke script user sebagai `zbuilder.crud`.
 * `latest` adalah ref berisi request dan config terbaru.
 */

// Field file menyimpan File yang dipilih sampai data disimpan. File dikirim
// sebagai part multipart dengan nama field-nya, sisanya sebagai JSON
const splitFiles = (body) => {
  const data = { ...body.data };
  const files = [];

  for (const [field, value] of Object.entries(data)) {
    if (value instanceof File) {
      files.push({ field, file: value });
      delete data[field];
    }
  }

  return { body: { ...body, data }, files };
};

const Crud = (latest) => {
  // Dikirim sebagai multipart supaya file ikut terkirim dan body bisa
  // dibaca middleware parseJsonData di API
  const create = (body) => {
    const { config, request } = latest.current;
    const split = splitFiles(body);
    return request.post(
      config.api.common.create,
      split.body,
      split.files,
      false,
    );
  };

  const update = (body) => {
    const { config, request } = latest.current;
    const split = splitFiles(body);
    return request.post(
      config.api.common.update,
      split.body,
      split.files,
      false,
    );
  };

  const detail = (param) => {
    const { config, request } = latest.current;
    return request.get(config.api.common.detail, param);
  };

  return { create, detail, update };
};

export default Crud;
