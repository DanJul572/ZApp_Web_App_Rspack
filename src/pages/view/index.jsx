import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CActionType from '@/constantss/CActionType';
import CModuleID from '@/constantss/CModuleID';
import ClassicView from '@/templatess/ClassicView';

const Page = () => {
  const actions = [
    {
      type: CActionType.update.value,
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
