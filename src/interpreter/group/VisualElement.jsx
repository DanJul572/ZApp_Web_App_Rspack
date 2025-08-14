import { useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CTheme from '@/configs/CTheme';
import CVisualElement from '@/enums/EVisualElementType';
import Translator from '@/hooks/Translator';
import Waiter from '@/interpreter/waiter';

import MapLoop from './MapLoop';

const Text = (props, key = null) => {
  return (
    <Typography
      fontSize={props.size}
      key={key}
      sx={{
        color: props.color,
        fontStyle: props.italic,
        fontWeight: props.bold,
        textDecoration: props.underline,
      }}
    >
      {props.label}
    </Typography>
  );
};

const VisualElement = (props) => {
  const { type, properties, isBuilder } = props;

  const waiter = Waiter({ isBuilder });
  const translator = Translator();
  const theme = useTheme();

  const label = waiter.take(properties.label);
  const loop = waiter.take(properties.loop);
  const color = properties.color
    ? properties.color.value
    : theme.palette.text.primary;
  const size = Number.parseInt(properties.size, 10) || CTheme.font.size.value;
  const bold = properties.textDecoration?.bold ? 'bold' : 'normal';
  const italic = properties.textDecoration?.italic ? 'italic' : 'normal';
  const underline = properties.textDecoration?.underline ? 'underline' : 'none';

  const content = () => {
    if (type === CVisualElement.divider.value) {
      return <Divider sx={{ backgroundColor: color }} />;
    }

    if (type === CVisualElement.text.value) {
      const props = {
        bold,
        color,
        italic,
        size,
        underline,
      };
      if (loop && Array.isArray(loop)) {
        if (isBuilder) {
          return (
            <Typography fontSize={CTheme.font.size.value}>
              {translator('empty_content')}
            </Typography>
          );
        }
        return (
          <MapLoop
            items={loop}
            render={(item, index) => {
              props.label = waiter.take(properties.label, item);
              return Text(props, index);
            }}
          />
        );
      }
      props.label = label;
      return Text(props);
    }
  };

  return content();
};

export default VisualElement;
