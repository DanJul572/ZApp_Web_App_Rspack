import CApiUrl from '@configs/CApiUrl';
import { useFile } from '@/contexts/FileProvider';
import Request from '@/hooks/Request';

const Crud = () => {
  const { get, post } = Request();
  const { file } = useFile();

  const create = (body) => {
    return post(CApiUrl.common.create, body, true, file);
  };

  const update = (body) => {
    return post(CApiUrl.common.update, body, true, file);
  };

  const detail = (param) => {
    return get(CApiUrl.common.detail, param);
  };

  return { create, detail, update };
};

export default Crud;
