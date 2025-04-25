import CComponentGroupType from '@/constant/CComponentGroupType';

import Button from './Button';
import Chart from './Chart';
import Container from './Container';
import FieldControl from './FieldControl';
import Table from './Table';
import VisualElement from './VisualElement';
import Wraper from './Wrapper';

import Page from './shared/Page';

const Interpreter = (props) => {
  const { isPreview, isBuilder, content, page, selected, setSelected } = props;

  const renderComponent = (component) => {
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
            renderComponent={renderComponent}
            section={section}
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

  return (
    <Page isBuilder={isBuilder} page={page} isPreview={isPreview}>
      {content && content.length > 0 && Array.isArray(content)
        ? content.map(renderComponent)
        : content}
    </Page>
  );
};

export default Interpreter;
