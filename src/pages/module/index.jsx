import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CActionType from '@/constantss/CActionType';
import CApiUrl from '@/constantss/CApiUrl';
import CModuleID from '@/constantss/CModuleID';
import { downloadJsonFile } from '@/helperss/downloadFile';
import Alert from '@/hooks/Alert';
import Loader from '@/hooks/Loader';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';
import ClassicView from '@/templatess/ClassicView';

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
