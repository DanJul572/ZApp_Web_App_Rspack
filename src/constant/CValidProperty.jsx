import CButtonType from './CButtonType';
import CChartType from './CChartType';
import CComponentGroupType from './CComponentGroupType';
import CContainerType from './CContainerType';
import CInputType from './CInputType';
import CTableType from './CTableType';
import CVisualElement from './CVisualElementType';

const CValidProperty = {
  border: {
    [CComponentGroupType.container.value]: [CContainerType.card.value],
  },
  padding: {
    [CComponentGroupType.container.value]: [CContainerType.card.value],
  },
  moduleID: {
    [CComponentGroupType.table.value]: [CTableType.table.value],
  },
  filter: {
    [CComponentGroupType.table.value]: [CTableType.table.value],
  },
  name: {
    [CComponentGroupType.fieldControl.value]: true,
  },
  size: {
    [CComponentGroupType.container.value]: [
      CContainerType.grid.value,
      CContainerType.drawer.value,
    ],
    [CComponentGroupType.visualElement.value]: [CVisualElement.text.value],
  },
  viewID: {
    [CComponentGroupType.container.value]: [CContainerType.view.value],
  },
  fieldID: {
    [CComponentGroupType.fieldControl.value]: [CInputType.dropdown.value],
  },
  label: {
    [CComponentGroupType.button.value]: [
      CButtonType.button.value,
      CButtonType.link.value,
    ],
    [CComponentGroupType.chart.value]: [
      CChartType.bar.value,
      CChartType.line.value,
    ],
    [CComponentGroupType.container.value]: [
      CContainerType.collapse.value,
      CContainerType.tab.value,
    ],
    [CComponentGroupType.fieldControl.value]: true,
    [CComponentGroupType.visualElement.value]: [CVisualElement.text.value],
  },
  value: {
    [CComponentGroupType.chart.value]: true,
  },
  onClick: {
    [CComponentGroupType.button.value]: true,
  },
  disable: {
    [CComponentGroupType.button.value]: true,
    [CComponentGroupType.fieldControl.value]: true,
  },
  open: {
    [CComponentGroupType.container.value]: [CContainerType.drawer.value],
  },
  hidden: {
    [CComponentGroupType.button.value]: true,
    [CComponentGroupType.fieldControl.value]: true,
  },
  loop: {
    [CComponentGroupType.visualElement.value]: [CVisualElement.text.value],
  },
  items: {
    [CComponentGroupType.button.value]: [CButtonType.group.value],
  },
  fullWidth: {
    [CComponentGroupType.button.value]: [CButtonType.button.value],
  },
};

export default CValidProperty;
