import CModuleID from '@configs/CModuleID';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';
import { decrypt } from '@/helpers/encryption';
import Request from './Request';
import Translator from './Translator';

/**
 * Ambil konfigurasi view `id`, atau view dari URL (`/main/:id`) jika
 * `id` tidak diisi.
 */
const Content = ({ id, isBuilder }) => {
  const params = useParams();
  const viewId = id ?? params.id;

  const request = Request();
  const translator = Translator();

  const { config } = useConfig();

  const fetchContent = async () => {
    const param = { moduleId: CModuleID.views, rowId: viewId };
    const res = await request.get(config.api.common.detail, param);
    if (res) {
      return {
        content: decrypt(res.data.content),
        page: res.data.page ? decrypt(res.data.page) : null,
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
    queryKey: ['view-json-content', viewId],
    queryFn: fetchContent,
    enabled: !isBuilder && !!viewId,
    retry: 0,
    refetchOnMount: false,
  });

  return {
    content: response?.content ?? null,
    page: response?.page ?? null,
    isLoading,
    error,
  };
};

export default Content;
