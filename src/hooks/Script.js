import { useQuery } from '@tanstack/react-query';
import { useConfig } from '@/contexts/ConfigProvider';
import Request from './Request';

const Script = ({ id }) => {
  const request = Request();
  const { config } = useConfig();

  const {
    data: response,
    isPending,
    error,
  } = useQuery({
    queryKey: ['script-run', id],
    queryFn: () => request.get(config.api.script.run, { id }),
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
