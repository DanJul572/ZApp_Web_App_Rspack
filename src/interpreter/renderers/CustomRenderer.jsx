import { useTheme } from '@mui/material';
import LeftBorderCard from '@/components/custom/LeftBorderCard';
import DynamicIcon from '@/components/dynamicIcon';
import ECustomType from '@/enums/ECustomType';
import ScriptEngine from '../script/ScriptEngine';

const CustomRenderer = (props) => {
  const { type, properties, isBuilder } = props;

  const theme = useTheme();

  const scriptEngine = ScriptEngine({ isBuilder });

  const iconName = properties.icon?.name;

  const attribute = scriptEngine.evaluate(properties.attribute);
  const color = properties.color
    ? properties.color.value
    : theme.palette.primary.main;

  if (type === ECustomType.leftBorderCard.value) {
    return (
      <LeftBorderCard
        color={color}
        title={attribute?.[0]?.title}
        value={attribute?.[0]?.value}
        icon={iconName ? <DynamicIcon name={iconName} /> : null}
      />
    );
  }

  return null;
};

export default CustomRenderer;
