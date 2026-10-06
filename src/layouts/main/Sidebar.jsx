import MenuOpen from '@mui/icons-material/MenuOpen';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import EmptyState from '@/components/page/EmptyState';
import Tree from '@/components/tree';
import { useConfig } from '@/contexts/ConfigProvider';
import { useUserData } from '@/contexts/UserDataProvider';
import getTreeMenuJson from '@/helpers/getTreeMenuJson';
import Request from '@/hooks/Request';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from './constants';

const Loading = ({ isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  return false;
};

const ErrorContent = ({ isError, error }) => {
  if (isError) {
    return (
      <Typography
        variant="body2"
        color="error"
        align="center"
        sx={{ px: 2, py: 3 }}
      >
        {error.message}
      </Typography>
    );
  }
  return false;
};

const NotFound = ({ isEmpty }) => {
  if (isEmpty) {
    return (
      <EmptyState
        icon={<MenuOpen />}
        title="No menu yet"
        description="Menus assigned to your role will appear here."
        sx={{ py: 4 }}
      />
    );
  }
  return false;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const request = Request();
  const { config } = useConfig();
  const { userData } = useUserData();

  const [tree, setTree] = useState([]);

  const treeJSON = localStorage.getItem('tree')
    ? JSON.parse(localStorage.getItem('tree'))
    : [];

  const onClick = (menu) => {
    navigate(menu.url);
  };

  const onLoad = async () => {
    return await request.get(config.api.common.menu);
  };

  const {
    data: response,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['sidebar'],
    queryFn: onLoad,
    enabled: !treeJSON.length && !!userData,
  });

  useEffect(() => {
    if (response) {
      const treeData = getTreeMenuJson(response.data.tree);
      localStorage.setItem('tree', JSON.stringify(treeData));
      setTree(treeData);
    }
  }, [response]);

  useEffect(() => {
    if (treeJSON.length > 0) {
      setTree(treeJSON);
    }
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: TOPBAR_HEIGHT,
        bottom: 0,
        left: 0,
        width: SIDEBAR_WIDTH,
        overflowY: 'auto',
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        pt: 2,
        pb: 3,
        px: 1.5,
      }}
    >
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{ display: 'block', px: 1, mb: 1 }}
      >
        Navigation
      </Typography>
      <Loading isLoading={isLoading} />
      <ErrorContent isError={isError} error={error} />
      {!!tree.length && (
        <Tree
          onChildClick={onClick}
          tree={tree}
          isSidebar={true}
          setTree={setTree}
        />
      )}
      <NotFound isEmpty={!tree.length && !isLoading && !isError} />
    </Box>
  );
};

export default Sidebar;
