import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';

import CComponentGroupType from '@/constant/CComponentGroupType';
import CContainerType from '@/constant/CContainerType';
import CTheme from '@/constant/CTheme';

const Anchor = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const theme = useTheme();
  const fontColor = theme.palette.text.secondary;
  const primaryColor = theme.palette.primary.main;

  const [anchor, setAnchor] = useState(null);

  const anchors = ['left', 'top', 'right', 'bottom'];

  const onApply = (value) => {
    const newContent = editComponent('anchor', value, content);
    setContent([...newContent]);
    setAnchor(value);
  };

  const validComponent = () => {
    if (!selected) return false;

    const group = selected.group.value;
    const type = selected.type.value;

    if (
      group === CComponentGroupType.container.value &&
      type === CContainerType.drawer.value
    )
      return true;
    else return false;
  };

  const isActive = (value) => Boolean(anchor === value);

  const icon = (value) => {
    if (value === 'left') {
      return (
        <ArrowLeft
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    } else if (value === 'top') {
      return (
        <ArrowDropUp
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    } else if (value === 'right') {
      return (
        <ArrowRight
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    } else {
      return (
        <ArrowDropDown
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    }
  };

  const item = (anchor, index) => {
    return (
      <Box
        key={index}
        border={CTheme.border.size.value}
        borderRadius={1}
        borderColor={isActive(anchor) ? primaryColor : fontColor}
        width={25}
        height={25}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          cursor: 'pointer',
        }}
        onClick={() => onApply(anchor)}
      >
        {icon(anchor)}
      </Box>
    );
  };

  useEffect(() => {
    if (selected) {
      setAnchor(selected.properties.anchor || null);
    }
  }, [selected]);

  return (
    validComponent() && (
      <Box paddingX={2}>
        <Typography fontSize={CTheme.font.size.value}>Anchor</Typography>
        <Box
          marginTop={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {anchors.map(item)}
        </Box>
      </Box>
    )
  );
};

export default Anchor;
