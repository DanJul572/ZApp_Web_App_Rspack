import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Request from '@/hook/Request';

import Tree from '@/component/tree';

import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';
import { grey } from '@mui/material/colors';

const Sidebar = () => {
  const navigate = useNavigate();
  const { get } = Request();

  const [list, setList] = useState([]);

  const tree = localStorage.getItem('tree')
    ? JSON.parse(localStorage.getItem('tree'))
    : [];

  const onClick = (menu) => {
    navigate(menu.url);
  };

  const onLoad = () => {
    get(CApiUrl.common.menu).then((res) => {
      setList(res.tree);
      localStorage.setItem('tree', JSON.stringify(res.tree));
    });
  };

  useEffect(() => {
    if (tree.length > 0) {
      setList(tree);
    } else {
      onLoad();
    }
  }, []);

  return (
    <Card
      sx={{
        borderColor: grey[300],
        bottom: 0,
        left: 0,
        overflowY: 'auto',
        paddingTop: 10,
        position: 'fixed',
        top: 0,
        width: 300,
      }}
    >
      {list.length > 0 && (
        <Tree
          onChildClick={onClick}
          list={list}
          isSidebar={true}
          setList={setList}
        />
      )}
      {list.length <= 0 && (
        <Box paddingX={1} textAlign="center">
          <Typography>Menu is not found.</Typography>
        </Box>
      )}
    </Card>
  );
};

export default Sidebar;
