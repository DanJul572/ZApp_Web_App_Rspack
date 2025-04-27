import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Translator from '@/hook/Translator';

import CActionType from '@/constant/CActionType';
import CTheme from '@/constant/CTheme';

const ToolbarAction = (props) => {
  const {
    action,
    onClickToolbarAction,
    toolbarCustomAction,
    isSupportAddAction,
  } = props;

  const { t } = Translator();

  const insertAction = action.find(
    (action) => action.type === CActionType.insert.value,
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
          {t('add_new_data')}
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
