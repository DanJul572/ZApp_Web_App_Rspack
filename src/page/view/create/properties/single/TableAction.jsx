import { useEffect, useState } from 'react';

import InsertLink from '@mui/icons-material/InsertLink';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Code from '@/component/input/Code';
import Toggle from '@/component/input/Toggle';

import Translator from '@/hook/Translator';

import CActionType from '@/constant/CActionType';
import CComponentGroupType from '@/constant/CComponentGroupType';
import CTheme from '@/constant/CTheme';

const TableAction = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const { t } = Translator();

  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState([]);

  const actions = [
    {
      label: CActionType.insert.label,
      type: CActionType.insert.value,
      onClick: null,
    },
    {
      label: CActionType.update.label,
      type: CActionType.update.value,
      onClick: null,
    },
    {
      label: CActionType.delete.label,
      type: CActionType.delete.value,
      onClick: null,
    },
  ];

  const checkAction = (param) => {
    return selectedAction.find((action) => action.type === param.type);
  };

  const changeActions = (param, isToggle) => {
    let newActions = [...selectedAction];

    if (isToggle) {
      if (checkAction(param)) {
        newActions = newActions.filter((action) => action.type !== param.type);
      } else {
        newActions.push(param);
      }
    } else {
      newActions = newActions.map((action) => {
        return action.type === param.type ? param : action;
      });
      setOpen(false);
    }
    const newContent = editComponent('actions', newActions, content);
    setContent([...newContent]);
  };

  const changeOnClick = (type) => {
    const newOpen = { ...open };
    newOpen.onClick = type;
    setOpen(newOpen);
  };

  const applyOnClick = () => {
    changeActions(open, false);
  };

  const getValue = (param) => {
    return checkAction(param) || param;
  };

  const validComponent = () => {
    if (!selected) return false;

    const group = selected.group.value;

    if (group !== CComponentGroupType.table.value) return false;

    return true;
  };

  useEffect(() => {
    if (selected) setSelectedAction(selected.properties.actions || []);
  }, [selected, content]);

  return (
    validComponent() && (
      <Box>
        <Box paddingX={2}>
          <Typography fontSize={CTheme.font.size.value} marginBottom={1}>
            Actions
          </Typography>
          <Divider />
          <Box>
            {actions.map((action) => {
              return (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  key={action.type}
                  marginTop={1}
                >
                  <Toggle
                    value={Boolean(checkAction(action))}
                    label={action.label}
                    onChange={() => changeActions(action, true)}
                  />
                  {action.type !== CActionType.delete.value && (
                    <IconButton
                      sx={{ padding: 0 }}
                      size={CTheme.button.size.name}
                      onClick={() => setOpen(getValue(action))}
                      disabled={!checkAction(action)}
                    >
                      <InsertLink fontSize={CTheme.font.size.name} />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Dialog
          open={Boolean(open)}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogTitle>{open.label}</DialogTitle>
          <DialogContent>
            <Box width={500}>
              <Code value={open.onClick} onChange={changeOnClick} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              size={CTheme.button.size.name}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={applyOnClick}
              variant="contained"
              size={CTheme.button.size.name}
            >
              {t('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default TableAction;
