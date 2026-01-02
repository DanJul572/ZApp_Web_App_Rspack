import CApiUrl from '@configs/CApiUrl';
import CModuleID from '@configs/CModuleID';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useConfig } from '@/contexts/ConfigProvider';
import EActionType from '@/enums/EActionType';
import { downloadJsonFile } from '@/helpers/downloadFile';
import Alert from '@/hooks/Alert';
import Loader from '@/hooks/Loader';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';
import ClassicView from '@/templates/ClassicView';

const Page = () => {
  const translator = Translator();
  const alert = Alert();
  const loader = Loader();
  const request = Request();
  const { config } = useConfig();

  const actions = [
    {
      type: EActionType.insert.value,
      path: '/module/create',
    },
    {
      type: EActionType.delete.value,
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
        reformatModule.fields = res.data
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

  const onExport = () => {
    const id = 4;
    const token = localStorage.getItem('token');
    window.location.href = `${config.api.base}${CApiUrl.export.csv}?id=${id}&token=${token}`;
  };

  return (
    <Box>
      <Typography fontSize={20} fontWeight="bold">
        Modules
      </Typography>
      <ClassicView
        enableExport={true}
        onExport={onExport}
        actions={actions}
        moduleID={CModuleID.modules}
        onClickRowCustomAction={onClickRowCustomAction}
        rowCustomAction={rowCustomAction}
      />
    </Box>
  );
};

export default Page;
