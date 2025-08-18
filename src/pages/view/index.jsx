import CModuleID from '@configs/CModuleID';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EActionType from '@/enums/EActionType';
import ClassicView from '@/templates/ClassicView';

const Page = () => {
  const actions = [
    {
      type: EActionType.update.value,
      path: '/view/create',
    },
  ];

  return (
    <Box>
      <Typography fontSize={20} fontWeight="bold">
        Views
      </Typography>
      <ClassicView moduleID={CModuleID.modules} actions={actions} />
    </Box>
  );
};

export default Page;
