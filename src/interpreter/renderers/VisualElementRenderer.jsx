import { useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import EVisualElementType from '@/enums/EVisualElementType';
import Translator from '@/hooks/Translator';
import LoopList from '../layout/LoopList';
import ScriptEngine from '../script/ScriptEngine';

const renderText = (text, key = null) => {
  return (
    <Typography
      sx={{
        fontSize: text.size ? text.size : 'inherit',
        color: text.color,
        fontStyle: text.italic,
        fontWeight: text.bold,
        textDecoration: text.underline,
      }}
      key={key}
    >
      {text.label}
    </Typography>
  );
};

const VisualElementRenderer = (props) => {
  const { type, properties, isBuilder } = props;

  const scriptEngine = ScriptEngine({ isBuilder });
  const translator = Translator();
  const theme = useTheme();

  const label = scriptEngine.evaluate(properties.label);
  const loop = scriptEngine.evaluate(properties.loop);
  const color = properties.color
    ? properties.color.value
    : theme.palette.text.primary;
  const size = Number.parseInt(properties.size, 10);
  const bold = properties.textDecoration?.bold ? 'bold' : 'normal';
  const italic = properties.textDecoration?.italic ? 'italic' : 'normal';
  const underline = properties.textDecoration?.underline ? 'underline' : 'none';

  if (type === EVisualElementType.divider.value) {
    return <Divider sx={{ backgroundColor: color }} />;
  }

  if (type === EVisualElementType.text.value) {
    const textStyle = { bold, color, italic, size, underline };

    if (loop && Array.isArray(loop)) {
      if (isBuilder) {
        return <Typography>{translator('empty_content')}</Typography>;
      }
      return (
        <LoopList
          items={loop}
          render={(item, index) =>
            renderText(
              {
                ...textStyle,
                label: scriptEngine.evaluate(properties.label, item),
              },
              index,
            )
          }
        />
      );
    }

    return renderText({ ...textStyle, label });
  }

  return null;
};

export default VisualElementRenderer;
