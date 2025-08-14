import { gaugeClasses } from '@mui/x-charts/Gauge';

import MuiGauge from '@/aliaseses/MuiGauge';
import CTheme from '@/constantss/CTheme';

const Gauge = (props) => {
  const { value } = props;

  return (
    <MuiGauge
      value={value || 0}
      startAngle={-120}
      endAngle={120}
      sx={{
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: CTheme.font.size.value,
          transform: 'translate(0px, 0px)',
        },
      }}
      text={({ value, valueMax }) => `${value} / ${valueMax}`}
      height={250}
    />
  );
};

export default Gauge;
