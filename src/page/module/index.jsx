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

const Page = () => {
  const { get } = Request();
  const { t } = Translator();

  const { setAlert } = useAlert();
  const { setLoading } = useLoading();

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
      label: t('download'),
    },
  ];

  const getFields = (module) => {
    setLoading(true);

    const param = {
      moduleId: module.id,
    };

    get(CApiUrl.field.rows, param)
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
        setAlert({
          status: true,
          type: 'error',
          message: err,
        });
      })
      .finally(() => {
        setLoading(false);
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
