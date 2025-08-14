import { useFile } from '@/contexts/FileProvider';

import Core from '../core';

const ClassicQuery = () => {
  const zcore = Core();
  const file = useFile();

  const createOrUpdate = (moduleId, key, path = null) => {
    zcore.loader.showLoading();

    const id = zcore.parameter.get(key);

    if (!id) {
      zcore.api
        .create({
          moduleId: moduleId,
          data: zcore.formData.getAll(),
        })
        .then((res) => {
          zcore.alert.showSuccessAlert(res);
          zcore.formData.removeAll();
          zcore.loader.hideLoading();
          file.setFile([]);

          if (path) {
            zcore.redirect.internal(path);
          }
        })
        .catch((err) => {
          zcore.alert.showErrorAlert(err);
          zcore.loader.hideLoading();
        });
    } else {
      zcore.api
        .update({
          moduleId: moduleId,
          rowId: id,
          data: zcore.formData.getAll(),
        })
        .then((res) => {
          zcore.alert.showSuccessAlert(res);
          zcore.formData.removeAll();
          zcore.loader.hideLoading();
          file.setFile([]);

          if (path) {
            zcore.redirect.internal(path);
          }
        })
        .catch((err) => {
          zcore.alert.showErrorAlert(err);
          zcore.loader.hideLoading();
        });
    }
  };

  const findOneAndSet = (moduleId, key) => {
    const id = zcore.parameter.get(key);
    if (id) {
      zcore.loader.showLoading();
      zcore.api
        .detail({
          moduleId: moduleId,
          rowId: id,
        })
        .then((res) => {
          res.createdAt = undefined;
          res.updatedAt = undefined;
          res[key] = undefined;

          zcore.formData.setAll(res);
          zcore.uiStore.set('tempData', res);
        })
        .catch((err) => {
          zcore.alert.showErrorAlert(err);
        })
        .finally(() => {
          zcore.loader.hideLoading();
        });
    }
  };

  return { createOrUpdate, findOneAndSet };
};

export default ClassicQuery;
