import { useConfig } from '@/contexts/ConfigProvider';
import { useFile } from '@/contexts/FileProvider';
import Request from '@/hooks/Request';

const Crud = () => {
  const request = Request();

  const { file } = useFile();
  const { config } = useConfig();

  const create = (body) => {
    return request.post(config.api.common.create, body, file);
  };

  const update = (body) => {
    return request.post(config.api.common.update, body, file);
  };

  const detail = (param) => {
    return request.get(config.api.common.detail, param);
  };

  return { create, detail, update };
};

export default Crud;
