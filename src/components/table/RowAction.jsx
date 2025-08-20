import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Info from '@mui/icons-material/Info';
import Menu from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EActionType from '@/enums/EActionType';

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
    return action.find((item) => item.type === EActionType[type].value);
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
          color="primary"
        >
          <Edit />
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
          color="primary"
        >
          <Delete />
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
          color="primary"
        >
          <Info />
        </IconButton>
      )}
      {rowCustomAction.length > 0 && (
        <IconButton onClick={onClickCustomAction} color="primary">
          <Menu />
        </IconButton>
      )}
    </Box>
  );
};

export default RowAction;
