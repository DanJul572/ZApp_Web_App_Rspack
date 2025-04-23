import { useRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAlert } from '@/context/AlertProvider';
import { useLoading } from '@/context/LoadingProvider';

import Request from '@/hook/Request';

import CActionType from '@/constant/CActionType';
import CApiUrl from '@/constant/CApiUrl';

const TableFunction = (props) => {
  const { moduleID, actions, isBuilder, defaultFilter } = props;

  const { post, get } = Request();

  const { push } = useRouter();
  const { setAlert } = useAlert();
  const { setLoading } = useLoading();

  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(1);
  const [advanceFilter, setAdvanceFilter] = useState(null);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [columnKey, setColumnKey] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const getColumns = () => {
    setLoading(true);

    const param = {
      id: moduleID,
    };

    get(CApiUrl.common.columns, param)
      .then((res) => {
        const columnKey = res.find((column) => column.identity);
        setColumnKey(columnKey.accessorKey);
        setColumns(res);
      })
      .catch((err) => {
        setAlert({
          status: true,
          type: 'error',
          message: err,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRows = () => {
    setLoading(true);

    const body = {
      id: moduleID,
      page: page,
      advanceFilter: advanceFilter,
      filter: filter,
      sort: sort,
      defaultFilter: defaultFilter || [],
    };

    post(CApiUrl.common.rows, body)
      .then((res) => {
        setRows(res.rows);
        setRowCount(res.count);
      })
      .catch((err) => {
        setAlert({
          status: true,
          type: 'error',
          message: err,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDelete = () => {
    setLoading(true);

    const body = {
      moduleId: moduleID,
      id: selectedRow[columnKey],
    };

    const action = actions.find(
      (action) => action.type === CActionType.delete.value,
    );
    const url = action.api || CApiUrl.common.delete;

    post(url, body)
      .then((res) => {
        setAlert({
          status: true,
          type: 'success',
          message: res,
        });
        getRows();
      })
      .catch((err) => {
        setAlert({
          status: true,
          type: 'error',
          message: err,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCLickToolbarAction = (action) => {
    if (action.type === CActionType.insert.value) push(action.path);
  };

  const onClickRowAction = (data) => {
    if (data.action.type === CActionType.delete.value) {
      setSelectedRow(data.row);
      setOpenConfirmDialog(true);
    } else if (data.action.type === CActionType.update.value) {
      push(`${data.action.path}?${columnKey}=${data.row[columnKey]}`);
    }
  };

  const onConfirm = (confirm) => {
    if (confirm) onDelete();
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    if (columns && columns.length > 0) {
      getRows();
    }
  }, [columns, page, filter, sort, advanceFilter]);

  useEffect(() => {
    if (!isBuilder) {
      getColumns();
    }
  }, []);

  return {
    actions,
    columns,
    columnKey,
    onClickRowAction,
    onCLickToolbarAction,
    onConfirm,
    openConfirmDialog,
    rowCount,
    rows,
    setAdvanceFilter,
    setFilter,
    setOpenConfirmDialog,
    setPage,
    setSelectedRow,
    setSort,
  };
};

export default TableFunction;
