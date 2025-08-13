import CComponentGroupType from '@/constant/CComponentGroupType';

import Button from './Button';
import Chart from './Chart';
import Container from './Container';
import FieldControl from './FieldControl';
import Table from './Table';
import VisualElement from './VisualElement';
import Wraper from './Wrapper';

const GroupComponent = ({ component, selected, setSelected, isBuilder }) => {
  const id = component.id;
  const group = component.group.value;
  const type = component.type.value;
  const section = component.section;
  const properties = component.properties;

  const wrapperProps = {
    component,
    isBuilder,
    selected,
    setSelected,
  };

  const componentProps = {
    type,
    properties,
    isBuilder,
  };

  if (group === CComponentGroupType.container.value) {
    return (
      <Wraper key={id} {...wrapperProps}>
        <Container
          {...componentProps}
          section={section}
          selected={selected}
          setSelected={setSelected}
          isBuilder={isBuilder}
        />
      </Wraper>
    );
  }

  if (group === CComponentGroupType.fieldControl.value) {
    return (
      <Wraper key={id} {...wrapperProps}>
        <FieldControl {...componentProps} />
      </Wraper>
    );
  }

  if (group === CComponentGroupType.visualElement.value) {
    return (
      <Wraper key={id} {...wrapperProps}>
        <VisualElement {...componentProps} />
      </Wraper>
    );
  }

  if (group === CComponentGroupType.table.value) {
    return (
      <Wraper key={id} {...wrapperProps}>
        <Table {...componentProps} />
      </Wraper>
    );
  }

  if (group === CComponentGroupType.chart.value) {
    return (
      <Wraper key={id} {...wrapperProps}>
        <Chart {...componentProps} />
      </Wraper>
    );
  }

  if (group === CComponentGroupType.button.value) {
    return (
      <Wraper key={id} {...wrapperProps}>
        <Button {...componentProps} />
      </Wraper>
    );
  }
};

export default GroupComponent;
