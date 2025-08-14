import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import CTheme from '@/constantss/CTheme';
import Translator from '@/hooks/Translator';

const Line = (props) => {
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
      <LineChart
        xAxis={[{ data: labels }]}
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

export default Line;
