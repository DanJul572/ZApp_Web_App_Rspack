import CFieldID from '@configs/CFieldID';
import CModuleID from '@configs/CModuleID';
import AccountTree from '@mui/icons-material/AccountTree';
import CreateNewFolder from '@mui/icons-material/CreateNewFolder';
import Delete from '@mui/icons-material/DeleteOutlined';
import Download from '@mui/icons-material/Download';
import FileUpload from '@mui/icons-material/FileUpload';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import North from '@mui/icons-material/North';
import NoteAdd from '@mui/icons-material/NoteAdd';
import Save from '@mui/icons-material/Save';
import South from '@mui/icons-material/South';
import TouchApp from '@mui/icons-material/TouchApp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import Upload from '@/components/button/Upload';
import IconPicker from '@/components/iconPicker';
import Dropdown from '@/components/input/Dropdown';
import ShortText from '@/components/input/ShortText';
import ContentLoader from '@/components/loading/ContentLoader';
import EmptyState from '@/components/page/EmptyState';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import Tree from '@/components/tree';
import { useAlert } from '@/contexts/AlertProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { downloadJsonFile } from '@/helpers/downloadFile';
import getTreeMenuJson from '@/helpers/getTreeMenuJson';
import { readJSONFile } from '@/helpers/readFile';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

const Page = () => {
  const request = Request();
  const translator = Translator();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setAlert } = useAlert();
  const { config } = useConfig();

  const [label, setLabel] = useState(null);
  const [roleId, setRoleId] = useState([]);
  const [afterLogin, setAfterLogin] = useState(null);
  const [tree, setTree] = useState([]);
  const [activeMenu, setActiveMenu] = useState({
    id: null,
    label: null,
    url: null,
    icon: null,
    child: [],
  });

  // Ref to hold the latest activeMenu for use inside debounced callbacks
  const activeMenuRef = useRef(activeMenu);
  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  // Debounce timer ref for changeMenuValue
  const debounceTimer = useRef(null);

  const id = searchParams.get('id');
  const actionType = { add: 1, edit: 2, delete: 3, up: 4, down: 5 };

  const onLoad = async () => {
    const body = { moduleId: CModuleID.menus, rowId: id };
    return await request.get(config.api.common.detail, body);
  };

  const onSave = async () => {
    const url = id ? config.api.common.update : config.api.common.create;
    const body = {
      moduleId: CModuleID.menus,
      data: {
        label: label,
        tree: JSON.stringify(tree),
        roleId: roleId,
        afterLogin: afterLogin,
      },
    };

    if (id) {
      body.rowId = id;
    }

    return request.post(url, body, [], false);
  };

  const generateNewMenu = () => {
    return { id: uuidv4(), label: 'New Item', url: '', icon: null };
  };

  const changeMenuItem = useCallback(
    (menu, type, itemParam = null, latestActiveMenu = null) => {
      const current = latestActiveMenu ?? activeMenuRef.current;
      if (current.id) {
        for (let x = 0; x < menu.length; x++) {
          const item = menu[x];
          if (item.id === current.id) {
            const newItem = {
              id: current.id,
              label: current.label,
              url: current.url,
              icon: current.icon,
            };
            if (item.child && item.child.length > 0) {
              newItem.child = item.child;
            }
            if (type === actionType.edit) {
              menu.splice(x, 1, newItem);
            } else if (type === actionType.add) {
              if (!item.child) {
                item.child = [];
              }
              item.child.push(itemParam);
            } else if (type === actionType.up) {
              if (x > 0) {
                [menu[x], menu[x - 1]] = [menu[x - 1], menu[x]];
              }
            } else if (type === actionType.down) {
              if (x < menu.length - 1) {
                [menu[x], menu[x + 1]] = [menu[x + 1], menu[x]];
              }
            } else {
              menu.splice(x, 1);
            }
            return menu;
          }
          if (item.child && item.child.length > 0) {
            changeMenuItem(item.child, type, itemParam, current);
          }
        }
      }
      return menu;
    },
    [actionType.add, actionType.down, actionType.edit, actionType.up],
  );

  const changeMenuValue = (key, value) => {
    // Update activeMenu state immediately so the UI stays responsive
    setActiveMenu((prev) => {
      const updated = {
        ...prev,
        [key]: key === 'icon' && value === prev.icon ? null : value,
      };
      // Keep ref in sync right away so the debounced onEdit uses latest values
      activeMenuRef.current = updated;
      return updated;
    });

    // Debounce the tree update by 500ms
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setTree((prevTree) => {
        const result = changeMenuItem([...prevTree], actionType.edit);
        return result;
      });
    }, 500);
  };

  const onClick = (menu) => {
    setActiveMenu(menu);
  };

  const onEdit = () => {
    // Clear any pending debounce and apply immediately on blur
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    setTree((prevTree) => {
      const result = changeMenuItem([...prevTree], actionType.edit);
      return result;
    });
  };

  const onAddRootMenu = () => {
    const menu = generateNewMenu();
    setTree([...tree, menu]);
  };

  const onAdd = () => {
    const menu = generateNewMenu();
    const result = changeMenuItem([...tree], actionType.add, menu);
    setTree(result);
  };

  const onDelete = () => {
    const result = changeMenuItem([...tree], actionType.delete);
    setActiveMenu({
      id: null,
      label: null,
      url: null,
      icon: null,
      child: [],
    });
    setTree(result);
  };

  const onMove = (type) => {
    const result = changeMenuItem([...tree], type);
    setTree(result);
  };

  const onBack = () => {
    navigate(-1);
  };

  const onDownload = () => {
    const menu = {
      label: label,
      roleId: roleId,
      afterLogin: afterLogin,
      tree: tree,
    };
    downloadJsonFile(menu, label);
  };

  const onUpload = (event) => {
    readJSONFile(event)
      .then((json) => {
        setLabel(json.label);
        setRoleId(json.roleId);
        setAfterLogin(json.afterLogin);
        setTree(json.tree);
        event.target.value = null;
      })
      .catch((error) => console.log(error));
  };

  const {
    data: treeResponse,
    isLoading: treeLoading,
    error: treeError,
    isError: treeIsError,
  } = useQuery({
    queryKey: ['tree-menu', id],
    queryFn: onLoad,
    enabled: !!id,
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: onSave,
    onSuccess: (res) => {
      setAlert({ status: true, type: 'success', message: res.message });
      localStorage.setItem('tree', JSON.stringify(tree));
      navigate('/menu');
    },
    onError: (err) => {
      setAlert({ status: true, type: 'error', message: err });
    },
  });

  useEffect(() => {
    if (treeResponse) {
      const treeData = getTreeMenuJson(treeResponse.data.tree);
      setLabel(treeResponse.data.label);
      setRoleId(treeResponse.data.roleId);
      setTree(treeData);
      setAfterLogin(treeResponse.data.afterLogin);
    }
  }, [treeResponse]);

  useEffect(() => {
    if (treeIsError) {
      setAlert({ status: true, type: 'error', message: treeError });
    }
  }, [treeIsError]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  if (treeLoading) {
    return <ContentLoader />;
  }

  const hasActiveMenu = !!activeMenu.id;

  const structureActions = [
    {
      title: 'Move Up',
      icon: <North fontSize="small" />,
      onClick: () => onMove(actionType.up),
      disabled: !hasActiveMenu,
    },
    {
      title: 'Move Down',
      icon: <South fontSize="small" />,
      onClick: () => onMove(actionType.down),
      disabled: !hasActiveMenu,
    },
    {
      title: 'Add Root Menu',
      icon: <CreateNewFolder fontSize="small" />,
      onClick: onAddRootMenu,
    },
    {
      title: 'Add Sub Menu',
      icon: <NoteAdd fontSize="small" />,
      onClick: onAdd,
      disabled: !hasActiveMenu,
    },
    {
      title: 'Delete',
      icon: <Delete fontSize="small" />,
      onClick: onDelete,
      disabled: !hasActiveMenu,
      color: 'error',
    },
  ];

  return (
    <Box>
      <PageHeader
        sticky
        onBack={onBack}
        icon={<AccountTree />}
        title={id ? 'Edit Menu' : 'Create Menu'}
        subtitle="Build the navigation tree shown in the sidebar"
        actions={
          <>
            <Upload
              label={translator('upload')}
              onUpload={onUpload}
              type=".json"
              startIcon={<FileUpload />}
            />
            <Button
              variant="outlined"
              onClick={onDownload}
              startIcon={<Download />}
            >
              {translator('download')}
            </Button>
            <Button
              variant="contained"
              loading={mutation.isPending}
              onClick={mutation.mutate}
              startIcon={<Save />}
            >
              {translator('save')}
            </Button>
          </>
        }
      />

      <SectionCard
        icon={<InfoOutlined />}
        title="Menu Information"
        subtitle="Who can see this menu and where they land after login"
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          <ShortText value={label} label="Label" onChange={setLabel} />
          <Dropdown
            value={roleId}
            label="Role"
            onChange={setRoleId}
            id={CFieldID.menus.roleId}
          />
          <ShortText
            value={afterLogin}
            label="After Login"
            onChange={setAfterLogin}
          />
        </Box>
      </SectionCard>

      <SectionCard
        icon={<AccountTree />}
        title="Menu Structure"
        subtitle="Select an item to edit it, or add a new root menu"
        disablePadding
        actions={structureActions.map((action) => (
          <Tooltip key={action.title} title={action.title}>
            <span>
              <IconButton
                color={action.color || 'primary'}
                onClick={action.onClick}
                disabled={action.disabled}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                {action.icon}
              </IconButton>
            </span>
          </Tooltip>
        ))}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 2fr) minmax(0, 3fr)',
            },
            minHeight: 420,
          }}
        >
          <Box
            sx={(theme) => ({
              p: 2,
              borderRight: { md: `1px solid ${theme.palette.divider}` },
              borderBottom: {
                xs: `1px solid ${theme.palette.divider}`,
                md: 'none',
              },
            })}
          >
            {tree.length > 0 ? (
              <Tree
                tree={tree}
                onParentClick={onClick}
                onChildClick={onClick}
                isSidebar={false}
                setTree={setTree}
              />
            ) : (
              <EmptyState
                icon={<CreateNewFolder />}
                title="No menu items"
                description="Start by adding a root menu."
                action={
                  <Button
                    variant="outlined"
                    startIcon={<CreateNewFolder />}
                    onClick={onAddRootMenu}
                  >
                    Add Root Menu
                  </Button>
                }
              />
            )}
          </Box>

          <Box sx={{ p: 3 }}>
            {hasActiveMenu ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="overline" color="textSecondary">
                  Selected Item
                </Typography>
                <ShortText
                  value={activeMenu.label}
                  label="Label"
                  onChange={(value) => changeMenuValue('label', value)}
                  onBlur={onEdit}
                />
                <ShortText
                  value={activeMenu.url}
                  label="URL"
                  onChange={(value) => changeMenuValue('url', value)}
                  onBlur={onEdit}
                />
                {!activeMenu.child?.length && (
                  <Box>
                    <Typography sx={{ mb: 1 }}>Icon</Typography>
                    <IconPicker
                      active={activeMenu.icon}
                      onSelect={(value) => changeMenuValue('icon', value)}
                      onBlur={onEdit}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <EmptyState
                icon={<TouchApp />}
                title="No item selected"
                description="Pick a menu item from the tree to edit its label, URL and icon."
              />
            )}
          </Box>
        </Box>
      </SectionCard>
    </Box>
  );
};

export default Page;
