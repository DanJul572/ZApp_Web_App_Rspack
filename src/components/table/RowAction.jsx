import DeleteOutline from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {isSupportRowAction && findAction('update') && (
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() =>
              onClickRowAction({
                action: findAction('update'),
                row: row.original,
              })
            }
            color="primary"
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {isSupportRowAction && findAction('delete') && (
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() =>
              onClickRowAction({
                action: findAction('delete'),
                row: row.original,
              })
            }
            color="error"
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {isSupportRowAction && findAction('detail') && (
        <Tooltip title="Detail">
          <IconButton
            size="small"
            onClick={() =>
              onClickRowAction({
                action: findAction('detail'),
                row: row.original,
              })
            }
            color="info"
          >
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {rowCustomAction.length > 0 && (
        <Tooltip title="More actions">
          <IconButton size="small" onClick={onClickCustomAction}>
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default RowAction;
