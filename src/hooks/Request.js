import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';
import statusCode from '@/enums/EStatusCode';
import { clearLocalStorage } from '@/helpers/clearLocalStorage';

const Request = () => {
  const navigate = useNavigate();
  const { config } = useConfig();

  const api = useMemo(() => {
    return axios.create({
      baseURL: config.api.base,
      headers: {
        Accept: 'application/json',
      },
      withCredentials: true,
    });
  }, [config.api.base]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response.status;

        switch (status) {
          case statusCode.INTERNAL_SERVER_ERROR:
            navigate('/server-error', { replace: true });
            break;

          case statusCode.UNAUTHORIZED:
          case statusCode.FORBIDDEN:
            clearLocalStorage();
            navigate('/login', { replace: true });
            break;

          default:
            break;
        }

        return Promise.reject(error.response.data || error.message);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api, navigate]);

  const get = async (url, params = {}) => {
    const { data } = await api.get(url, { params });
    return data;
  };

  const post = async (url, body, files = []) => {
    const formData = new FormData();

    if (files.length) {
      files?.forEach((file) => {
        formData.append('files', file.file, file.id);
      });
    }

    formData.append('data', JSON.stringify(body));

    const { data } = await api.post(url, formData);
    return data;
  };

  return { get, post };
};

export default Request;
