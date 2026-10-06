import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ZTable from '@/aliases/ZTable';
import Confirm from '@/components/dialog/Confirm';
import EActionType from '@/enums/EActionType';
import ETableType from '@/enums/ETableType';
import TableFunction from '@/hooks/TableFunction';
import Translator from '@/hooks/Translator';
import ScriptEngine from '../script/ScriptEngine';

const TableRenderer = (props) => {
  const { type, properties, isBuilder } = props;

  const scriptEngine = ScriptEngine({ isBuilder });

  const translator = Translator();

  const actions = properties.actions;
  const defaultFilter = scriptEngine.evaluate(properties.filter);
  const moduleID = properties.moduleID;

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
  } = TableFunction({ moduleID, actions, isBuilder, defaultFilter });

  const handleToolbarAction = (action) => {
    if (action.type === EActionType.insert.value) {
      scriptEngine.execute(action.onClick);
    }
  };

  const handleRowAction = (data) => {
    const action = data.action;
    const param = { row: data.row };
    if (action.type === EActionType.update.value) {
      scriptEngine.execute(action.onClick, param);
    } else if (action.type === EActionType.delete.value) {
      setSelectedRow(data.row);
      setOpenConfirmDialog(true);
    }
  };

  if (isBuilder) {
    return (
      <Typography textAlign="center">{translator('empty_content')}</Typography>
    );
  }

  if (type !== ETableType.table.value || !moduleID) return null;

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
        onClickRowAction={handleRowAction}
        onClickToolbarAction={handleToolbarAction}
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
};

export default TableRenderer;
