import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import CApiUrl from '@/constant/CApiUrl';
import CModuleID from '@/constant/CModuleID';
import { decrypt } from '@/helper/encryption';
import Request from './Request';
import Translator from './Translator';

const Content = ({ isBuilder }) => {
  const params = useParams();
  const { get } = Request();
  const translator = Translator();

  const fetchContent = async () => {
    const param = { moduleId: CModuleID.views, rowId: params.id };
    const res = await get(CApiUrl.common.detail, param);
    if (res) {
      return {
        content: decrypt(res.content),
        page: res.page ? decrypt(res.page) : null,
      };
    }
    return {
      content: translator('empty_content'),
      page: null,
    };
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['view-json-content', params.id],
    queryFn: fetchContent,
    enabled: !isBuilder && !!params.id,
    retry: 0,
    refetchOnMount: false,
  });

  return {
    content: data?.content ?? null,
    page: data?.page ?? null,
    isLoading,
    error,
  };
};

export default Content;
