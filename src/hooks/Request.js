import axios from 'axios';
import { useNavigate } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';
import statusCode from '@/enums/EStatusCode';
import auth from '@/helpers/auth';

const Request = () => {
  const navigate = useNavigate();
  const { config } = useConfig();

  const apiUrl = config.api.base;
  const headers = { Accept: 'application/json' };

  const setAuthHeader = (withAuth) => {
    if (!withAuth) return;
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = token;
  };

  const handleError = (error, withAuth) => {
    const status = error?.response?.status;
    const message = error?.response?.data || error.message;

    if (!error.response) {
      navigate('/server-error', { replace: true });
      return Promise.reject('Server unreachable');
    }

    switch (status) {
      case statusCode.INTERNAL_SERVER_ERROR:
        navigate('/server-error', { replace: true });
        break;

      case statusCode.UNAUTHORIZED:
      case statusCode.FORBIDDEN:
        if (withAuth) {
          auth.logout();
          navigate('/login', { replace: true });
        }
        break;
    }

    return Promise.reject(message);
  };

  const get = async (url, params = {}, withAuth = true) => {
    setAuthHeader(withAuth);
    try {
      const { data } = await axios.get(apiUrl + url, { params, headers });
      return data;
    } catch (error) {
      return handleError(error, withAuth);
    }
  };

  const post = async (url, body, withAuth = true, files = []) => {
    setAuthHeader(withAuth);

    const formData = new FormData();
    files?.forEach((file) => {
      formData.append('files', file.file, file.id);
    });
    formData.append('data', JSON.stringify(body));

    try {
      const { data } = await axios.post(apiUrl + url, formData, { headers });
      return data;
    } catch (error) {
      return handleError(error, withAuth);
    }
  };

  return { get, post };
};

export default Request;
