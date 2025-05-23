import CApiUrl from '@/constant/CApiUrl';

import { useFile } from '@/context/FileProvider';

import Request from './Request';

const Api = () => {
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

export default Api;
