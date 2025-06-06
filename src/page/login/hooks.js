import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import CApiUrl from '@/constant/CApiUrl';

import { useExpandedMenu } from '@/context/ExpandedMenuProvider';
import { useToast } from '@/context/ToastProvider';

import Request from '@/hook/Request';

const useLogin = () => {
  const navigate = useNavigate();
  const { post } = Request();

  const { setExpandedMenu } = useExpandedMenu();
  const { setToast } = useToast();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onLogin = async () => {
    const body = { email: email, password: password };
    return await post(CApiUrl.auth.login, body, false);
  };

  const mutation = useMutation({
    mutationKey: ['submit-login'],
    mutationFn: onLogin,
    onSuccess: (res) => {
      localStorage.setItem('token', res.accessToken);
      setExpandedMenu([]);
      navigate(res.afterLogin);
    },
    onError: (err) => {
      setToast({ status: true, type: 'error', message: err });
    },
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    mutation,
  };
};

export default useLogin;
