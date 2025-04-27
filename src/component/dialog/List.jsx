import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import MuiList from '@/alias/MuiList';

const List = (props) => {
  const { items, onSelected, open, setOpen } = props;

  const onClose = () => {
    setOpen(false);
  };

  const select = (item) => {
    onSelected(item);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ width: '20rem', padding: 0 }}>
        <MuiList>
          {items.map((item) => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton onClick={() => select(item)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </MuiList>
      </DialogContent>
    </Dialog>
  );
};

export default List;
