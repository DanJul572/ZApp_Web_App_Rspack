import CApiUrl from '@configs/CApiUrl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Tree from '@/components/tree';
import Request from '@/hooks/Request';

const Loading = ({ isLoading }) => {
  if (isLoading) {
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <CircularProgress size={25} />
    </Box>;
  }
  return false;
};

const ErrorContent = ({ isError, error }) => {
  if (isError) {
    return <Typography align="center">{error.message}</Typography>;
  }
  return false;
};

const NotFound = ({ isEmpty }) => {
  if (isEmpty) {
    return <Typography align="center">Menu is not found.</Typography>;
  }
  return false;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { get } = Request();

  const [tree, setTree] = useState([]);

  const treeJSON = localStorage.getItem('tree')
    ? JSON.parse(localStorage.getItem('tree'))
    : [];

  const onClick = (menu) => {
    navigate(menu.url);
  };

  const onLoad = async () => {
    return await get(CApiUrl.common.menu);
  };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['sidebar'],
    queryFn: onLoad,
    enabled: !treeJSON.length,
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem('tree', JSON.stringify(data.tree));
      setTree(data.tree);
    }
  }, [data]);

  useEffect(() => {
    if (treeJSON.length > 0) {
      setTree(treeJSON);
    }
  }, []);

  return (
    <Card
      sx={{
        bottom: 0,
        left: 0,
        overflowY: 'auto',
        paddingTop: 10,
        position: 'fixed',
        top: 0,
        width: 300,
      }}
    >
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
      <NotFound isEmpty={!tree.length} />
    </Card>
  );
};

export default Sidebar;
