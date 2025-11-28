import { useTheme } from '@mui/material';
import LeftBorderCard from '@/components/custom/LeftBorderCard';
import * as Icon from '@/configs/CIcons';
import ECustomType from '@/enums/ECustomType';
import Waiter from '../waiter';

const Custom = (props) => {
  const { type, properties, isBuilder } = props;

  const theme = useTheme();

  const waiter = Waiter({ isBuilder });

  const iconName = properties.icon?.name;

  const attribute = waiter.take(properties.attribute);
  const color = properties.color
    ? properties.color.value
    : theme.palette.primary.main;
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: dynamic import needed here
  const EndIcon = iconName ? Icon[iconName] : null;

  if (type === ECustomType.leftBorderCard.value) {
    return (
      <LeftBorderCard
        color={color}
        title={attribute?.[0]?.title}
        value={attribute?.[0]?.value}
        icon={EndIcon ? <EndIcon /> : null}
      />
    );
  }
};

export default Custom;
