import { useQuery } from '@tanstack/react-query';
import CApiUrl from '@/constant/CApiUrl';
import Request from './Request';

const Script = ({ id }) => {
  const { get } = Request();

  const {
    data: val,
    isPending,
    error,
  } = useQuery({
    queryKey: ['script-run', id],
    queryFn: () => get(CApiUrl.script.run, { id }),
    enabled: !!id,
    retry: 0,
  });

  return {
    val,
    isPending,
    error,
  };
};

export default Script;
