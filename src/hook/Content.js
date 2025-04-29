import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Request from './Request';
import Translator from './Translator';

import CApiUrl from '@/constant/CApiUrl';
import CModuleID from '@/constant/CModuleID';

import { decrypt } from '@/helper/encryption';

const Content = (props) => {
  const { isBuilder } = props;
  const params = useParams();

  const { get } = Request();
  const { t } = Translator();

  const [content, setContent] = useState(null);
  const [page, setPage] = useState(null);

  const getContent = () => {
    const param = { moduleId: CModuleID.views, rowId: params.id };
    get(CApiUrl.common.detail, param)
      .then((res) => {
        if (res) {
          const content = decrypt(res.content);
          const page = res.page ? decrypt(res.page) : null;
          setContent(content);
          setPage(page);
        } else {
          setContent(t('empty_content'));
        }
      })
      .catch((err) => {
        setContent(err);
      });
  };

  useEffect(() => {
    if (!isBuilder && params.id) {
      getContent();
    }
  }, [params.id]);

  return { content: content, page: page };
};

export default Content;
