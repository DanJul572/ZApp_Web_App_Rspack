import CApiUrl from '@configs/CApiUrl';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAlert } from '@/contexts/AlertProvider';
import { useLoading } from '@/contexts/LoadingProvider';
import EActionType from '@/enums/EActionType';
import Request from '@/hooks/Request';

const TableFunction = (props) => {
  const { moduleID, actions, isBuilder, defaultFilter } = props;

  const { post, get } = Request();
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const { setLoading } = useLoading();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [columnKey, setColumnKey] = useState(null);

  const getColumns = async () => {
    return await get(CApiUrl.common.columns, { id: moduleID });
  };

  const { data: columns = [], isLoading: isColumnsLoading } = useQuery({
    queryKey: ['table-columns', moduleID],
    queryFn: getColumns,
    enabled: !!moduleID && !isBuilder,
    retry: 0,
  });

  const fetchRows = async () => {
    const body = {
      id: moduleID,
      page,
      filter,
      sort,
      defaultFilter: defaultFilter || [],
    };
    return await post(CApiUrl.common.rows, body);
  };

  const {
    data: rowsData,
    isLoading: isRowsLoading,
    refetch: refetchRows,
    isError: rowIsError,
    error: rowError,
  } = useQuery({
    queryKey: ['table-rows', moduleID, page, filter, sort, defaultFilter],
    queryFn: fetchRows,
    enabled: !!moduleID && !!columns && columns.length > 0,
    retry: 0,
  });

  const rows = rowsData?.rows || [];
  const rowCount = rowsData?.count || 0;

  const onDelete = () => {
    setLoading(true);
    const body = {
      moduleId: moduleID,
      id: selectedRow[columnKey],
    };
    const action = actions.find((a) => a.type === EActionType.delete.value);
    const url = action?.api || CApiUrl.common.delete;

    post(url, body)
      .then((res) => {
        setAlert({ status: true, type: 'success', message: res });
        refetchRows();
      })
      .catch((err) => {
        setAlert({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const onCLickToolbarAction = (action) => {
    if (action.type === EActionType.insert.value) {
      navigate(action.path);
    }
  };

  const onClickRowAction = (data) => {
    if (data.action.type === EActionType.delete.value) {
      setSelectedRow(data.row);
      setOpenConfirmDialog(true);
    } else if (data.action.type === EActionType.update.value) {
      navigate(`${data.action.path}?${columnKey}=${data.row[columnKey]}`);
    }
  };

  const onConfirm = (confirm) => {
    if (confirm) {
      onDelete();
    }
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    if (columns.length) {
      setColumnKey(columns.find((col) => col.identity).id);
    }
  }, [columns]);

  useEffect(() => {
    if (rowIsError) {
      setAlert({
        status: true,
        type: 'error',
        message: rowError,
      });
    }
  }, [rowIsError]);

  return {
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
    setFilter,
    setOpenConfirmDialog,
    setPage,
    setSelectedRow,
    setSort,
  };
};

export default TableFunction;
