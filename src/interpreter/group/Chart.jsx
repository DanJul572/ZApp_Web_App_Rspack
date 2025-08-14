import Bar from '@/components/chart/Bar';
import Gauge from '@/components/chart/Gaude';
import Line from '@/components/chart/Line';
import Pie from '@/components/chart/Pie';

import CChartType from '@/constants/CChartType';

import Waiter from '@/interpreter/waiter';

const Chart = (props) => {
  const { type, properties, isBuilder } = props;

  const waiter = Waiter({ isBuilder });

  const label = waiter.take(properties.label);
  const value = waiter.take(properties.value);

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
