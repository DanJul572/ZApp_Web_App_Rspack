import Typography from '@mui/material/Typography';

import Main from '@/layout/Main';
import ClassicView from '@/template/ClassicView';

import CActionType from '@/constant/CActionType';
import CModuleID from '@/constant/CModuleID';
import CTheme from '@/constant/CTheme';

const Page = () => {
  const actions = [
    {
      type: CActionType.update.value,
      path: '/view/create',
    },
  ];

  return (
    <Main>
      <Typography
        fontSize={20}
        fontWeight="bold"
        color={CTheme.palette.primary.main}
      >
        Views
      </Typography>
      <ClassicView moduleID={CModuleID.modules} actions={actions} />
    </Main>
  );
};

export default Page;
