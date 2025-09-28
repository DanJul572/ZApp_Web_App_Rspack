import dayjs from 'dayjs';
import CDateTimeFormat from '@/configs/CDateTimeFormat';
import EInputType from '@/enums/EInputType';
import isValidValue from './isValidValue';

const dataDisplay = (type, value) => {
  if (type === EInputType.code.value) return isValidValue(value) ? 'Code' : '';

  if (type === EInputType.date.value)
    return isValidValue(value)
      ? dayjs(value).format(CDateTimeFormat.date.display)
      : '';

  if (type === EInputType.datetime.value)
    return isValidValue(value)
      ? dayjs(value).format(CDateTimeFormat.datetime.display)
      : '';

  if (type === EInputType.richText.value)
    return isValidValue(value) ? 'HTML' : '';

  if (type === EInputType.time.value)
    return isValidValue(value)
      ? dayjs(value).format(CDateTimeFormat.time.display)
      : '';

  if (type === EInputType.toggle.value)
    return isValidValue(value) ? 'Yes' : 'No';

  if (type === EInputType.number.value)
    return isValidValue(value)
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '';

  return value;
};

export default dataDisplay;
