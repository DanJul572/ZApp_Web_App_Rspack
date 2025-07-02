import { useFile } from '@/context/FileProvider';

import Core from '../core';

const ClassicQuery = () => {
  const ZCore = Core();

  const { setFile } = useFile();

  const createOrUpdate = (moduleId, key, path = null) => {
    ZCore.Loader.showLoading();

    const id = ZCore.Parameter.get(key);

    if (!id) {
      ZCore.Api.create({
        moduleId: moduleId,
        data: ZCore.Vars.getAll(),
      })
        .then((res) => {
          ZCore.Alert.showSuccessAlert(res);
          ZCore.Vars.removeAll();
          ZCore.Loader.hideLoading();
          setFile([]);

          if (path) {
            ZCore.Redirect.internal(path);
          }
        })
        .catch((err) => {
          ZCore.Alert.showErrorAlert(err);
          ZCore.Loader.hideLoading();
        });
    } else {
      ZCore.Api.update({
        moduleId: moduleId,
        rowId: id,
        data: ZCore.Vars.getAll(),
      })
        .then((res) => {
          ZCore.Alert.showSuccessAlert(res);
          ZCore.Vars.removeAll();
          ZCore.Loader.hideLoading();
          setFile([]);

          if (path) {
            ZCore.Redirect.internal(path);
          }
        })
        .catch((err) => {
          ZCore.Alert.showErrorAlert(err);
          ZCore.Loader.hideLoading();
        });
    }
  };

  const findOneAndSet = (moduleId, key) => {
    const id = ZCore.Parameter.get(key);
    if (id) {
      ZCore.Loader.showLoading();
      ZCore.Api.detail({
        moduleId: moduleId,
        rowId: id,
      })
        .then((res) => {
          res.createdAt = undefined;
          res.updatedAt = undefined;
          res[key] = undefined;

          ZCore.Vars.setAll(res);
          ZCore.Comp.setranslator('tempData', res);
        })
        .catch((err) => {
          ZCore.Alert.showErrorAlert(err);
        })
        .finally(() => {
          ZCore.Loader.hideLoading();
        });
    }
  };

  return { createOrUpdate, findOneAndSet };
};

export default ClassicQuery;
