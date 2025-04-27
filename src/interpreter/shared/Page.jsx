import { useEffect } from 'react';

import Comp from '@/hook/Comp';
import Vars from '@/hook/Vars';

import { useFile } from '@/context/FileProvider';

import Runner from '@/runner';

const Page = (props) => {
  const { page, isBuilder, children, isPreview } = props;

  const { runFunction } = Runner({ isBuilder });

  const { setFile } = useFile();
  const vars = Vars();
  const comp = Comp();

  useEffect(() => {
    if (!isBuilder && !isPreview) {
      if (page?.onLoad) {
        runFunction(page.onLoad);
      }
    }
    return () => {
      vars.removeAll();
      comp.removeAll();
      setFile([]);
    };
  }, []);

  return children;
};

export default Page;
