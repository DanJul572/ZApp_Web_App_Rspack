import { useEffect } from 'react';
import { useFile } from '@/contexts/FileProvider';
import FormData from '@/hooks/FormData';
import UIStore from '@/hooks/UIStore';
import ScriptEngine from '../script/ScriptEngine';

/**
 * Menjalankan `page.onLoad` saat halaman dibuka dan membersihkan
 * form data, UI store, serta file saat halaman ditinggalkan.
 */
const PageLifecycle = (props) => {
  const { page, isBuilder, children, isPreview } = props;

  const scriptEngine = ScriptEngine({ isBuilder });
  const file = useFile();
  const formData = FormData();
  const uiStore = UIStore();

  useEffect(() => {
    if (!isBuilder && !isPreview && page?.onLoad) {
      scriptEngine.execute(page.onLoad);
    }
    return () => {
      formData.removeAll();
      uiStore.removeAll();
      file.setFile([]);
    };
  }, [page]);

  return children;
};

export default PageLifecycle;
