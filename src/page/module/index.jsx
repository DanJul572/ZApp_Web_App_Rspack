import { useAlert } from '@/context/AlertProvider';
import { useLoading } from '@/context/LoadingProvider';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

import { downloadJsonFile } from '@/helper/downloadFile';

import ClassicView from '@/template/ClassicView';

import CActionType from '@/constant/CActionType';
import CApiUrl from '@/constant/CApiUrl';
import CModuleID from '@/constant/CModuleID';
import Alert from '@/hook/Alert';
import Loader from '@/hook/Loader';

const Page = () => {
  const translator = Translator();
  const alert = Alert();
  const loader = Loader();
  const request = Request();

  const actions = [
    {
      type: CActionType.insert.value,
      path: '/module/create',
    },
    {
      type: CActionType.delete.value,
      api: CApiUrl.module.delete,
    },
  ];

  const rowCustomAction = [
    {
      type: 6,
      value: 6,
      label: translator('download'),
    },
  ];

  const getFields = (module) => {
    loader.showLoading();

    const param = {
      moduleId: module.id,
    };

    request
      .get(CApiUrl.field.rows, param)
      .then((res) => {
        const reformatModule = { ...module };
        reformatModule.createdAt = undefined;
        reformatModule.updatedAt = undefined;
        reformatModule.fields = res
          .filter((field) => field.id)
          .map((field) => {
            field.createdAt = undefined;
            field.updatedAt = undefined;

            return field;
          });
        downloadJsonFile(reformatModule, module.label);
      })
      .catch((err) => {
        alert.showErrorAlert(err);
      })
      .finally(() => {
        loader.hideLoading();
      });
  };

  const onClickRowCustomAction = (data) => {
    if (data.action.type === 6) {
      getFields(data.row);
    }
  };

  return (
    <Box>
      <Typography fontSize={20} fontWeight="bold">
        Modules
      </Typography>
      <ClassicView
        actions={actions}
        moduleID={CModuleID.modules}
        onClickRowCustomAction={onClickRowCustomAction}
        rowCustomAction={rowCustomAction}
      />
    </Box>
  );
};

export default Page;
