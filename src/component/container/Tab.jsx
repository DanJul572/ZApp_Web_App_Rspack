import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import MuiTab from '@/alias/MuiTab';

import CTheme from '@/constant/CTheme';

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Tab = (props) => {
  const { label, items, render } = props;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const component = (item, index) => {
    return <MuiTab key={index} label={item} {...a11yProps(index)} />;
  };

  const header = () => {
    if (Array.isArray(label)) {
      return (
        <Box
          sx={{
            borderBottom: CTheme.border.size.value,
            borderColor: 'divider',
          }}
        >
          <Tabs value={value} onChange={handleChange}>
            {label && label.length > 0 && label.map(component)}
          </Tabs>
        </Box>
      );
    }
    return (
      <Typography fontSize={CTheme.font.size.value}>
        Label is not valid.
      </Typography>
    );
  };

  const content = () => {
    if (items && items.length > 0) {
      return items.map((item, index) => (
        <CustomTabPanel key={uuidv4()} value={value} index={index}>
          {render(item, index)}
        </CustomTabPanel>
      ));
    }
  };

  return (
    <Box>
      {header()}
      <Box padding={1}>{content()}</Box>
    </Box>
  );
};

export default Tab;
