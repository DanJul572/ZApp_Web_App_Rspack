import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import { useEffect, useState } from 'react';
import EComponentGroupType from '@/enums/EComponentGroupType';
import CVisualElement from '@/enums/EVisualElementType';
import { OptionButtons, PropertyRow } from '../common/PropertyUI';

const items = [
  { key: 'bold', label: 'Bold', icon: <FormatBold /> },
  { key: 'italic', label: 'Italic', icon: <FormatItalic /> },
  { key: 'underline', label: 'Underline', icon: <FormatUnderlined /> },
];

const TextDecoration = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [decoration, setDecoration] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const onApply = (option) => {
    const newDecoration = {
      bold: decoration.bold,
      italic: decoration.italic,
      underline: decoration.underline,
    };
    newDecoration[option.key] = !newDecoration[option.key];

    const newContent = editComponent('textDecoration', newDecoration, content);

    setContent([...newContent]);
    setDecoration(newDecoration);
  };

  const isActive = (option) => Boolean(decoration[option.key]);

  const validComponent = () => {
    if (!selected) return false;

    const type = selected.type.value;
    const group = selected.group.value;

    if (
      type === CVisualElement.text.value &&
      group === EComponentGroupType.visualElement.value
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
      <PropertyRow label="Text">
        <OptionButtons options={items} isActive={isActive} onSelect={onApply} />
      </PropertyRow>
    )
  );
};

export default TextDecoration;
