import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { BarChart } from '@mui/x-charts/BarChart';

import Translator from '@/hook/Translator';

import CTheme from '@/constant/CTheme';

const Bar = (props) => {
  const { labels, values } = props;

  const { t } = Translator();

  const renderChart = () => {
    if (!labels || !labels.length || !values || !values.length)
      return (
        <Typography fontSize={CTheme.font.size.value} fontWeight="bold">
          {t('empty_content')}
        </Typography>
      );

    return (
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
    );
  };

  return <Container sx={{ padding: 0 }}>{renderChart()}</Container>;
};

export default Bar;
