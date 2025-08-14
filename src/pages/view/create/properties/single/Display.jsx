import AlignHorizontalCenter from '@mui/icons-material/AlignHorizontalCenter';
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRight from '@mui/icons-material/AlignHorizontalRight';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

/*
import AlignVerticalBottom from '@mui/icons-material/AlignVerticalBottom';
import AlignVerticalCenter from '@mui/icons-material/AlignVerticalCenter';
import AlignVerticalTop from '@mui/icons-material/AlignVerticalTop';
*/

import CTheme from '@/configs/CTheme';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';

const Display = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const theme = useTheme();
  const fontColor = theme.palette.text.secondary;
  const primaryColor = theme.palette.primary.main;

  const [display, setDisplay] = useState({
    vertical: null,
    // horizontal: null,
  });

  const horizontal = [
    { name: 'left', value: 'flex-start', type: 'horizontal' },
    { name: 'horizontalCenter', value: 'center', type: 'horizontal' },
    { name: 'right', value: 'flex-end', type: 'horizontal' },
  ];

  /*
    const vertical = [
        {
            name: 'top',
            value: 'flex-start',
            type: 'vertical',
        },
        {
            name: 'verticalCenter',
            value: 'center',
            type: 'vertical',
        },
        {
            name: 'bottom',
            value: 'flex-end',
            type: 'vertical',
        },
    ];
    */

  const onApply = (value) => {
    const newDisplay = {
      horizontal: display.horizontal,
      // vertical: display.vertical,
    };
    newDisplay[value.type] =
      newDisplay[value.type] && newDisplay[value.type].name === value.name
        ? null
        : value;
    const newContent = editComponent('display', newDisplay, content);
    setContent([...newContent]);
    setDisplay(newDisplay);
  };

  const validComponent = () => {
    if (!selected) return false;

    const group = selected.group.value;
    const type = selected.type.value;

    if (group === EComponentGroupType.button.value) return true;
    if (
      group === EComponentGroupType.container.value &&
      type === EContainerType.card.value
    )
      return true;
    return false;
  };

  const isActive = (value) =>
    Boolean(
      display
        ? display[value.type] && display[value.type].name === value.name
        : false,
    );

  const icon = (value) => {
    if (value.name === 'left')
      return (
        <AlignHorizontalLeft
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    if (value.name === 'horizontalCenter')
      return (
        <AlignHorizontalCenter
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );

    return (
      <AlignHorizontalRight
        sx={{
          fontSize: 15,
          color: isActive(value) ? primaryColor : fontColor,
        }}
      />
    );
    /*
        else if (value.name === 'top')
            return <AlignVerticalTop sx={{fontSize: 15, color: isActive(value) ? primaryColor : fontColor}} />;
        else if (value.name === 'verticalCenter')
            return <AlignVerticalCenter sx={{fontSize: 15, color: isActive(value) ? primaryColor : fontColor}} />;
        else return <AlignVerticalBottom sx={{fontSize: 15, color: isActive(value) ? primaryColor : fontColor}} />;
        */
  };

  const poisiton = (display, index) => {
    return (
      <Box
        key={index}
        border={CTheme.border.size.value}
        borderRadius={1}
        borderColor={isActive(display) ? primaryColor : fontColor}
        width={25}
        height={25}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ cursor: 'pointer' }}
        onClick={() => onApply(display)}
      >
        {icon(display)}
      </Box>
    );
  };

  useEffect(() => {
    if (selected) {
      const emptyValue = {
        vertical: null,
        // horizontal: null,
      };
      setDisplay(selected.properties.display || emptyValue);
    }
  }, [selected]);

  return (
    validComponent() && (
      <Box paddingX={2}>
        <Typography fontSize={CTheme.font.size.value}>Display</Typography>
        <Box
          marginTop={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {horizontal.map(poisiton)}
        </Box>
        {/*
                <Box marginTop={1} display="flex" justifyContent="space-between" alignItems="center">
                    {vertical.map(poisiton)}
                </Box>
            */}
      </Box>
    )
  );
};

export default Display;
