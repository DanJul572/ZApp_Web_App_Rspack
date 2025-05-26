import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Request from '@/hook/Request';

import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';

const Dropdown = (props) => {
  const { label, onChange, options, value, disabled, id, multiple } = props;

  const { get } = Request();

  const [newValue, setNewValue] = useState(!multiple ? null : []);

  const getOptions = async () => {
    return await get(CApiUrl.common.options, { id: id }, false);
  };

  const { data: requestOptions } = useQuery({
    queryKey: ['dropdown-options', id],
    queryFn: getOptions,
    enabled: !!id && !options,
  });

  const finalOptions = options || requestOptions;

  const handleChange = (e, param) => {
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
    const values = value ? value.split('|') : [];
    return finalOptions.filter((option) =>
      values.includes(option.value.toString()),
    );
  };

  useEffect(() => {
    setNewValue(getNewValue());
  }, [value]);

  const renderInput = (params) => {
    return (
      <Box>
        <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
        <TextField {...params} />
      </Box>
    );
  };

  const renderOptions = (props, option) => {
    return (
      <List {...props} key={option.value}>
        {option.label}
      </List>
    );
  };

  return (
    <Box>
      <Autocomplete
        disabled={disabled}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        multiple={multiple}
        onChange={handleChange}
        options={finalOptions?.length ? finalOptions : []}
        renderInput={(params) => renderInput(params)}
        renderOption={(props, option) => renderOptions(props, option)}
        size={CTheme.field.size.name}
        value={newValue}
      />
    </Box>
  );
};

export default Dropdown;
