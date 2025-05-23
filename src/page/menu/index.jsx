import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ClassicView from '@/template/ClassicView';

import CActionType from '@/constant/CActionType';
import CModuleID from '@/constant/CModuleID';

const Page = () => {
  const actions = [
    {
      type: CActionType.update.value,
      path: '/menu/create',
    },
    {
      type: CActionType.insert.value,
      path: '/menu/create',
    },
    {
      type: CActionType.delete.value,
    },
  ];

  return (
    <Box>
      <Typography fontSize={20} fontWeight="bold">
        Menus
      </Typography>
      <ClassicView moduleID={CModuleID.menus} actions={actions} />
    </Box>
  );
};

export default Page;
