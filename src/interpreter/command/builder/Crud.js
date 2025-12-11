import CApiUrl from '@configs/CApiUrl';
import { useFile } from '@/contexts/FileProvider';
import Request from '@/hooks/Request';

const Crud = () => {
  const request = Request();
  const { file } = useFile();

  const create = (body) => {
    return request.post(CApiUrl.common.create, body, true, file);
  };

  const update = (body) => {
    return request.post(CApiUrl.common.update, body, true, file);
  };

  const detail = (param) => {
    return request.get(CApiUrl.common.detail, param);
  };

  return { create, detail, update };
};

export default Crud;
