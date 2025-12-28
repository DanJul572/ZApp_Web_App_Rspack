import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MuiTab from '@/aliases/MuiTab';

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

const Header = (props) => {
  const { value, setValue, labels } = props;

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  if (!Array.isArray(labels)) {
    return <Typography>Label is not valid.</Typography>;
  }

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Tabs value={value} onChange={handleChange}>
        {labels.map((item, index) => {
          const { label, badge } = item;
          const hasBadge = Boolean(badge);
          const isDot = Boolean(badge?.dot);
          return (
            <MuiTab
              key={label}
              {...a11yProps(index)}
              label={
                hasBadge ? (
                  <Badge
                    color={badge.color || 'primary'}
                    variant={isDot ? 'dot' : 'standard'}
                    badgeContent={isDot ? null : badge.content}
                  >
                    {label}
                  </Badge>
                ) : (
                  label
                )
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

const Content = (props) => {
  const { items, value, render } = props;

  if (items && items.length > 0) {
    return items.map((item, index) => (
      <CustomTabPanel key={uuidv4()} value={value} index={index}>
        {render(item, index)}
      </CustomTabPanel>
    ));
  }
};

const Tab = (props) => {
  const { labels, items, render } = props;

  const [value, setValue] = useState(0);

  return (
    <Box>
      <Header value={value} setValue={setValue} labels={labels} />
      <Box padding={1}>
        <Content items={items} value={value} render={render} />
      </Box>
    </Box>
  );
};

export default Tab;
