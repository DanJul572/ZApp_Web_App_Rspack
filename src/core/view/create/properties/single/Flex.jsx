import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import Toggle from '@/component/input/Toggle';

import CComponentGroupType from '@/constant/CComponentGroupType';
import CContainerType from '@/constant/CContainerType';

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
      group === CComponentGroupType.container.value &&
      type === CContainerType.card.value
    )
      return true;
    else return false;
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
