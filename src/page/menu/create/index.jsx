import { useAlert } from '@/context/AlertProvider';
import { useLoading } from '@/context/LoadingProvider';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CreateNewFolder from '@mui/icons-material/CreateNewFolder';
import Delete from '@mui/icons-material/Delete';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import NoteAdd from '@mui/icons-material/NoteAdd';

import Upload from '@/component/button/Upload';
import IconPicker from '@/component/iconPicker';
import Dropdown from '@/component/input/Dropdown';
import ShortText from '@/component/input/ShortText';
import Tree from '@/component/tree';

import CApiUrl from '@/constant/CApiUrl';
import CFieldID from '@/constant/CFieldID';
import CModuleID from '@/constant/CModuleID';
import CTheme from '@/constant/CTheme';

import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

import { downloadJsonFile } from '@/helper/downloadFile';
import { readJSONFile } from '@/helper/readFile';

const Page = () => {
  const { post, get } = Request();
  const { t } = Translator();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setLoading } = useLoading();
  const { setAlert } = useAlert();

  const [label, setLabel] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [afterLogin, setAfterLogin] = useState(null);
  const [list, setList] = useState([]);
  const [activeMenu, setActiveMenu] = useState({
    id: null,
    label: null,
    url: null,
    icon: null,
  });

  const id = searchParams.get('id');
  const actionType = { add: 1, edit: 2, delete: 3, up: 4, down: 5 };

  const generateNewMenu = () => {
    return { id: uuidv4(), label: 'New Item', url: '', icon: null };
  };

  const changeMenuItem = (menu, type, itemParam = null) => {
    if (activeMenu.id) {
      for (let x = 0; x < menu.length; x++) {
        const item = menu[x];
        if (item.id === activeMenu.id) {
          const newItem = {
            id: activeMenu.id,
            label: activeMenu.label,
            url: activeMenu.url,
            icon: activeMenu.icon,
          };
          console.log('newItem', newItem);
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
          changeMenuItem(item.child, type, itemParam);
        }
      }
    }
    return menu;
  };

  const onLoad = () => {
    setLoading(true);

    const body = { moduleId: CModuleID.menus, rowId: id };

    get(CApiUrl.common.detail, body)
      .then((res) => {
        setLabel(res.label);
        setRoleId(res.roleId);
        setList(res.tree);
        setAfterLogin(res.afterLogin);
      })
      .catch((err) => {
        setAlert({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const changeMenuValue = (key, value) => {
    setActiveMenu((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onClick = (menu) => {
    setActiveMenu(menu);
  };

  const onEdit = () => {
    const result = changeMenuItem([...list], actionType.edit);
    setList(result);
  };

  const onAddRootMenu = () => {
    const menu = generateNewMenu();
    setList([...list, menu]);
  };

  const onAdd = () => {
    const menu = generateNewMenu();
    const result = changeMenuItem([...list], actionType.add, menu);
    setList(result);
  };

  const onDelete = () => {
    const result = changeMenuItem([...list], actionType.delete);
    setList(result);
  };

  const onMove = (type) => {
    const result = changeMenuItem([...list], type);
    setList(result);
  };

  const onBack = () => {
    navigate(-1);
  };

  const onSave = () => {
    const url = id ? CApiUrl.common.update : CApiUrl.common.create;
    const body = {
      moduleId: CModuleID.menus,
      data: {
        label: label,
        tree: JSON.stringify(list),
        roleId: roleId,
        afterLogin: afterLogin,
      },
    };

    if (id) body.rowId = id;

    post(url, body)
      .then((res) => {
        setAlert({ status: true, type: 'success', message: res });
        navigate('/menu');
      })
      .catch((err) => {
        setAlert({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const onDownload = () => {
    const menu = {
      label: label,
      roleId: roleId,
      afterLogin: afterLogin,
      list: list,
    };
    downloadJsonFile(menu, label);
  };

  const onUpload = (event) => {
    readJSONFile(event)
      .then((json) => {
        setLabel(json.label);
        setRoleId(json.roleId);
        setAfterLogin(json.afterLogin);
        setList(json.list);
        event.target.value = null;
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (id) onLoad();
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Upload label={t('upload')} onUpload={onUpload} type=".json" />
        <Button
          variant="outlined"
          size={CTheme.button.size.name}
          onClick={onDownload}
        >
          {t('download')}
        </Button>
        <Button
          variant="outlined"
          size={CTheme.button.size.name}
          onClick={onBack}
        >
          {t('back')}
        </Button>
        <Button
          variant="contained"
          size={CTheme.button.size.name}
          onClick={onSave}
        >
          {t('save')}
        </Button>
      </Box>
      <Box>
        <Box gap={2} display="flex" flexDirection="column" marginBottom={2}>
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
        <Card>
          <Box padding={1}>
            <Tooltip arrow title="Move To Up">
              <IconButton
                size={CTheme.button.size.name}
                color="primary"
                onClick={() => onMove(actionType.up)}
              >
                <KeyboardArrowUp fontSize={CTheme.font.size.name} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Move To Down">
              <IconButton
                size={CTheme.button.size.name}
                color="primary"
                onClick={() => onMove(actionType.down)}
              >
                <KeyboardArrowDown fontSize={CTheme.font.size.name} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Add Root Menu">
              <IconButton
                size={CTheme.button.size.name}
                color="primary"
                variant="outlined"
                onClick={onAddRootMenu}
              >
                <CreateNewFolder fontSize={CTheme.font.size.name} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Add Sub Menu">
              <IconButton
                size={CTheme.button.size.name}
                color="primary"
                variant="outlined"
                onClick={onAdd}
              >
                <NoteAdd fontSize={CTheme.font.size.name} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Delete">
              <IconButton
                size={CTheme.button.size.name}
                color="primary"
                variant="outlined"
                onClick={onDelete}
              >
                <Delete fontSize={CTheme.font.size.name} />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ backgroundColor: CTheme.palette.primary.main }} />
          <Box gap={2} display="flex">
            <Box padding={1} flex={1}>
              <Tree
                list={list}
                onParentClick={onClick}
                onChildClick={onClick}
                isSidebar={false}
                setList={setList}
              />
            </Box>
            <Box
              padding={2}
              display="flex"
              flexDirection="column"
              gap={2}
              flex={1}
            >
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
              <Box>
                <Typography fontSize={CTheme.font.size.value}>Icon</Typography>
                <IconPicker
                  onSelect={(value) => changeMenuValue('icon', value)}
                  onBlur={onEdit}
                />
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Page;
