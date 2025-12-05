import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CApiUrl from '@/configs/CApiUrl';
import Request from '@/hooks/Request';

const Dropdown = (props) => {
  const {
    label,
    onChange,
    options,
    value,
    disabled,
    id,
    multiple,
    placeholder,
  } = props;

  const { get } = Request();

  const [newValue, setNewValue] = useState(!multiple ? null : []);

  const getOptions = async () => {
    return await get(CApiUrl.common.options, { id: id }, false);
  };

  const { data: requestOptions, isLoading } = useQuery({
    queryKey: ['dropdown-options', id],
    queryFn: getOptions,
    enabled: !!id && !options,
    retry: 0,
  });

  const finalOptions = options || requestOptions;

  const handleChange = (_e, param) => {
    if (!multiple) {
      return onChange(param ? param.value : null);
    }
    const selectedValues = param.map((item) => item.value).join('|');
    return onChange(selectedValues);
  };

  const getNewValue = () => {
    if (!multiple) {
      return value
        ? finalOptions.find((option) => option.value === value)
        : null;
    }
    const values = value ? value.splitranslator('|') : [];
    return finalOptions.filter((option) =>
      values.includes(option.value.toString()),
    );
  };

  useEffect(() => {
    if (finalOptions) {
      setNewValue(getNewValue());
    }
  }, [value, finalOptions]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Autocomplete
        disabled={disabled || isLoading}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        multiple={multiple}
        onChange={handleChange}
        options={finalOptions?.length ? finalOptions : []}
        renderInput={(params) => (
          <Box>
            <Typography>{label}</Typography>
            <TextField placeholder={placeholder} {...params} />
          </Box>
        )}
        renderOption={(props, option) => (
          <List {...props} key={option.value}>
            {option.label}
          </List>
        )}
        value={newValue}
      />
    </Box>
  );
};

export default Dropdown;
