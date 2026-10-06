import BarChart from '@mui/icons-material/BarChart';
import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';
import SmartButton from '@mui/icons-material/SmartButton';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableChart from '@mui/icons-material/TableChart';
import TextFields from '@mui/icons-material/TextFields';
import EComponentGroupType from '@/enums/EComponentGroupType';

/** Ikon per group komponen, dipakai panel Component dan Properties. */
const groupIcon = (group) => {
  if (group === EComponentGroupType.button.value) {
    return <SmartButton />;
  }

  if (group === EComponentGroupType.container.value) {
    return <SpaceDashboard />;
  }

  if (group === EComponentGroupType.chart.value) {
    return <BarChart />;
  }

  if (group === EComponentGroupType.fieldControl.value) {
    return <ShortTextOutlined />;
  }

  if (group === EComponentGroupType.table.value) {
    return <TableChart />;
  }

  return <TextFields />;
};

export default groupIcon;
