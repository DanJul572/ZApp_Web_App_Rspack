import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import Translator from '@/hooks/Translator';

const Pie = (props) => {
  const { values } = props;

  const translator = Translator();

  if (!values || !values.length) {
    return (
      <Container sx={{ padding: 0 }}>
        <Typography fontWeight="bold">{translator('empty_content')}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 0 }}>
      <PieChart
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

export default Pie;
