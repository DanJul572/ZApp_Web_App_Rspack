import CModuleID from '@configs/CModuleID';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EActionType from '@/enums/EActionType';
import ClassicView from '@/templates/ClassicView';

const Page = () => {
  const actions = [
    {
      type: EActionType.update.value,
      path: '/menu/create',
    },
    {
      type: EActionType.insert.value,
      path: '/menu/create',
    },
    {
      type: EActionType.delete.value,
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
