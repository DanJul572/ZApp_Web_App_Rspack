import Bar from '@/component/chart/Bar';
import Gauge from '@/component/chart/Gaude';
import Line from '@/component/chart/Line';
import Pie from '@/component/chart/Pie';

import CChartType from '@/constant/CChartType';

import Runner from '@/runner';

const Chart = (props) => {
  const { type, properties, isBuilder } = props;

  const { getValues } = Runner({ isBuilder });

  const label = getValues(properties.label);
  const value = getValues(properties.value);

  const content = () => {
    if (type === CChartType.bar.value) {
      return <Bar labels={label} values={value} />;
    }

    if (type === CChartType.line.value) {
      return <Line labels={label} values={value} />;
    }

    if (type === CChartType.pie.value) {
      return <Pie values={value} />;
    }

    if (type === CChartType.gauge.value) {
      return <Gauge value={value} />;
    }
  };

  return content();
};

export default Chart;
