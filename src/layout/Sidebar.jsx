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

  const [tree, setTree] = useState([]);

  const treeJSON = localStorage.getItem('tree')
    ? JSON.parse(localStorage.getItem('tree'))
    : [];

  const onClick = (menu) => {
    navigate(menu.url);
  };

  const onLoad = () => {
    get(CApiUrl.common.menu).then((res) => {
      setTree(res.tree);
      localStorage.setItem('tree', JSON.stringify(res.tree));
    });
  };

  useEffect(() => {
    if (tree.length > 0) {
      setTree(treeJSON);
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
      <Tree
        onChildClick={onClick}
        tree={tree}
        isSidebar={true}
        setTree={setTree}
      />
      {tree.length <= 0 && (
        <Typography align="center">Menu is not found.</Typography>
      )}
    </Card>
  );
};

export default Sidebar;
