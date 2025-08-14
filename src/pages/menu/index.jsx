import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CActionType from '@/constants/CActionType';
import CModuleID from '@/constants/CModuleID';
import ClassicView from '@/templates/ClassicView';

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
