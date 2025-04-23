import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { PieChart } from '@mui/x-charts/PieChart';

import Translator from '@/hook/Translator';

import CTheme from '@/constant/CTheme';

const Pie = (props) => {
  const { values } = props;

  const { t } = Translator();

  const renderChart = () => {
    if (!values || !values.length)
      return (
        <Typography fontSize={CTheme.font.size.value} fontWeight="bold">
          {t('empty_content')}
        </Typography>
      );

    return (
      <PieChart
        series={[
          {
            data: values,
          },
        ]}
        height={250}
      />
    );
  };

  return <Container sx={{ padding: 0 }}>{renderChart()}</Container>;
};

export default Pie;
