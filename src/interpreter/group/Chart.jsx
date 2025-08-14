import Bar from '@/component/chart/Bar';
import Gauge from '@/component/chart/Gaude';
import Line from '@/component/chart/Line';
import Pie from '@/component/chart/Pie';

import CChartType from '@/constant/CChartType';

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
