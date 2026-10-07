import dayjs from 'dayjs';

const formatDateTime = (value, format) => {
  if (!value) return null;
  return dayjs(value).format(format);
};

export default formatDateTime;
