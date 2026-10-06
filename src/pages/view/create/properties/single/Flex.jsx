import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';
import { PropertyRow } from '../common/PropertyUI';

const Flex = (props) => {
  const { content, selected, editComponent, setContent } = props;

  const [flex, setFlex] = useState(false);

  const onChange = (value) => {
    callChangeProperties(value);
  };

  const callChangeProperties = (val) => {
    const newContent = editComponent('flex', val, content);
    setContent([...newContent]);
  };

  const validComponent = () => {
    if (!selected) return false;

    const group = selected.group.value;
    const type = selected.type.value;

    if (
      group === EComponentGroupType.container.value &&
      type === EContainerType.card.value
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (selected) {
      const value = selected.properties.flex;
      setFlex(value);
    }
  }, [content, selected]);

  return (
    validComponent() && (
      <PropertyRow label="Flex">
        <Switch
          size="small"
          checked={Boolean(flex)}
          onChange={() => onChange(!flex)}
        />
      </PropertyRow>
    )
  );
};

export default Flex;
