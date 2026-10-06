import { useConfig } from '@/contexts/ConfigProvider';
import { useFile } from '@/contexts/FileProvider';
import Request from '@/hooks/Request';

/**
 * Diekspos ke script user sebagai `zbuilder.crud`.
 */
const Crud = () => {
  const request = Request();

  const { file } = useFile();
  const { config } = useConfig();

  // Dikirim sebagai multipart supaya file ikut terkirim dan body bisa
  // dibaca middleware parseJsonData di API
  const create = (body) => {
    return request.post(config.api.common.create, body, file, false);
  };

  const update = (body) => {
    return request.post(config.api.common.update, body, file, false);
  };

  const detail = (param) => {
    return request.get(config.api.common.detail, param);
  };

  return { create, detail, update };
};

export default Crud;
