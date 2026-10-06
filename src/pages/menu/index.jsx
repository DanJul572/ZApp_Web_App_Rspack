import CModuleID from '@configs/CModuleID';
import AccountTree from '@mui/icons-material/AccountTree';
import Box from '@mui/material/Box';
import PageHeader from '@/components/page/PageHeader';
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
      <PageHeader
        icon={<AccountTree />}
        title="Menus"
        subtitle="Organize navigation trees and assign them to roles"
      />
      <ClassicView moduleID={CModuleID.menus} actions={actions} />
    </Box>
  );
};

export default Page;
