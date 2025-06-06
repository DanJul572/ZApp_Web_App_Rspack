import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Runner from '@/runner';

import Confirm from '@/component/dialog/Confirm';

import CActionType from '@/constant/CActionType';
import CTableType from '@/constant/CTableType';
import CTheme from '@/constant/CTheme';

import TableFunction from '@/hook/TableFunction';

import Translator from '@/hook/Translator';

import ZTable from '@/alias/ZTable';

const Table = (props) => {
  const { type, properties, isBuilder } = props;

  const { getValues, runFunction } = Runner({ isBuilder });

  const { t } = Translator();

  const actions = properties.actions;
  const defaultFilter = getValues(properties.filter);
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
    if (action.type === CActionType.insert.value) runFunction(action.onClick);
  };

  const onClickRowAction = (data) => {
    const action = data.action;
    const param = { row: data.row };
    if (action.type === CActionType.update.value) {
      runFunction(action.onClick, param);
    } else if (data.action.type === CActionType.delete.value) {
      setSelectedRow(data.row);
      setOpenConfirmDialog(true);
    }
  };

  const content = () => {
    if (isBuilder) {
      return <Typography textAlign="center">{t('empty_content')}</Typography>;
    }
    if (type === CTableType.table.value && moduleID) {
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
            cancelButton={t('cancel')}
            confirmButton={t('delete')}
            onConfirm={onConfirm}
            open={openConfirmDialog}
            text={t('confirm_delete')}
            title={t('delete_data')}
          />
        </Box>
      );
    }
  };

  return content();
};

export default Table;
