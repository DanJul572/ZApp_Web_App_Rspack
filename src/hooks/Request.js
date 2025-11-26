import axios from 'axios';
import { useNavigate } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';
import statusCode from '@/enums/EStatusCode';
import auth from '@/helpers/auth';

const Request = () => {
  const navigate = useNavigate();
  const { config } = useConfig();

  const apiUrl = config.api.base;
  const headers = {
    Accept: 'application/json',
  };

  const forceRedirect = () => {
    auth.logout();
    navigate('/login', {
      replace: true,
    });
  };

  const get = (url, params, withAuth = true) => {
    if (withAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = token;
      }
    }

    return new Promise((resolve, reject) => {
      const config = {
        params: params,
        headers: headers,
      };
      axios
        .get(apiUrl + url, config)
        .then((res) => resolve(res.data))
        .catch((error) => {
          const message = error.response ? error.response.data : error.message;
          const status = error.response.status;
          if (
            withAuth &&
            (status === statusCode.UNAUTHORIZED ||
              status === statusCode.FORBIDDEN)
          ) {
            forceRedirect();
            reject(message);
          }
          reject(message);
        });
    });
  };

  const post = (url, body, withAuth = true, files = []) => {
    if (withAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = token;
      }
    }

    const formData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i].file, files[i].id);
      }
    }
    formData.append('data', JSON.stringify(body));

    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl + url, formData, {
          headers: headers,
        })
        .then((res) => resolve(res.data))
        .catch((error) => {
          const message = error.response ? error.response.data : error.message;
          const status = error.response.status;
          if (
            withAuth &&
            (status === statusCode.UNAUTHORIZED ||
              status === statusCode.FORBIDDEN)
          ) {
            forceRedirect();
            reject(message);
          }
          reject(message);
        });
    });
  };

  return {
    get,
    post,
  };
};

export default Request;
