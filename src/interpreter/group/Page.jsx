import { useEffect } from 'react';
import { useFile } from '@/context/FileProvider';
import Comp from '@/hook/Comp';
import FormData from '@/hook/FormData';

import Waiter from '@/interpreter/waiter';

const Page = (props) => {
  const { page, isBuilder, children, isPreview } = props;

  const waiter = Waiter({ isBuilder });
  const file = useFile();
  const formData = FormData();
  const comp = Comp();

  useEffect(() => {
    if (!isBuilder && !isPreview) {
      if (page?.onLoad) {
        waiter.order(page.onLoad);
      }
    }
    return () => {
      formData.removeAll();
      comp.removeAll();
      file.setFile([]);
    };
  }, [page]);

  return children;
};

export default Page;
