import dayjs from 'dayjs';
import CDateTimeFormat from '@/constants/CDateTimeFormat';
import CInputType from '@/constants/CInputType';
import isValidValue from './isValidValue';

const dataDisplay = (type, value) => {
  if (type === CInputType.code.value) return isValidValue(value) ? 'Code' : '';

  if (type === CInputType.date.value)
    return isValidValue(value)
      ? dayjs(value).format(CDateTimeFormat.date.display)
      : '';

  if (type === CInputType.datetime.value)
    return isValidValue(value)
      ? dayjs(value).format(CDateTimeFormat.datetime.display)
      : '';

  if (type === CInputType.richText.value)
    return isValidValue(value) ? 'HTML' : '';

  if (type === CInputType.time.value)
    return isValidValue(value)
      ? dayjs(value).format(CDateTimeFormat.time.display)
      : '';

  if (type === CInputType.toggle.value)
    return isValidValue(value) ? 'Yes' : 'No';

  if (type === CInputType.number.value)
    return isValidValue(value)
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '';

  return value;
};

export default dataDisplay;
