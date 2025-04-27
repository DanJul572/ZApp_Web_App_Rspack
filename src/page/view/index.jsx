import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
    <Box>
      <Typography
        fontSize={20}
        fontWeight="bold"
        color={CTheme.palette.primary.main}
      >
        Views
      </Typography>
      <ClassicView moduleID={CModuleID.modules} actions={actions} />
    </Box>
  );
};

export default Page;
