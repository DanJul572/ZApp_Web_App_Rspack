import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';

import CComponentGroupType from '@/constant/CComponentGroupType';
import CTheme from '@/constant/CTheme';
import CVisualElement from '@/constant/CVisualElementType';

const TextDecoration = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const theme = useTheme();
  const fontColor = theme.palette.text.secondary;
  const primaryColor = theme.palette.primary.main;

  const [decoration, setDecoration] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const items = ['bold', 'italic', 'underline'];

  const onApply = (param) => {
    const newDecoration = {
      bold: decoration.bold,
      italic: decoration.italic,
      underline: decoration.underline,
    };
    newDecoration[param] = !newDecoration[param];

    const newContent = editComponentranslator(
      'textDecoration',
      newDecoration,
      content,
    );

    setContent([...newContent]);
    setDecoration(newDecoration);
  };

  const isActive = (param) => {
    return Boolean(decoration[param]);
  };

  const icon = (value) => {
    if (value === 'bold') {
      return (
        <FormatBold
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    }
    if (value === 'italic') {
      return (
        <FormatItalic
          sx={{
            fontSize: 15,
            color: isActive(value) ? primaryColor : fontColor,
          }}
        />
      );
    }
    return (
      <FormatUnderlined
        sx={{
          fontSize: 15,
          color: isActive(value) ? primaryColor : fontColor,
        }}
      />
    );
  };

  const element = (decoration, index) => {
    return (
      <Box
        key={index}
        border={CTheme.border.size.value}
        borderRadius={1}
        borderColor={isActive(decoration) ? primaryColor : fontColor}
        width={25}
        height={25}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ cursor: 'pointer' }}
        onClick={() => onApply(decoration)}
      >
        {icon(decoration)}
      </Box>
    );
  };

  const validComponent = () => {
    if (!selected) return false;

    const type = selected.type.value;
    const group = selected.group.value;

    if (
      type === CVisualElement.text.value &&
      group === CComponentGroupType.visualElement.value
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (selected) {
      const emptyValue = { bold: false, italic: false, underline: false };
      setDecoration(selected.properties.textDecoration || emptyValue);
    }
  }, [selected]);

  return (
    validComponent() && (
      <Box paddingX={2}>
        <Box
          marginTop={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {items.map(element)}
        </Box>
      </Box>
    )
  );
};

export default TextDecoration;
