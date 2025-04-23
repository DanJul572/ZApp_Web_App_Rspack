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
import CTheme from '@/constant/CTheme';

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
        delete reformatModule.createdAt;
        delete reformatModule.updatedAt;
        reformatModule.fields = res
          .filter((field) => field.id)
          .map((field) => {
            delete field.createdAt;
            delete field.updatedAt;

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
      <Typography
        fontSize={20}
        fontWeight="bold"
        color={CTheme.palette.primary.main}
      >
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
