import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MuiButton from '@/aliases/MuiButton';
import Group from '@/components/button/Group';
import * as Icon from '@/configs/CIcons';
import EButtonType from '@/enums/EButtonType';
import ScriptEngine from '../script/ScriptEngine';

const ButtonRenderer = (props) => {
  const { type, properties, isBuilder } = props;

  const scriptEngine = ScriptEngine({ isBuilder });

  const disabled = Boolean(scriptEngine.evaluate(properties.disable));
  const loading = Boolean(scriptEngine.evaluate(properties.loading));
  const fullWidth = Boolean(scriptEngine.evaluate(properties.fullWidth));
  const hidden = Boolean(scriptEngine.evaluate(properties.hidden));

  const items = scriptEngine.evaluate(properties.items);
  const label = scriptEngine.evaluate(properties.label);

  const color = properties.color ? properties.color.name : 'primary';
  const horizontalAlign = properties.display?.horizontal
    ? properties.display.horizontal.value
    : 'flex-start';
  const containerSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: horizontalAlign,
  };
  const onClick = properties.onClick;

  const iconName = properties.icon?.name;
  const isIconRight = properties.icon?.isRight;

  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
  const EndIcon = iconName && isIconRight ? Icon[iconName] : null;

  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
  const StartIcon = iconName && !isIconRight ? Icon[iconName] : null;

  const handleClick = () => {
    if (!isBuilder) {
      scriptEngine.execute(onClick);
    }
  };

  if (hidden) return null;

  switch (type) {
    case EButtonType.button.value:
      return (
        <Box sx={containerSx}>
          <MuiButton
            fullWidth={fullWidth}
            onClick={handleClick}
            variant="contained"
            disabled={disabled}
            loading={loading}
            color={color}
            endIcon={EndIcon ? <EndIcon /> : null}
            startIcon={StartIcon ? <StartIcon /> : null}
          >
            {label || EButtonType.button.label}
          </MuiButton>
        </Box>
      );

    case EButtonType.link.value:
      return (
        <Box sx={containerSx}>
          <Link href="#" underline="always">
            {label || EButtonType.link.label}
          </Link>
        </Box>
      );

    case EButtonType.group.value:
      return (
        <Box sx={containerSx}>
          <Group
            items={items}
            onClick={(item) => scriptEngine.execute(onClick, item)}
            color={color}
          />
        </Box>
      );

    default:
      return null;
  }
};

export default ButtonRenderer;
