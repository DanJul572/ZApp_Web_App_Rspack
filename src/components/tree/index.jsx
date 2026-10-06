import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Search from '@mui/icons-material/Search';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import * as Icon from '@/configs/CIcons';

import { useExpandedMenu } from '@/contexts/ExpandedMenuProvider';

const CustomTreeItem = forwardRef((props, ref) => (
  <TreeItem {...props} ref={ref} />
));
CustomTreeItem.displayName = 'CustomTreeItem';

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    borderRadius: 8,
    padding: theme.spacing(0.75, 1),
    marginBottom: 2,
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    transition: 'background-color 0.15s, color 0.15s',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
    '&[data-selected], &[data-selected][data-focused]': {
      backgroundColor: theme.palette.primary[50],
      color: theme.palette.primary.main,
    },
    [`&[data-selected] .${treeItemClasses.label}`]: {
      fontWeight: 600,
    },
  },
  [`& .${treeItemClasses.label}`]: {
    fontSize: 14,
    fontWeight: 500,
    color: 'inherit',
  },
  [`& .${treeItemClasses.iconContainer} .MuiSvgIcon-root`]: {
    fontSize: 20,
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 14,
    paddingLeft: 6,
    borderLeft: `1px dashed ${theme.palette.divider}`,
  },
}));

const ExpandIcon = (props) => <KeyboardArrowRight {...props} />;

const CollapseIcon = (props) => <KeyboardArrowDown {...props} />;

const Tree = (props) => {
  const { onChildClick, onParentClick, tree, isSidebar, setTree } = props;

  const location = useLocation();

  const { expandedMenu, setExpandedMenu } = useExpandedMenu();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const treeJSON = localStorage.getItem('tree')
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
    // Search filters the cached sidebar menu; other trees (e.g. the menu
    // editor) must keep their own data.
    if (isSidebar && tree.length > 0) {
      const newTree = filterMenusByLabel(treeJSON, value);
      setTree(newTree);
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
    } else {
      setSelectedItems([menu.id]);
    }

    if (onParentClick) {
      onParentClick({
        id: menu.id,
        label: menu.label,
        url: menu.url,
        child: menu.child,
      });
    }
  };

  const treeMenu = (menu) => {
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
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
          {menu.child.map((child) => treeMenu(child))}
        </StyledTreeItem>
      );
    }

    return (
      <StyledTreeItem
        key={menu.id}
        itemId={menu.id}
        label={menu.label}
        slots={{
          endIcon: SelectedIcon
            ? () => <SelectedIcon sx={{ color: 'inherit' }} />
            : null,
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (!isSidebar) {
            setSelectedItems([menu.id]);
          }
          onChildClick(menu);
        }}
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
        <Box sx={{ px: 0.5, mb: 1.5 }}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search menu..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
              },
            }}
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
        sx={{ overflowX: 'hidden', p: 0.5 }}
        {...treeProps}
      >
        {tree && tree.length > 0 && tree.map((menu) => treeMenu(menu))}
      </SimpleTreeView>
    </Box>
  );
};

export default Tree;
