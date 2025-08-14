import Bar from '@/components/chart/Bar';
import Gauge from '@/components/chart/Gaude';
import Line from '@/components/chart/Line';
import Pie from '@/components/chart/Pie';

import EChartType from '@/enums/EChartType';

import Waiter from '@/interpreter/waiter';

const Chart = (props) => {
  const { type, properties, isBuilder } = props;

  const waiter = Waiter({ isBuilder });

  const label = waiter.take(properties.label);
  const value = waiter.take(properties.value);

  const content = () => {
    if (type === EChartType.bar.value) {
      return <Bar labels={label} values={value} />;
    }

    if (type === EChartType.line.value) {
      return <Line labels={label} values={value} />;
    }

    if (type === EChartType.pie.value) {
      return <Pie values={value} />;
    }

    if (type === EChartType.gauge.value) {
      return <Gauge value={value} />;
    }
  };

  return content();
};

export default Chart;
