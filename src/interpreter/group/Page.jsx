import { useEffect } from 'react';
import { useFile } from '@/contextss/FileProvider';
import FormData from '@/hooks/FormData';
import UIStore from '@/hooks/UIStore';

import Waiter from '@/interpreter/waiter';

const Page = (props) => {
  const { page, isBuilder, children, isPreview } = props;

  const waiter = Waiter({ isBuilder });
  const file = useFile();
  const formData = FormData();
  const uiStore = UIStore();

  useEffect(() => {
    if (!isBuilder && !isPreview) {
      if (page?.onLoad) {
        waiter.order(page.onLoad);
      }
    }
    return () => {
      formData.removeAll();
      uiStore.removeAll();
      file.setFile([]);
    };
  }, [page]);

  return children;
};

export default Page;
