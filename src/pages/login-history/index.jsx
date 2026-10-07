import CModuleID from '@configs/CModuleID';
import Login from '@mui/icons-material/Login';
import Box from '@mui/material/Box';
import PageHeader from '@/components/page/PageHeader';
import ClassicView from '@/templates/ClassicView';

const actions = [];

const defaultSort = [{ id: 'id', desc: true }];

const Page = () => {
  return (
    <Box>
      <PageHeader
        icon={<Login />}
        title="Login History"
        subtitle="Successful and failed sign-ins, and sign-outs"
      />
      <ClassicView
        moduleID={CModuleID.auditLogin}
        actions={actions}
        defaultSort={defaultSort}
      />
    </Box>
  );
};

export default Page;
