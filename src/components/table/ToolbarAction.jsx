import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CTheme from '@/configs/CTheme';
import EActionType from '@/enums/EActionType';
import Translator from '@/hooks/Translator';

const ToolbarAction = (props) => {
  const {
    action,
    onClickToolbarAction,
    toolbarCustomAction,
    isSupportAddAction,
  } = props;

  const translator = Translator();

  const insertAction = action.find(
    (action) => action.type === EActionType.insert.value,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        p: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {isSupportAddAction && (
        <Button
          onClick={() => onClickToolbarAction(insertAction)}
          variant="contained"
          size={CTheme.button.size.name}
        >
          {translator('add_new_data')}
        </Button>
      )}
      {toolbarCustomAction.map((action) => (
        <Button
          key={action.type}
          onClick={() => onClickToolbarAction(action)}
          variant="contained"
          size={CTheme.button.size.name}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};

export default ToolbarAction;
