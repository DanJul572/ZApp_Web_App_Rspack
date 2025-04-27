import { useFile } from '@/context/FileProvider';

import Caller from '../caller';

const Process = () => {
  const ZApp = Caller();

  const { setFile } = useFile();

  const createOrUpdate = (moduleId, key, path = null) => {
    ZApp.Loader.showLoading();

    const id = ZApp.Parameter.get(key);

    if (!id) {
      ZApp.Api.create({
        moduleId: moduleId,
        data: ZApp.Vars.getAll(),
      })
        .then((res) => {
          ZApp.Alert.showSuccessAlert(res);
          ZApp.Vars.removeAll();
          ZApp.Loader.hideLoading();
          setFile([]);

          if (path) {
            ZApp.Redirect.internal(path);
          }
        })
        .catch((err) => {
          ZApp.Alert.showErrorAlert(err);
          ZApp.Loader.hideLoading();
        });
    } else {
      ZApp.Api.update({
        moduleId: moduleId,
        rowId: id,
        data: ZApp.Vars.getAll(),
      })
        .then((res) => {
          ZApp.Alert.showSuccessAlert(res);
          ZApp.Vars.removeAll();
          ZApp.Loader.hideLoading();
          setFile([]);

          if (path) {
            ZApp.Redirect.internal(path);
          }
        })
        .catch((err) => {
          ZApp.Alert.showErrorAlert(err);
          ZApp.Loader.hideLoading();
        });
    }
  };

  const findOneAndSet = (moduleId, key) => {
    const id = ZApp.Parameter.get(key);
    if (id) {
      ZApp.Loader.showLoading();
      ZApp.Api.detail({
        moduleId: moduleId,
        rowId: id,
      })
        .then((res) => {
          res.createdAt = undefined;
          res.updatedAt = undefined;
          res[key] = undefined;

          ZApp.Vars.setAll(res);
          ZApp.Comp.set('tempData', res);
        })
        .catch((err) => {
          ZApp.Alert.showErrorAlert(err);
        })
        .finally(() => {
          ZApp.Loader.hideLoading();
        });
    }
  };

  return { createOrUpdate, findOneAndSet };
};

export default Process;
