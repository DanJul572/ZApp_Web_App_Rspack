import AlignHorizontalCenter from '@mui/icons-material/AlignHorizontalCenter';
import AlignHorizontalLeft from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRight from '@mui/icons-material/AlignHorizontalRight';
import { useEffect, useState } from 'react';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';
import { OptionButtons, PropertyRow } from '../common/PropertyUI';

// Nilai yang disimpan ke properties.display tetap { name, value, type }
const horizontal = [
  { name: 'left', value: 'flex-start', type: 'horizontal' },
  { name: 'horizontalCenter', value: 'center', type: 'horizontal' },
  { name: 'right', value: 'flex-end', type: 'horizontal' },
];

const options = [
  { key: 'left', label: 'Left', icon: <AlignHorizontalLeft /> },
  { key: 'horizontalCenter', label: 'Center', icon: <AlignHorizontalCenter /> },
  { key: 'right', label: 'Right', icon: <AlignHorizontalRight /> },
];

const Display = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [display, setDisplay] = useState({
    vertical: null,
  });

  const onApply = (option) => {
    const value = horizontal.find((item) => item.name === option.key);
    const newDisplay = {
      horizontal: display.horizontal,
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

  const isActive = (option) => display?.horizontal?.name === option.key;

  useEffect(() => {
    if (selected) {
      const emptyValue = {
        vertical: null,
      };
      setDisplay(selected.properties.display || emptyValue);
    }
  }, [selected]);

  return (
    validComponent() && (
      <PropertyRow label="Align">
        <OptionButtons
          options={options}
          isActive={isActive}
          onSelect={onApply}
        />
      </PropertyRow>
    )
  );
};

export default Display;
