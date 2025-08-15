import EButtonType from './EButtonType';
import EChartType from './EChartType';
import EComponentGroupType from './EComponentGroupType';
import EContainerType from './EContainerType';
import EInputType from './EInputType';
import ETableType from './ETableType';
import CVisualElement from './EVisualElementType';

const EValidProperty = {
  border: {
    [EComponentGroupType.container.value]: [EContainerType.card.value],
  },
  padding: {
    [EComponentGroupType.container.value]: [EContainerType.card.value],
  },
  moduleID: {
    [EComponentGroupType.table.value]: [ETableType.table.value],
  },
  filter: {
    [EComponentGroupType.table.value]: [ETableType.table.value],
  },
  name: {
    [EComponentGroupType.fieldControl.value]: true,
  },
  size: {
    [EComponentGroupType.container.value]: [
      EContainerType.grid.value,
      EContainerType.drawer.value,
    ],
    [EComponentGroupType.visualElement.value]: [CVisualElement.text.value],
  },
  viewID: {
    [EComponentGroupType.container.value]: [EContainerType.view.value],
  },
  fieldID: {
    [EComponentGroupType.fieldControl.value]: [EInputType.dropdown.value],
  },
  label: {
    [EComponentGroupType.button.value]: [
      EButtonType.button.value,
      EButtonType.link.value,
    ],
    [EComponentGroupType.chart.value]: [
      EChartType.bar.value,
      EChartType.line.value,
    ],
    [EComponentGroupType.container.value]: [
      EContainerType.collapse.value,
      EContainerType.tab.value,
    ],
    [EComponentGroupType.fieldControl.value]: true,
    [EComponentGroupType.visualElement.value]: [CVisualElement.text.value],
  },
  value: {
    [EComponentGroupType.chart.value]: true,
  },
  onClick: {
    [EComponentGroupType.button.value]: true,
  },
  disable: {
    [EComponentGroupType.button.value]: true,
    [EComponentGroupType.fieldControl.value]: true,
  },
  open: {
    [EComponentGroupType.container.value]: [EContainerType.drawer.value],
  },
  hidden: {
    [EComponentGroupType.button.value]: true,
    [EComponentGroupType.fieldControl.value]: true,
  },
  loop: {
    [EComponentGroupType.visualElement.value]: [CVisualElement.text.value],
  },
  items: {
    [EComponentGroupType.button.value]: [EButtonType.group.value],
  },
  fullWidth: {
    [EComponentGroupType.button.value]: [EButtonType.button.value],
  },
};

export default EValidProperty;
