import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ZTable from '@/aliases/ZTable';
import Confirm from '@/components/dialog/Confirm';
import EActionType from '@/enums/EActionType';
import ETableType from '@/enums/ETableType';

import TableFunction from '@/hooks/TableFunction';

import Translator from '@/hooks/Translator';
import Waiter from '@/interpreter/waiter';

const Table = (props) => {
  const { type, properties, isBuilder } = props;

  const waiter = Waiter({ isBuilder });

  const translator = Translator();

  const actions = properties.actions;
  const defaultFilter = waiter.take(properties.filter);
  const moduleID = properties.moduleID;

  const tableProps = {
    moduleID,
    actions,
    isBuilder,
    defaultFilter,
  };

  const {
    columnKey,
    columns,
    onConfirm,
    openConfirmDialog,
    rowCount,
    rows,
    setFilter,
    setOpenConfirmDialog,
    setPage,
    setSelectedRow,
    setSort,
  } = TableFunction(tableProps);

  const onCLickToolbarAction = (action) => {
    if (action.type === EActionType.insert.value) order(action.onClick);
  };

  const onClickRowAction = (data) => {
    const action = data.action;
    const param = { row: data.row };
    if (action.type === EActionType.update.value) {
      order(action.onClick, param);
    } else if (data.action.type === EActionType.delete.value) {
      setSelectedRow(data.row);
      setOpenConfirmDialog(true);
    }
  };

  const content = () => {
    if (isBuilder) {
      return (
        <Typography textAlign="center">
          {translator('empty_content')}
        </Typography>
      );
    }
    if (type === ETableType.table.value && moduleID) {
      return (
        <Box>
          <ZTable
            action={actions}
            columnKey={columnKey}
            columns={columns}
            enableColumnResizing={true}
            enableExport={true}
            enableFilter={true}
            enableHiding={true}
            enablePagination={true}
            enableRowSelection={true}
            enableSorting={true}
            onChangePage={setPage}
            onClickRowAction={onClickRowAction}
            onClickToolbarAction={onCLickToolbarAction}
            onFilter={setFilter}
            onSort={setSort}
            pageIndex={0}
            rowCount={rowCount}
            rows={rows}
          />
          <Confirm
            cancelButton={translator('cancel')}
            confirmButton={translator('delete')}
            onConfirm={onConfirm}
            open={openConfirmDialog}
            text={translator('confirm_delete')}
            title={translator('delete_data')}
          />
        </Box>
      );
    }
  };

  return content();
};

export default Table;
