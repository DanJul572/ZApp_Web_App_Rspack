import { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';

import * as Icon from '@/component/icons';

import { useExpandedMenu } from '@/context/ExpandedMenuProvider';

import ShortText from '../input/ShortText';

const CustomTreeItem = forwardRef((props, ref) => (
  <TreeItem {...props} ref={ref} />
));
CustomTreeItem.displayName = 'CustomTreeItem';

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.label}`]: {
    fontSize: 15,
    color: theme.palette.text.primary,
  },
}));

const Tree = (props) => {
  const { onChildClick, onParentClick, list, isSidebar, setList } = props;

  const theme = useTheme();
  const location = useLocation();

  const { expandedMenu, setExpandedMenu } = useExpandedMenu();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const tree = localStorage.getItem('tree')
    ? JSON.parse(localStorage.getItem('tree'))
    : [];

  const treeProps = {};
  if (isSidebar) {
    treeProps.expandedItems = expandedMenu;
  }

  const findPathToItem = (items, pathname, path = []) => {
    for (const item of items) {
      const currentPath = [...path, item];
      if (item.url === pathname) {
        return currentPath;
      }
      if (item.child) {
        const result = findPathToItem(item.child, pathname, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  const filterMenusByLabel = (arr, label) => {
    const filterRecursive = (arr, label) => {
      return arr.filter((obj) => {
        const menu = obj.label.toLowerCase();
        const keyword = label.toLowerCase();
        if (menu.includes(keyword)) {
          return true;
        }
        if (obj.child) {
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
    const SelectedIcon = Icon[menu.icon];

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
    }

    return (
      <StyledTreeItem
        key={menu.id}
        itemId={menu.id}
        label={menu.label}
        slots={{
          endIcon: menu.icon
            ? () => <SelectedIcon sx={{ color: theme.palette.primary.main }} />
            : null,
        }}
        onClick={(event) => {
          event.stopPropagation();
          onChildClick(menu);
        }}
      />
    );
  };

  const ExpandIcon = (props) => {
    return <Folder {...props} sx={{ color: theme.palette.primary.main }} />;
  };

  const CollapseIcon = (props) => {
    return <FolderOpen {...props} sx={{ color: theme.palette.primary.main }} />;
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

  useEffect(() => {
    const matchedPath = findPathToItem(tree, location.pathname);
    if (matchedPath) {
      const ids = matchedPath.map((item) => item.id);
      setSelectedItems([ids.at(-1)]);
      if (isSidebar) {
        setExpandedMenu(ids.slice(0, -1));
      }
    }
  }, [location.pathname]);

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
        }}
        selectedItems={selectedItems}
        sx={{ overflowX: 'hidden', padding: 1 }}
        {...treeProps}
      >
        {list && list.length > 0 && list.map((menu) => menuList(menu))}
      </SimpleTreeView>
    </Box>
  );
};

export default Tree;
