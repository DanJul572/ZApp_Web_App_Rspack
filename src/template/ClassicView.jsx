import Box from '@mui/material/Box';

import Confirm from '@/component/dialog/Confirm';
import ContentLoader from '@/component/loading/contentLoader';
import Table from '@/component/table';

import TableFunction from '@/hook/TableFunction';
import Translator from '@/hook/Translator';

const ClassicView = (props) => {
  const { t } = Translator();

  const {
    actions,
    columnKey,
    columns,
    isColumnsLoading,
    isRowsLoading,
    onClickRowAction,
    onCLickToolbarAction,
    onConfirm,
    openConfirmDialog,
    rowCount,
    rows,
    setAdvanceFilter,
    setFilter,
    setPage,
    setSort,
  } = TableFunction(props);

  const { rowCustomAction, onClickRowCustomAction } = props;

  if (isColumnsLoading) {
    return <ContentLoader />;
  }

  return (
    <Box>
      <Table
        action={actions}
        columnKey={columnKey}
        columns={columns}
        enableAdvanceFilter={true}
        enableColumnResizing={true}
        enableExport={true}
        enableFilter={true}
        enableHiding={true}
        enablePagination={true}
        enableRowSelection={true}
        enableSorting={true}
        isLoading={isRowsLoading}
        onAdvanceFilter={setAdvanceFilter}
        onChangePage={setPage}
        onClickRowAction={onClickRowAction}
        onClickRowCustomAction={onClickRowCustomAction}
        onClickToolbarAction={onCLickToolbarAction}
        onFilter={setFilter}
        onSort={setSort}
        pageIndex={0}
        rowCount={rowCount}
        rowCustomAction={rowCustomAction}
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
};

export default ClassicView;
