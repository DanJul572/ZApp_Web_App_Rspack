import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAlert } from '@/context/AlertProvider';
import { useLoading } from '@/context/LoadingProvider';

import Request from '@/hook/Request';

import CActionType from '@/constant/CActionType';
import CApiUrl from '@/constant/CApiUrl';

const TableFunction = (props) => {
  const { moduleID, actions, isBuilder, defaultFilter } = props;

  const { post, get } = Request();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { setAlert } = useAlert();
  const { setLoading } = useLoading();

  const [page, setPage] = useState(1);
  const [advanceFilter, setAdvanceFilter] = useState(null);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const { data: columns = [], isLoading: isLoadingColumns } = useQuery({
    queryKey: ['columns', moduleID],
    queryFn: () => get(CApiUrl.common.columns, { id: moduleID }),
    enabled: !isBuilder,
    onError: (err) => {
      setAlert({
        status: true,
        type: 'error',
        message: err.toString(),
      });
    },
  });

  const columnKey = useMemo(() => {
    return columns.find((col) => col.identity)?.accessorKey ?? null;
  }, [columns]);

  const { data: rowsData = { rows: [], count: 0 }, isLoading: isLoadingRows } =
    useQuery({
      queryKey: ['rows', moduleID, page, filter, sort, advanceFilter],
      queryFn: () =>
        post(CApiUrl.common.rows, {
          id: moduleID,
          page,
          filter,
          sort,
          advanceFilter,
          defaultFilter: defaultFilter || [],
        }),
      enabled: columns.length > 0,
      onError: (err) => {
        setAlert({
          status: true,
          type: 'error',
          message: err.toString(),
        });
      },
    });

  const deleteMutation = useMutation({
    mutationFn: () => {
      const action = actions.find(
        (action) => action.type === CActionType.delete.value,
      );
      const url = action?.api || CApiUrl.common.delete;
      return post(url, {
        moduleId: moduleID,
        id: selectedRow[columnKey],
      });
    },
    onSuccess: (res) => {
      setAlert({
        status: true,
        type: 'success',
        message: res,
      });
      queryClient.invalidateQueries(['rows', moduleID]);
    },
    onError: (err) => {
      setAlert({
        status: true,
        type: 'error',
        message: err.toString(),
      });
    },
  });

  const onDelete = () => {
    setLoading(true);
    deleteMutation.mutate(undefined, {
      onSettled: () => setLoading(false),
    });
  };

  const onCLickToolbarAction = (action) => {
    if (action.type === CActionType.insert.value) navigate(action.path);
  };

  const onClickRowAction = (data) => {
    if (data.action.type === CActionType.delete.value) {
      setSelectedRow(data.row);
      setOpenConfirmDialog(true);
    } else if (data.action.type === CActionType.update.value) {
      navigate(`${data.action.path}?${columnKey}=${data.row[columnKey]}`);
    }
  };

  const onConfirm = (confirm) => {
    if (confirm) onDelete();
    setOpenConfirmDialog(false);
  };

  return {
    actions,
    columns,
    columnKey,
    onClickRowAction,
    onCLickToolbarAction,
    onConfirm,
    openConfirmDialog,
    rowCount: rowsData.count,
    rows: rowsData.rows,
    setAdvanceFilter,
    setFilter,
    setOpenConfirmDialog,
    setPage,
    setSelectedRow,
    setSort,
    isLoading: isLoadingColumns || isLoadingRows || deleteMutation.isLoading,
  };
};

export default TableFunction;
