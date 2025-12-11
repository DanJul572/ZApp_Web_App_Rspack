import CApiUrl from '@configs/CApiUrl';
import CModuleID from '@configs/CModuleID';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { decrypt } from '@/helpers/encryption';
import Request from './Request';
import Translator from './Translator';

const Content = ({ isBuilder }) => {
  const params = useParams();

  const request = Request();
  const translator = Translator();

  const fetchContent = async () => {
    const param = { moduleId: CModuleID.views, rowId: params.id };
    const res = await request.get(CApiUrl.common.detail, param);
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

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['view-json-content', params.id],
    queryFn: fetchContent,
    enabled: !isBuilder && !!params.id,
    retry: 0,
    refetchOnMount: false,
  });

  return {
    content: response?.data?.content ?? null,
    page: response?.data?.page ?? null,
    isLoading,
    error,
  };
};

export default Content;
