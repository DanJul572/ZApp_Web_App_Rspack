import { useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Translator from '@/hook/Translator';

import Runner from '@/runner';

import CTheme from '@/constant/CTheme';
import CVisualElement from '@/constant/CVisualElementType';

import MapLoop from './shared/MapLoop';

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

  const { getValues } = Runner({ isBuilder });
  const { t } = Translator();
  const theme = useTheme();

  const label = getValues(properties.label);
  const loop = getValues(properties.loop);
  const color = properties.color
    ? properties.color.value
    : theme.palette.text.primary;
  const size = Number.parseInt(properties.size) || CTheme.font.size.value;
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
              {t('empty_content')}
            </Typography>
          );
        }
        return (
          <MapLoop
            items={loop}
            render={(item, index) => {
              props.label = getValues(properties.label, item);
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
