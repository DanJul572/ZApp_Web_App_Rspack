import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const Group = (props) => {
  const { color, items, onClick, size, variant } = props;

  const handleClick = (item) => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <ButtonGroup variant={variant || 'contained'}>
      {items &&
        items.length > 0 &&
        items.map((item) => {
          return (
            <Button
              color={color || 'primary'}
              key={item.value}
              onClick={() => handleClick(item)}
              size={size || 'small'}
            >
              {item.label}
            </Button>
          );
        })}
    </ButtonGroup>
  );
};

export default Group;
