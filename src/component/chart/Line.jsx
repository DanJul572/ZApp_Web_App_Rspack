import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { LineChart } from '@mui/x-charts/LineChart';

import Translator from '@/hook/Translator';

import CTheme from '@/constant/CTheme';

const Line = (props) => {
  const { labels, values } = props;

  const { t } = Translator();

  const renderChart = () => {
    if (!labels || !labels.length || !values || !values.length)
      return <Typography fontWeight="bold">{t('empty_content')}</Typography>;

    return (
      <LineChart
        xAxis={[{ data: labels }]}
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

export default Line;
