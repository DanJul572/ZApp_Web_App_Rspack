import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Info from '@mui/icons-material/Info';
import Menu from '@mui/icons-material/Menu';

import CActionType from '@/constant/CActionType';
import CTheme from '@/constant/CTheme';

const RowAction = (props) => {
  const {
    action,
    isSupportRowAction,
    onClickRowAction,
    row,
    rowCustomAction,
    setOpenRowCustomActionDialog,
    setRowClicked,
  } = props;

  const onClickCustomAction = () => {
    setOpenRowCustomActionDialog(true);
    setRowClicked(row.original);
  };

  const findAction = (type) => {
    return action.find((item) => item.type === CActionType[type].value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isSupportRowAction && findAction('update') && (
        <IconButton
          onClick={() =>
            onClickRowAction({
              action: findAction('update'),
              row: row.original,
            })
          }
          size={CTheme.button.size.name}
        >
          <Edit fontSize={CTheme.font.size.name} />
        </IconButton>
      )}
      {isSupportRowAction && findAction('delete') && (
        <IconButton
          onClick={() =>
            onClickRowAction({
              action: findAction('delete'),
              row: row.original,
            })
          }
          size={CTheme.button.size.name}
        >
          <Delete fontSize={CTheme.font.size.name} />
        </IconButton>
      )}
      {isSupportRowAction && findAction('detail') && (
        <IconButton
          onClick={() =>
            onClickRowAction({
              action: findAction('detail'),
              row: row.original,
            })
          }
          size={CTheme.button.size.name}
        >
          <Info fontSize={CTheme.font.size.name} />
        </IconButton>
      )}
      {rowCustomAction.length > 0 && (
        <IconButton
          onClick={onClickCustomAction}
          size={CTheme.button.size.name}
        >
          <Menu fontSize={CTheme.font.size.name} />
        </IconButton>
      )}
    </Box>
  );
};

export default RowAction;
