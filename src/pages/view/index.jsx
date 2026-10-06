import CModuleID from '@configs/CModuleID';
import Dashboard from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import PageHeader from '@/components/page/PageHeader';
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
      <PageHeader
        icon={<Dashboard />}
        title="Views"
        subtitle="Pick a module to design its pages in the view builder"
      />
      <ClassicView moduleID={CModuleID.modules} actions={actions} />
    </Box>
  );
};

export default Page;
