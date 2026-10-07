import CModuleID from '@configs/CModuleID';
import History from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import PageHeader from '@/components/page/PageHeader';
import EActionType from '@/enums/EActionType';
import ClassicView from '@/templates/ClassicView';

const actions = [
  {
    type: EActionType.detail.value,
    path: '/audit-trail/detail',
  },
];

const defaultSort = [{ id: 'id', desc: true }];

const Page = () => {
  return (
    <Box>
      <PageHeader
        icon={<History />}
        title="Audit Trail"
        subtitle="Every create, update and delete made to module data"
      />
      <ClassicView
        moduleID={CModuleID.auditTrail}
        actions={actions}
        defaultSort={defaultSort}
      />
    </Box>
  );
};

export default Page;
