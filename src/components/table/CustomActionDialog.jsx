import List from '@/components/dialog/List';

const RowCustomActionDialog = (props) => {
  const {
    onClickRowCustomAction,
    openRowCustomActionDialog,
    rowClicked,
    rowCustomAction,
    setOpenRowCustomActionDialog,
  } = props;

  const onCLickAction = (action) => {
    onClickRowCustomAction({
      action: action,
      row: rowClicked,
    });
  };

  return (
    <List
      items={rowCustomAction}
      onSelected={onCLickAction}
      open={openRowCustomActionDialog}
      setOpen={setOpenRowCustomActionDialog}
    />
  );
};

export default RowCustomActionDialog;
