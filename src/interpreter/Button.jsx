import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import MuiButton from '@/alias/MuiButton';

import Group from '@/component/button/Group';

import * as Icon from '@/component/icons';

import CButtonType from '@/constant/CButtonType';
import CTheme from '@/constant/CTheme';

import Runner from '@/runner';

const Button = (props) => {
  const { type, properties, isBuilder } = props;

  const { runFunction, getValues } = Runner({ isBuilder });

  const displayValue = (type) => {
    return properties.display?.[type]
      ? properties.display[type].value
      : 'flex-start';
  };

  const disable = Boolean(getValues(properties.disable));
  const fullWidth = Boolean(getValues(properties.fullWidth));
  const hidden = Boolean(getValues(properties.hidden));

  const items = getValues(properties.items);
  const label = getValues(properties.label);

  const color = properties.color ? properties.color.name : 'primary';
  const display = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: displayValue('horizontal'),
  };
  const onClick = properties.onClick;

  const iconName = properties.icon?.name;
  const iconIsRight = properties.icon?.isRight;
  const EndIcon = iconName && iconIsRight ? Icon[iconName] : null;
  const StartIcon = iconName && !iconIsRight ? Icon[iconName] : null;

  const click = () => {
    if (!isBuilder) {
      runFunction(onClick);
    }
  };

  const content = () => {
    if (!hidden) {
      if (type === CButtonType.button.value) {
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
              {label || CButtonType.button.label}
            </MuiButton>
          </Box>
        );
      }

      if (type === CButtonType.link.value) {
        return (
          <Box sx={display}>
            <Link href="#" underline="always">
              {label || CButtonType.link.label}
            </Link>
          </Box>
        );
      }

      if (type === CButtonType.group.value) {
        return (
          <Box sx={display}>
            <Group
              items={items}
              onClick={(item) => runFunction(onClick, item)}
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
