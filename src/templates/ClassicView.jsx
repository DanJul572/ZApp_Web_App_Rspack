import Box from '@mui/material/Box';

import Confirm from '@/componentss/dialog/Confirm';
import ContentLoader from '@/componentss/loading/ContentLoader';
import Table from '@/componentss/table';

import TableFunction from '@/hooks/TableFunction';
import Translator from '@/hooks/Translator';

const ClassicView = (props) => {
  const translator = Translator();

  const {
    actions,
    columns,
    isColumnsLoading,
    isRowsLoading,
    onClickRowAction,
    onCLickToolbarAction,
    onConfirm,
    openConfirmDialog,
    rowCount,
    rows,
    setFilter,
    setPage,
    setSort,
  } = TableFunction(props);

  const { rowCustomAction, onClickRowCustomAction } = props;

  if (isColumnsLoading) {
    return <ContentLoader />;
  }

  const columnKey = columns.find((col) => col.identity)?.id;

  return (
    <Box>
      <Table
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
        isLoading={isRowsLoading}
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

export default ClassicView;
