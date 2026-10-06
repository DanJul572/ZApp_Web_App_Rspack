import DataObject from '@mui/icons-material/DataObject';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import Code from '@/components/input/Code';
import EActionType from '@/enums/EActionType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import Translator from '@/hooks/Translator';
import { PropertyRow, RowAction } from '../common/PropertyUI';

const TableAction = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const translator = Translator();

  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState([]);

  const actions = [
    {
      label: EActionType.insert.label,
      type: EActionType.insert.value,
      onClick: null,
    },
    {
      label: EActionType.update.label,
      type: EActionType.update.value,
      onClick: null,
    },
    {
      label: EActionType.delete.label,
      type: EActionType.delete.value,
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

    if (group !== EComponentGroupType.table.value) return false;

    return true;
  };

  useEffect(() => {
    if (selected) setSelectedAction(selected.properties.actions || []);
  }, [selected, content]);

  return (
    validComponent() && (
      <Box>
        {actions.map((action) => (
          <PropertyRow key={action.type} label={action.label}>
            {action.type !== EActionType.delete.value && (
              <RowAction
                title="Edit on click"
                onClick={() => setOpen(getValue(action))}
                disabled={!checkAction(action)}
              >
                <DataObject />
              </RowAction>
            )}
            <Switch
              size="small"
              checked={Boolean(checkAction(action))}
              onChange={() => changeActions(action, true)}
            />
          </PropertyRow>
        ))}
        <Dialog
          open={Boolean(open)}
          onClose={() => setOpen(false)}
          aria-hidden={open ? 'false' : 'true'}
        >
          <DialogTitle>{open.label}</DialogTitle>
          <DialogContent>
            <Box sx={{ width: 500 }}>
              <Code value={open.onClick} onChange={changeOnClick} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              {translator('cancel')}
            </Button>
            <Button onClick={applyOnClick} variant="contained">
              {translator('apply')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default TableAction;
