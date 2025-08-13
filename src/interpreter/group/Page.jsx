import { useEffect } from 'react';
import { useFile } from '@/context/FileProvider';
import Comp from '@/hook/Comp';
import Vars from '@/hook/Vars';

import Waiter from '@/interpreter/waiter';

const Page = (props) => {
  const { page, isBuilder, children, isPreview } = props;

  const { order } = Waiter({ isBuilder });

  const { setFile } = useFile();
  const vars = Vars();
  const comp = Comp();

  useEffect(() => {
    if (!isBuilder && !isPreview) {
      if (page?.onLoad) {
        order(page.onLoad);
      }
    }
    return () => {
      vars.removeAll();
      comp.removeAll();
      setFile([]);
    };
  }, [page]);

  return children;
};

export default Page;
