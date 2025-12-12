import CApiUrl from '@configs/CApiUrl';
import { useQuery } from '@tanstack/react-query';
import Request from './Request';

const Script = ({ id }) => {
  const request = Request();

  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ['script-run', id],
    queryFn: () => request.get(CApiUrl.script.run, { id }),
    enabled: !!id,
    retry: 0,
  });

  return {
    val: response?.data,
    isPending,
    error,
  };
};

export default Script;
