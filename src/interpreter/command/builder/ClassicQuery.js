import { useFile } from '@/context/FileProvider';

import Core from '../core';

const ClassicQuery = () => {
  const ZCore = Core();

  const { setFile } = useFile();

  const createOrUpdate = (moduleId, key, path = null) => {
    ZCore.loader.showLoading();

    const id = ZCore.parameter.get(key);

    if (!id) {
      ZCore.api
        .create({
          moduleId: moduleId,
          data: ZCore.vars.getAll(),
        })
        .then((res) => {
          ZCore.alert.showSuccessAlert(res);
          ZCore.vars.removeAll();
          ZCore.loader.hideLoading();
          setFile([]);

          if (path) {
            ZCore.redirect.internal(path);
          }
        })
        .catch((err) => {
          ZCore.alert.showErrorAlert(err);
          ZCore.loader.hideLoading();
        });
    } else {
      ZCore.api
        .update({
          moduleId: moduleId,
          rowId: id,
          data: ZCore.vars.getAll(),
        })
        .then((res) => {
          ZCore.alert.showSuccessAlert(res);
          ZCore.vars.removeAll();
          ZCore.loader.hideLoading();
          setFile([]);

          if (path) {
            ZCore.redirect.internal(path);
          }
        })
        .catch((err) => {
          ZCore.alert.showErrorAlert(err);
          ZCore.loader.hideLoading();
        });
    }
  };

  const findOneAndSet = (moduleId, key) => {
    const id = ZCore.parameter.get(key);
    if (id) {
      ZCore.loader.showLoading();
      ZCore.api
        .detail({
          moduleId: moduleId,
          rowId: id,
        })
        .then((res) => {
          res.createdAt = undefined;
          res.updatedAt = undefined;
          res[key] = undefined;

          ZCore.vars.setAll(res);
          ZCore.comp.set('tempData', res);
        })
        .catch((err) => {
          ZCore.alert.showErrorAlert(err);
        })
        .finally(() => {
          ZCore.loader.hideLoading();
        });
    }
  };

  return { createOrUpdate, findOneAndSet };
};

export default ClassicQuery;
