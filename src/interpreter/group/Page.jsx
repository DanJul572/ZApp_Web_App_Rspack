import { useEffect } from 'react';
import { useFile } from '@/context/FileProvider';
import FormData from '@/hook/FormData';
import UIStore from '@/hook/UIStore';

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
