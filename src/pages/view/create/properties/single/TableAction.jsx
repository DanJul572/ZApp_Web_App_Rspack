import DataObject from '@mui/icons-material/DataObject';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import EActionType from '@/enums/EActionType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import CodeDialog from '../code/CodeDialog';
import getCodeSpec from '../code/codeSpecs';
import { PropertyRow, RowAction } from '../common/PropertyUI';

const TableAction = (props) => {
  const { content, selected, editComponent, setContent } = props;

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

  const applyOnClick = (onClick) => {
    changeActions({ ...open, onClick }, false);
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
        <CodeDialog
          open={Boolean(open)}
          onClose={() => setOpen(false)}
          title={`${open.label} - On Click`}
          value={open.onClick}
          spec={getCodeSpec('onClick', {
            group: EComponentGroupType.table.value,
            actionType: open.type,
          })}
          onApply={applyOnClick}
        />
      </Box>
    )
  );
};

export default TableAction;
