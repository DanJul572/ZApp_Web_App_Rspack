import { useFile } from '@/contexts/FileProvider';

import CoreContext from './CoreContext';
import Crud from './Crud';

/**
 * Diekspos ke script user sebagai `zbuilder.classicQuery`.
 */
const ClassicQuery = () => {
  const zcore = CoreContext();
  const crud = Crud();
  const file = useFile();

  // Error dari Request berupa body response ({ message }) atau string
  const showError = (err) => {
    zcore.alert.showErrorAlert(err?.message || err);
  };

  const createOrUpdate = (moduleId, key, path = null) => {
    zcore.loader.showLoading();

    const rowId = zcore.parameter.get(key);

    const request = rowId
      ? crud.update({
          moduleId: moduleId,
          rowId: rowId,
          data: zcore.formData.getAll(),
        })
      : crud.create({
          moduleId: moduleId,
          data: zcore.formData.getAll(),
        });

    request
      .then((res) => {
        zcore.alert.showSuccessAlert(res?.message);
        zcore.formData.removeAll();
        zcore.loader.hideLoading();
        file.setFile([]);

        if (path) {
          zcore.redirect.internal(path);
        }
      })
      .catch((err) => {
        showError(err);
        zcore.loader.hideLoading();
      });
  };

  const findOneAndSet = (moduleId, key) => {
    const rowId = zcore.parameter.get(key);
    if (!rowId) return;

    zcore.loader.showLoading();
    crud
      .detail({
        moduleId: moduleId,
        rowId: rowId,
      })
      .then((res) => {
        const row = { ...res.data };
        row.createdAt = undefined;
        row.updatedAt = undefined;
        row[key] = undefined;

        zcore.formData.setAll(row);
        zcore.uiStore.set('tempData', row);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        zcore.loader.hideLoading();
      });
  };

  return { createOrUpdate, findOneAndSet };
};

export default ClassicQuery;
