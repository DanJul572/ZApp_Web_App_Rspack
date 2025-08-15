import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import Toggle from '@/components/input/Toggle';

import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';

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
      <Box
        paddingX={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Toggle value={flex} label="Flex" onChange={onChange} />
      </Box>
    )
  );
};

export default Flex;
