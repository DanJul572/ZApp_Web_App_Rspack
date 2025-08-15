import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import MuiButton from '@/aliases/MuiButton';

import Group from '@/components/button/Group';

import * as Icon from '@/components/icons';
import CTheme from '@/configs/CTheme';
import EButtonType from '@/enums/EButtonType';

import Waiter from '@/interpreter/waiter';

const Button = (props) => {
  const { type, properties, isBuilder } = props;

  const waiter = Waiter({ isBuilder });

  const displayValue = (type) => {
    return properties.display?.[type]
      ? properties.display[type].value
      : 'flex-start';
  };

  const disable = Boolean(waiter.take(properties.disable));
  const fullWidth = Boolean(waiter.take(properties.fullWidth));
  const hidden = Boolean(waiter.take(properties.hidden));

  const items = waiter.take(properties.items);
  const label = waiter.take(properties.label);

  const color = properties.color ? properties.color.name : 'primary';
  const display = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: displayValue('horizontal'),
  };
  const onClick = properties.onClick;

  const iconName = properties.icon?.name;
  const iconIsRight = properties.icon?.isRight;

  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
  const EndIcon = iconName && iconIsRight ? Icon[iconName] : null;

  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
  const StartIcon = iconName && !iconIsRight ? Icon[iconName] : null;

  const click = () => {
    if (!isBuilder) {
      waiter.order(onClick);
    }
  };

  const content = () => {
    if (!hidden) {
      if (type === EButtonType.button.value) {
        return (
          <Box sx={display}>
            <MuiButton
              fullWidth={fullWidth}
              onClick={click}
              size={CTheme.button.size.name}
              variant="contained"
              disabled={Boolean(disable)}
              color={color}
              endIcon={EndIcon ? <EndIcon /> : null}
              startIcon={StartIcon ? <StartIcon /> : null}
            >
              {label || EButtonType.button.label}
            </MuiButton>
          </Box>
        );
      }

      if (type === EButtonType.link.value) {
        return (
          <Box sx={display}>
            <Link href="#" underline="always">
              {label || EButtonType.link.label}
            </Link>
          </Box>
        );
      }

      if (type === EButtonType.group.value) {
        return (
          <Box sx={display}>
            <Group
              items={items}
              onClick={(item) => waiter.order(onClick, item)}
              color={color}
            />
          </Box>
        );
      }
    }
  };

  return content();
};

export default Button;
