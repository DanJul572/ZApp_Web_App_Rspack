import CTheme from '@configs/CTheme';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import Translator from '@/hooks/Translator';

const Bar = (props) => {
  const { labels, values } = props;

  const translator = Translator();

  if (!labels || !labels.length || !values || !values.length) {
    return (
      <Container sx={{ padding: 0 }}>
        <Typography fontSize={CTheme.font.size.value} fontWeight="bold">
          {translator('empty_content')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 0 }}>
      <BarChart
        xAxis={[
          {
            data: labels,
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: values,
          },
        ]}
        height={250}
      />
    </Container>
  );
};

export default Bar;
