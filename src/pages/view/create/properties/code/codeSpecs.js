import EActionType from '@/enums/EActionType';
import EButtonType from '@/enums/EButtonType';
import EChartType from '@/enums/EChartType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';
import EScriptKind from '@/enums/EScriptKind';

/**
 * Panduan editor kode per property: jenis kode, penjelasan singkat,
 * variabel `param` yang tersedia, dan template siap pakai.
 *
 * Bentuk spec:
 * - kind      → nilai EScriptKind (expression / action)
 * - hint      → penjelasan nilai yang diharapkan
 * - params    → isi `param` saat kode dijalankan [{ code, description }]
 * - templates → [{ title, description, code }]
 */

const expression = EScriptKind.expression.value;
const action = EScriptKind.action.value;

const booleanHint = 'Return true or false.';

const textSpec = {
  kind: expression,
  hint: "Text to display. Plain text must be in quotes, e.g. 'Save'.",
  params: [],
  templates: [
    {
      title: 'Plain text',
      description: 'Fixed text',
      code: "'Save'",
    },
    {
      title: 'Translated text',
      description: 'Uses the key from the language files',
      code: "zcore.translator('save')",
    },
    {
      title: 'Text with a value',
      description: 'Combine text with a form field',
      // biome-ignore lint/suspicious/noTemplateCurlyInString: contoh kode user
      code: "`Hello, ${zcore.formData.get('name') || '-'}`",
    },
    {
      title: 'Depends on mode',
      description: 'Different text when editing (?id=...) or creating',
      code: "zcore.parameter.get('id') ? 'Update' : 'Create'",
    },
    {
      title: 'From a query',
      description: 'One field of the first row of a saved script',
      code: "zquery('scriptId', true, 'field')",
    },
  ],
};

const loopItemParam = {
  code: 'param',
  description: 'Current item when Loop is set (null otherwise)',
};

const textLoopSpec = {
  ...textSpec,
  hint: `${textSpec.hint} When Loop is set, this runs once per item.`,
  params: [loopItemParam],
  templates: [
    ...textSpec.templates,
    {
      title: 'Loop item field',
      description: 'Show a field of the current Loop item',
      code: "param?.name ?? ''",
    },
  ],
};

const chartLabelSpec = {
  kind: expression,
  hint: 'Array of labels for the X axis, same length as Value.',
  params: [],
  templates: [
    {
      title: 'Fixed labels',
      description: 'Write the labels directly',
      code: "['Jan', 'Feb', 'Mar']",
    },
    {
      title: 'From a query',
      description: 'Take one column of a saved script',
      code: "(zquery('scriptId') || []).map((row) => row.month)",
    },
  ],
};

const tabLabelSpec = {
  kind: expression,
  hint: 'Array of tab titles. Each title gets its own drop area.',
  params: [],
  templates: [
    {
      title: 'Fixed tabs',
      description: 'One string per tab',
      code: "['General', 'Detail']",
    },
    {
      title: 'Translated tabs',
      description: 'Use keys from the language files',
      code: "[zcore.translator('general'), zcore.translator('detail')]",
    },
  ],
};

const chartValueSpec = {
  kind: expression,
  hint: 'Array of numbers, one per label.',
  params: [],
  templates: [
    {
      title: 'Fixed values',
      description: 'Write the numbers directly',
      code: '[10, 20, 30]',
    },
    {
      title: 'From a query',
      description: 'Take one numeric column of a saved script',
      code: "(zquery('scriptId') || []).map((row) => Number(row.total))",
    },
  ],
};

const pieValueSpec = {
  kind: expression,
  hint: 'Array of slices: { id, value, label }.',
  params: [],
  templates: [
    {
      title: 'Fixed slices',
      description: 'Write the slices directly',
      code: "[\n  { id: 0, value: 10, label: 'A' },\n  { id: 1, value: 20, label: 'B' },\n]",
    },
    {
      title: 'From a query',
      description: 'Map each row to a slice',
      code: "(zquery('scriptId') || []).map((row, index) => ({\n  id: index,\n  value: Number(row.total),\n  label: row.name,\n}))",
    },
  ],
};

const gaugeValueSpec = {
  kind: expression,
  hint: 'One number between 0 and 100.',
  params: [],
  templates: [
    {
      title: 'Fixed value',
      description: 'Write the number directly',
      code: '75',
    },
    {
      title: 'From a query',
      description: 'One field of the first row of a saved script',
      code: "Number(zquery('scriptId', true, 'percentage') || 0)",
    },
  ],
};

const loopSpec = {
  kind: expression,
  hint: 'Array to repeat this text for. Each item is available as `param` in Label.',
  params: [],
  templates: [
    {
      title: 'From a query',
      description: 'One text per row of a saved script',
      code: "zquery('scriptId')",
    },
    {
      title: 'Fixed list',
      description: 'Write the items directly',
      code: "[{ name: 'First' }, { name: 'Second' }]",
    },
  ],
};

const filterSpec = {
  kind: expression,
  hint: 'Array of { id: field name, value }. Rows must match all filters.',
  params: [],
  templates: [
    {
      title: 'Fixed filter',
      description: 'Only rows with a given value',
      code: "[{ id: 'status', value: 'active' }]",
    },
    {
      title: 'From URL parameter',
      description: 'Detail table of the record in ?id=...',
      code: "[{ id: 'parentId', value: zcore.parameter.get('id') }]",
    },
    {
      title: 'From a form field',
      description: 'Filter by a value chosen on the page',
      code: "[{ id: 'category', value: zcore.formData.get('category') }]",
    },
  ],
};

const itemsSpec = {
  kind: expression,
  hint: 'Array of buttons: { label, value }. On Click receives the clicked item as `param`.',
  params: [],
  templates: [
    {
      title: 'Fixed buttons',
      description: 'Write the buttons directly',
      code: "[\n  { label: 'Approve', value: 'approve' },\n  { label: 'Reject', value: 'reject' },\n]",
    },
  ],
};

const attributeSpec = {
  kind: expression,
  hint: 'Array with one card: { title, value }.',
  params: [],
  templates: [
    {
      title: 'Fixed card',
      description: 'Write the title and value directly',
      code: "[{ title: 'Total Sales', value: 120 }]",
    },
    {
      title: 'From a query',
      description: 'Value from the first row of a saved script',
      code: "[{ title: 'Total Sales', value: zquery('scriptId', true, 'total') }]",
    },
  ],
};

const actionTemplates = {
  save: {
    title: 'Save form',
    description: 'Create or update (by ?id=...), then go to a page',
    code: "zbuilder.classicQuery.createOrUpdate('moduleId', 'id', '/page')",
  },
  saveCustom: {
    title: 'Save with custom handling',
    description: 'Insert, show a message, then go back',
    code: `zcore.loader.showLoading();
zbuilder.crud
  .create({ moduleId: 'moduleId', data: zcore.formData.getAll() })
  .then((res) => {
    zcore.toaster.showSuccessToast(res?.message);
    zcore.redirect.prev();
  })
  .catch((err) => zcore.alert.showErrorAlert(err?.message || err))
  .finally(() => zcore.loader.hideLoading());`,
  },
  goTo: {
    title: 'Go to a page',
    description: 'Open another page of this app',
    code: "zcore.redirect.internal('/page')",
  },
  back: {
    title: 'Go back',
    description: 'Return to the previous page',
    code: 'zcore.redirect.prev();',
  },
  openDrawer: {
    title: 'Open a drawer',
    description: "Set the drawer's Open to zcore.uiStore.get('drawerOpen')",
    code: "zcore.uiStore.set('drawerOpen', true);",
  },
  report: {
    title: 'Open a report',
    description: 'Render a jsreport template with data',
    code: "zreport.open('file-name', 'templateName', {\n  id: zcore.parameter.get('id'),\n});",
  },
  message: {
    title: 'Show a message',
    description: 'Toast that disappears by itself',
    code: "zcore.toaster.showSuccessToast('Done');",
  },
};

const actionHint =
  'Statements to run on click. Write as many lines as needed; nothing is returned.';

const buttonClickSpec = {
  kind: action,
  hint: actionHint,
  params: [],
  templates: [
    actionTemplates.save,
    actionTemplates.saveCustom,
    actionTemplates.goTo,
    actionTemplates.back,
    actionTemplates.openDrawer,
    actionTemplates.report,
    actionTemplates.message,
  ],
};

const buttonGroupClickSpec = {
  ...buttonClickSpec,
  params: [
    { code: 'param.value', description: 'Value of the clicked button' },
    { code: 'param.label', description: 'Label of the clicked button' },
  ],
  templates: [
    {
      title: 'Per button',
      description: 'Do something different for each button',
      code: `if (param.value === 'approve') {
  zcore.toaster.showSuccessToast('Approved');
} else if (param.value === 'reject') {
  zcore.toaster.showWarningToast('Rejected');
}`,
    },
    ...buttonClickSpec.templates,
  ],
};

const tableInsertSpec = {
  kind: action,
  hint: 'Runs when the Insert button of the table is clicked.',
  params: [],
  templates: [
    {
      title: 'Open the form page',
      description: 'Go to the page that creates a new row',
      code: "zcore.redirect.internal('/form-page')",
    },
    actionTemplates.openDrawer,
  ],
};

const tableUpdateSpec = {
  kind: action,
  hint: 'Runs when the Update button of a row is clicked.',
  params: [
    { code: 'param.row', description: 'The clicked row' },
    { code: 'param.row.id', description: 'A field of the clicked row' },
  ],
  templates: [
    {
      title: 'Open the form page with this row',
      description: 'The form page can load it with findOneAndSet',
      // biome-ignore lint/suspicious/noTemplateCurlyInString: contoh kode user
      code: 'zcore.redirect.internal(`/form-page?id=${param.row.id}`)',
    },
    {
      title: 'Edit in a drawer',
      description: 'Put the row into the form and open a drawer',
      code: "zcore.formData.setAll(param.row);\nzcore.uiStore.set('drawerOpen', true);",
    },
  ],
};

const onLoadSpec = {
  kind: action,
  hint: 'Statements to run once when the page opens.',
  params: [],
  templates: [
    {
      title: 'Load row into the form',
      description: 'For edit pages opened with ?id=...',
      code: "zbuilder.classicQuery.findOneAndSet('moduleId', 'id');",
    },
    {
      title: 'Default form value',
      description: 'Pre-fill a field on a create page',
      code: "if (!zcore.parameter.get('id')) {\n  zcore.formData.set('status', 'draft');\n}",
    },
    {
      title: 'Reset page state',
      description: 'Start with an empty form and UI store',
      code: 'zcore.formData.removeAll();\nzcore.uiStore.removeAll();',
    },
  ],
};

const uiStoreToggleTemplate = (key) => ({
  title: 'From the UI store',
  description: `Controlled by another component via zcore.uiStore.set('${key}', true)`,
  code: `zcore.uiStore.get('${key}') === true`,
});

const toggleTemplates = {
  hidden: [
    {
      title: 'Hide on create',
      description: 'Only show when editing (?id=...)',
      code: "!zcore.parameter.get('id')",
    },
    {
      title: 'Hide by field value',
      description: 'Show only when a field has a given value',
      code: "zcore.formData.get('status') !== 'active'",
    },
    uiStoreToggleTemplate('hidden'),
  ],
  disable: [
    {
      title: 'Disable on edit',
      description: 'Lock the field once the row exists',
      code: "Boolean(zcore.parameter.get('id'))",
    },
    {
      title: 'Disable until filled',
      description: 'Wait until another field has a value',
      code: "!zcore.formData.get('fieldName')",
    },
    uiStoreToggleTemplate('disable'),
  ],
  loading: [
    {
      title: 'While a report renders',
      description: 'Use with zreport.open / download',
      code: 'zreport.loading',
    },
    uiStoreToggleTemplate('loading'),
  ],
  // Pasangan template "Open a drawer" di On Click
  open: [uiStoreToggleTemplate('drawerOpen')],
};

const toggleSpec = (name) => ({
  kind: expression,
  hint: booleanHint,
  params: [],
  templates: toggleTemplates[name] || [uiStoreToggleTemplate(name)],
});

const fallbackSpec = (kind = expression) => ({
  kind,
  hint: kind === expression ? 'Write a single value.' : actionHint,
  params: [],
  templates: [],
});

const labelSpec = (group, type) => {
  if (group === EComponentGroupType.chart.value) return chartLabelSpec;
  if (
    group === EComponentGroupType.container.value &&
    type === EContainerType.tab.value
  ) {
    return tabLabelSpec;
  }
  if (group === EComponentGroupType.visualElement.value) return textLoopSpec;
  return textSpec;
};

const valueSpec = (type) => {
  if (type === EChartType.pie.value) return pieValueSpec;
  if (type === EChartType.gauge.value) return gaugeValueSpec;
  return chartValueSpec;
};

const onClickSpec = (group, type, actionType) => {
  if (group === EComponentGroupType.table.value) {
    return actionType === EActionType.update.value
      ? tableUpdateSpec
      : tableInsertSpec;
  }
  if (type === EButtonType.group.value) return buttonGroupClickSpec;
  return buttonClickSpec;
};

/**
 * Ambil spec untuk property `name` pada komponen dengan `group` & `type`.
 * `actionType` hanya untuk aksi tabel (EActionType).
 */
const getCodeSpec = (name, { group, type, actionType } = {}) => {
  switch (name) {
    case 'label':
      return labelSpec(group, type);
    case 'value':
      return valueSpec(type);
    case 'loop':
      return loopSpec;
    case 'filter':
      return filterSpec;
    case 'items':
      return itemsSpec;
    case 'attribute':
      return attributeSpec;
    case 'onClick':
      return onClickSpec(group, type, actionType);
    case 'onLoad':
      return onLoadSpec;
    case 'disable':
    case 'loading':
    case 'hidden':
    case 'open':
    case 'multiple':
    case 'fullWidth':
      return toggleSpec(name);
    default:
      return fallbackSpec();
  }
};

export default getCodeSpec;
