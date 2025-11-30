import EComponentGroupType from '@/enums/EComponentGroupType';
import Wrapper from '../extra/Wrapper';
import Button from './Button';
import Chart from './Chart';
import Container from './Container';
import Custom from './Custom';
import FieldControl from './FieldControl';
import Table from './Table';
import VisualElement from './VisualElement';

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

  if (group === EComponentGroupType.container.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <Container
          {...componentProps}
          section={section}
          selected={selected}
          setSelected={setSelected}
          isBuilder={isBuilder}
        />
      </Wrapper>
    );
  }

  if (group === EComponentGroupType.fieldControl.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <FieldControl {...componentProps} />
      </Wrapper>
    );
  }

  if (group === EComponentGroupType.visualElement.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <VisualElement {...componentProps} />
      </Wrapper>
    );
  }

  if (group === EComponentGroupType.table.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <Table {...componentProps} />
      </Wrapper>
    );
  }

  if (group === EComponentGroupType.chart.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <Chart {...componentProps} />
      </Wrapper>
    );
  }

  if (group === EComponentGroupType.button.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <Button {...componentProps} />
      </Wrapper>
    );
  }

  if (group === EComponentGroupType.custom.value) {
    return (
      <Wrapper key={id} {...wrapperProps}>
        <Custom {...componentProps} />
      </Wrapper>
    );
  }
};

export default GroupComponent;
