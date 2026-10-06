import Bar from '@/components/chart/Bar';
import Gauge from '@/components/chart/Gaude';
import Line from '@/components/chart/Line';
import Pie from '@/components/chart/Pie';
import EChartType from '@/enums/EChartType';
import ScriptEngine from '../script/ScriptEngine';

const ChartRenderer = (props) => {
  const { type, properties, isBuilder } = props;

  const scriptEngine = ScriptEngine({ isBuilder });

  const labels = scriptEngine.evaluate(properties.label);
  const values = scriptEngine.evaluate(properties.value);

  switch (type) {
    case EChartType.bar.value:
      return <Bar labels={labels} values={values} />;

    case EChartType.line.value:
      return <Line labels={labels} values={values} />;

    case EChartType.pie.value:
      return <Pie values={values} />;

    case EChartType.gauge.value:
      return <Gauge value={values} />;

    default:
      return null;
  }
};

export default ChartRenderer;
