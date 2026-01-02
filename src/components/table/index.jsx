import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useState } from 'react';
import EActionType from '@/enums/EActionType';
import EInputType from '@/enums/EInputType';
import Translator from '@/hooks/Translator';
import RowCustomActionDialog from './CustomActionDialog';
import Download from './Download';
// import ExportDialog from './ExportDialog';
import RowAction from './RowAction';
import ToolbarAction from './ToolbarAction';
import ToolBarComponent from './ToolbarComponent';

const Table = (props) => {
  const {
    action = [],
    columnKey,
    columnPinning = {},
    columns = [],
    enableColumnResizing = false,
    enableDensityToggle = false,
    enableExport = false,
    enableFilter = false,
    enableFullScreenToggle = false,
    enableHiding = false,
    enablePagination = false,
    enablePinning = false,
    enableRowSelection = false,
    enableSearch = false,
    enableSorting = false,
    isLoading = false,
    onChangePage,
    onClickRowAction,
    onClickRowCustomAction,
    onClickToolbarAction,
    onExport,
    onFilter,
    onSearch,
    onSelect,
    onSort,
    rowCount = 0,
    rowCustomAction = [],
    rows = [],
    toolbarCustomAction = [],
  } = props;

  const translator = Translator();

  const pageSize = 10;
  const pageIndex = 0;

  const [pagination, setPagination] = useState({
    pageIndex: pageIndex,
    pageSize: pageSize,
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState([]);
  // const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openRowCustomActionDialog, setOpenRowCustomActionDialog] =
    useState(false);
  const [rowClicked, setRowClicked] = useState(null);

  const initialState = {
    columnPinning: columnPinning,
    density: 'compact',
    pagination: pagination,
  };

  const isSupportAddAction = !!action.find(
    (item) => item.type === EActionType.insert.value,
  );
  const isSupportRowAction =
    action.filter((item) => item.type !== EActionType.insert.value).length > 0;
  const muiBottomToolbarProps =
    !enablePagination && !onChangePage ? { style: { display: 'none' } } : false;
  const muiTableContainerProps = { sx: { maxHeight: '500px' } };
  const muiTablePaginationProps = { showRowsPerPage: false };

  const formattedColumns = columns.map((column) => {
    column.Cell = function OrderItems({ cell }) {
      if (column.type === EInputType.file.value) {
        return <Download label={cell.getValue()} />;
      }
      return cell.getValue();
    };
    if (column.footer) {
      column.Footer = () => columnFooter(column.footer);
    }
    return column;
  });

  const getToolbarAction = () => {
    if (!toolbarCustomAction.length && !isSupportAddAction) return;
    return (
      <ToolbarAction
        action={action}
        onClickToolbarAction={onClickToolbarAction}
        toolbarCustomAction={toolbarCustomAction}
        isSupportAddAction={isSupportAddAction}
      />
    );
  };

  const getToolbarComponent = (table) => {
    return (
      <ToolBarComponent
        table={table}
        enableSearch={enableSearch}
        enableFilter={enableFilter}
        enableHiding={enableHiding}
        enableDensityToggle={enableDensityToggle}
        enableFullScreenToggle={enableFullScreenToggle}
        enableExport={enableExport}
        onExport={onExport}
      />
    );
  };

  const getRowAction = (row) => {
    return (
      <RowAction
        onClickRowAction={onClickRowAction}
        action={action}
        row={row}
        isSupportRowAction={isSupportRowAction}
        rowCustomAction={rowCustomAction}
        setOpenRowCustomActionDialog={setOpenRowCustomActionDialog}
        setRowClicked={setRowClicked}
      />
    );
  };

  const columnFooter = (footer) => {
    if (!footer) return false;
    return (
      <Stack>
        {footer.label} :<Box color="warning.main">{footer.value}</Box>
      </Stack>
    );
  };

  const table = useMaterialReactTable({
    columns: formattedColumns,
    data: rows,
    enableColumnActions: false,
    enableColumnFilters: enableFilter,
    enableColumnResizing: enableColumnResizing,
    enableDensityToggle: enableDensityToggle,
    enableEditing: isSupportRowAction,
    enableFilterMatchHighlighting: false,
    enableFullScreenToggle: enableFullScreenToggle,
    enableGlobalFilter: enableSearch,
    enableHiding: enableHiding,
    enablePagination: enablePagination,
    enablePinning: enablePinning,
    enableRowSelection: enableRowSelection,
    enableSorting: enableSorting,
    enableStickyFooter: true,
    enableStickyHeader: true,
    getRowId: (row) => row[columnKey],
    initialState: initialState,
    layoutMode: 'grid',
    localization: {
      actions: translator('action'),
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiBottomToolbarProps: muiBottomToolbarProps,
    muiPaginationProps: muiTablePaginationProps,
    muiTableContainerProps: muiTableContainerProps,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: onSearch,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    pageSize: pageSize,
    positionToolbarAlertBanner: 'none',
    renderRowActions: ({ row }) => getRowAction(row),
    renderToolbarInternalActions: ({ table }) => getToolbarComponent(table),
    renderTopToolbarCustomActions: getToolbarAction,
    rowCount: rowCount,
    state: { pagination, columnFilters, sorting, rowSelection, isLoading },
  });

  useEffect(() => {
    if (enablePagination && onChangePage) {
      onChangePage(pagination.pageIndex + 1);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (enableFilter && onFilter) {
      onFilter(columnFilters);
    }
  }, [columnFilters]);

  useEffect(() => {
    if (enableSorting && onSort) {
      onSort(sorting);
    }
  }, [sorting]);

  useEffect(() => {
    if (enableRowSelection && onSelect) {
      onSelect(Object.keys(rowSelection));
    }
  }, [rowSelection]);

  return (
    formattedColumns &&
    formattedColumns.length > 0 && (
      <Box>
        <MaterialReactTable table={table} />
        {/*
        |
        | disable export dialog for now because using onExport prop
        |
        {enableExport && (
          <ExportDialog
            table={table}
            columns={columns}
            openExportDialog={openExportDialog}
            setOpenExportDialog={setOpenExportDialog}
          />
        )}
        */}
        {rowCustomAction.length > 0 && (
          <RowCustomActionDialog
            onClickRowCustomAction={onClickRowCustomAction}
            openRowCustomActionDialog={openRowCustomActionDialog}
            rowClicked={rowClicked}
            rowCustomAction={rowCustomAction}
            setOpenRowCustomActionDialog={setOpenRowCustomActionDialog}
          />
        )}
      </Box>
    )
  );
};

export default Table;
