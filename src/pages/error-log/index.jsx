import CModuleID from '@configs/CModuleID';
import BugReport from '@mui/icons-material/BugReportOutlined';
import Box from '@mui/material/Box';
import PageHeader from '@/components/page/PageHeader';
import EActionType from '@/enums/EActionType';
import ClassicView from '@/templates/ClassicView';

const actions = [
  {
    type: EActionType.detail.value,
    path: '/error-log/detail',
  },
];

const defaultSort = [{ id: 'id', desc: true }];

const Page = () => {
  return (
    <Box>
      <PageHeader
        icon={<BugReport />}
        title="Error Log"
        subtitle="Unexpected server errors, with the request that caused them"
      />
      <ClassicView
        moduleID={CModuleID.logError}
        actions={actions}
        defaultSort={defaultSort}
      />
    </Box>
  );
};

export default Page;
