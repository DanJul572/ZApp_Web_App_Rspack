import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';

import Translator from '@/hook/Translator';
import CTheme from '@/constant/CTheme';

const Pie = (props) => {
  const { values } = props;

  const translator = Translator();

  if (!values || !values.length) {
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
