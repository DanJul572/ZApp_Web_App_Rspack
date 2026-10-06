import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { useEffect, useState } from 'react';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';
import { OptionButtons, PropertyRow } from '../common/PropertyUI';

const anchors = [
  { key: 'left', label: 'Left', icon: <ArrowLeft /> },
  { key: 'top', label: 'Top', icon: <ArrowDropUp /> },
  { key: 'right', label: 'Right', icon: <ArrowRight /> },
  { key: 'bottom', label: 'Bottom', icon: <ArrowDropDown /> },
];

const Anchor = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [anchor, setAnchor] = useState(null);

  const onApply = (option) => {
    const newContent = editComponent('anchor', option.key, content);
    setContent([...newContent]);
    setAnchor(option.key);
  };

  const validComponent = () => {
    if (!selected) return false;

    const group = selected.group.value;
    const type = selected.type.value;

    if (
      group === EComponentGroupType.container.value &&
      type === EContainerType.drawer.value
    )
      return true;
    return false;
  };

  const isActive = (option) => anchor === option.key;

  useEffect(() => {
    if (selected) {
      setAnchor(selected.properties.anchor || null);
    }
  }, [selected]);

  return (
    validComponent() && (
      <PropertyRow label="Anchor">
        <OptionButtons
          options={anchors}
          isActive={isActive}
          onSelect={onApply}
        />
      </PropertyRow>
    )
  );
};

export default Anchor;
