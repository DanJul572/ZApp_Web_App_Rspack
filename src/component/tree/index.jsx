import { forwardRef, useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';

import { useExpandedMenu } from '@/context/ExpandedMenuProvider';

import ShortText from '../input/ShortText';

const CustomTreeItem = forwardRef((props, ref) => (
  <TreeItem {...props} ref={ref} />
));
CustomTreeItem.displayName = 'CustomTreeItem';

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 10,
    paddingLeft: 10,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  [`& .${treeItemClasses.label}`]: {
    fontSize: 15,
    color: theme.palette.text.primary,
  },
}));

const Tree = (props) => {
  const { onChildClick, onParentClick, list, isSidebar, setList } = props;

  const theme = useTheme();
  const { expandedMenu, setExpandedMenu } = useExpandedMenu();

  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const tree = localStorage.getItem('tree')
    ? JSON.parse(localStorage.getItem('tree'))
    : [];

  const treeProps = {};
  if (isSidebar) treeProps.expandedItems = expandedMenu;

  const filterMenusByLabel = (arr, label) => {
    const filterRecursive = (arr, label) => {
      return arr.filter((obj) => {
        const menu = obj.label.toLowerCase();
        const keyword = label.toLowerCase();
        if (menu.includes(keyword)) {
          return true;
        } else if (obj.child) {
          obj.child = filterRecursive(obj.child, label);
          return obj.child.length > 0;
        }
        return false;
      });
    };
    return filterRecursive(arr, label);
  };

  const search = (value) => {
    if (tree.length > 0) {
      const newList = filterMenusByLabel(tree, value);
      setList(newList);
    }
  };

  const clickParent = (menu) => {
    // if menu is nested, this function called two times
    if (isSidebar) {
      if (!expandedMenu.includes(menu.id)) {
        setExpandedMenu([...expandedMenu, menu.id]);
      } else {
        const expanded = [...expandedMenu].filter((item) => item !== menu.id);
        setExpandedMenu(expanded);
      }
    }

    if (onParentClick) {
      onParentClick({ id: menu.id, label: menu.label, url: menu.url });
    }
  };

  const menuList = (menu) => {
    if (menu.child) {
      return (
        <StyledTreeItem
          key={menu.id}
          itemId={menu.id}
          label={menu.label}
          onClick={(event) => {
            event.stopPropagation();
            clickParent(menu);
          }}
        >
          {menu.child.map((child) => menuList(child))}
        </StyledTreeItem>
      );
    } else {
      return (
        <StyledTreeItem
          key={menu.id}
          itemId={menu.id}
          label={menu.label}
          onClick={(event) => {
            event.stopPropagation();
            onChildClick(menu);
          }}
        />
      );
    }
  };

  const ExpandIcon = (props) => {
    return <Folder {...props} sx={{ color: theme.palette.primary.main }} />;
  };

  const CollapseIcon = (props) => {
    return <FolderOpen {...props} sx={{ color: theme.palette.primary.main }} />;
  };

  const EndIcon = (props) => {
    return (
      <InsertDriveFileOutlined
        {...props}
        sx={{ color: theme.palette.primary.main }}
      />
    );
  };

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        search(searchTerm);
      }, 1000),
    );
  }, [searchTerm]);

  return (
    <Box>
      {isSidebar && (
        <Box paddingX={1} marginBottom={1}>
          <ShortText
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search..."
          />
        </Box>
      )}
      <SimpleTreeView
        aria-label="customized"
        slots={{
          expandIcon: ExpandIcon,
          collapseIcon: CollapseIcon,
          endIcon: EndIcon,
        }}
        sx={{ overflowX: 'hidden', padding: 1 }}
        {...treeProps}
      >
        {list && list.length > 0 && list.map((menu) => menuList(menu))}
      </SimpleTreeView>
    </Box>
  );
};

export default Tree;
