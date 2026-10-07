import EScriptKind from '@/enums/EScriptKind';

/**
 * Katalog API publik yang bisa dipakai di script user (lihat ScriptEngine
 * dan folder context). Ditampilkan di tab "Reference" editor kode builder,
 * jadi perbarui file ini setiap kali menambah fungsi baru ke context.
 *
 * `kinds` menandai di mana fungsi boleh dipakai:
 * - expression → property yang dievaluasi saat render (Label, Hidden, ...)
 * - action     → script aksi (On Click, On Load)
 */

const EXPRESSION = [EScriptKind.expression.value];
const ACTION = [EScriptKind.action.value];
const BOTH = [EScriptKind.expression.value, EScriptKind.action.value];

const apiCatalog = [
  {
    group: 'Form',
    items: [
      {
        code: "zcore.formData.get('fieldName')",
        description: 'Value of a form field',
        kinds: BOTH,
      },
      {
        code: 'zcore.formData.getAll()',
        description: 'All form values as one object',
        kinds: BOTH,
      },
      {
        code: "zcore.formData.set('fieldName', value)",
        description: 'Set the value of a form field',
        kinds: ACTION,
      },
      {
        code: 'zcore.formData.setAll({ fieldName: value })',
        description: 'Replace all form values',
        kinds: ACTION,
      },
      {
        code: 'zcore.formData.removeAll()',
        description: 'Clear the form',
        kinds: ACTION,
      },
    ],
  },
  {
    group: 'URL Parameter',
    items: [
      {
        code: "zcore.parameter.get('id')",
        description: 'Query string value, e.g. ?id=10 → "10"',
        kinds: BOTH,
      },
    ],
  },
  {
    group: 'UI Store',
    items: [
      {
        code: "zcore.uiStore.get('key')",
        description: 'Read a value shared between components on the page',
        kinds: BOTH,
      },
      {
        code: "zcore.uiStore.set('key', value)",
        description: 'Store a value, e.g. to open a drawer',
        kinds: ACTION,
      },
      {
        code: 'zcore.uiStore.removeAll()',
        description: 'Clear the UI store',
        kinds: ACTION,
      },
    ],
  },
  {
    group: 'Data',
    items: [
      {
        code: "zquery('scriptId')",
        description: 'Run a saved script and return all rows (null in builder)',
        kinds: EXPRESSION,
      },
      {
        code: "zquery('scriptId', true, 'field')",
        description: 'One field of the first row, as text',
        kinds: EXPRESSION,
      },
      {
        code: "zbuilder.classicQuery.createOrUpdate('moduleId', 'id', '/page')",
        description:
          'Save the form: update if URL parameter "id" exists, otherwise create. Then go to /page (optional)',
        kinds: ACTION,
      },
      {
        code: "zbuilder.classicQuery.findOneAndSet('moduleId', 'id')",
        description: 'Load the row from URL parameter "id" into the form',
        kinds: ACTION,
      },
      {
        code: "zbuilder.crud.create({ moduleId: 'moduleId', data: zcore.formData.getAll() })",
        description: 'Insert a row. Returns a Promise',
        kinds: ACTION,
      },
      {
        code: "zbuilder.crud.update({ moduleId: 'moduleId', rowId: 1, data: zcore.formData.getAll() })",
        description: 'Update a row. Returns a Promise',
        kinds: ACTION,
      },
      {
        code: "zbuilder.crud.detail({ moduleId: 'moduleId', rowId: 1 })",
        description: 'Fetch one row. Returns a Promise',
        kinds: ACTION,
      },
    ],
  },
  {
    group: 'Navigation',
    items: [
      {
        code: "zcore.redirect.internal('/page')",
        description: 'Go to another page in this app',
        kinds: ACTION,
      },
      {
        code: 'zcore.redirect.prev()',
        description: 'Go back to the previous page',
        kinds: ACTION,
      },
      {
        code: "zcore.redirect.external('https://example.com')",
        description: 'Open an external URL in this tab',
        kinds: ACTION,
      },
      {
        code: "zcore.redirect.externalNewTab('https://example.com')",
        description: 'Open an external URL in a new tab',
        kinds: ACTION,
      },
    ],
  },
  {
    group: 'Feedback',
    items: [
      {
        code: "zcore.toaster.showSuccessToast('Saved')",
        description: 'Short message that disappears by itself',
        kinds: ACTION,
      },
      {
        code: "zcore.toaster.showErrorToast('Something went wrong')",
        description: 'Error toast',
        kinds: ACTION,
      },
      {
        code: "zcore.alert.showSuccessAlert('Saved')",
        description:
          'Alert banner. Also: showErrorAlert, showWarningAlert, showInfoAlert',
        kinds: ACTION,
      },
      {
        code: 'zcore.alert.hideAlert()',
        description: 'Close the alert banner',
        kinds: ACTION,
      },
      {
        code: 'zcore.loader.showLoading()',
        description: 'Show the full page loader',
        kinds: ACTION,
      },
      {
        code: 'zcore.loader.hideLoading()',
        description: 'Hide the full page loader',
        kinds: ACTION,
      },
    ],
  },
  {
    group: 'Report',
    items: [
      {
        code: "zreport.open('file-name', 'templateName', { id: 1 })",
        description: 'Render a jsreport template and open it in a new window',
        kinds: ACTION,
      },
      {
        code: "zreport.download('file-name', 'templateName', { id: 1 })",
        description: 'Render a jsreport template and download it',
        kinds: ACTION,
      },
      {
        code: 'zreport.loading',
        description: 'true while a report is being rendered',
        kinds: EXPRESSION,
      },
    ],
  },
  {
    group: 'Other',
    items: [
      {
        code: "zcore.translator('key')",
        description: 'Translated text from the language files',
        kinds: BOTH,
      },
      {
        code: 'console.log(value)',
        description: 'Print to the browser console for debugging',
        kinds: ACTION,
      },
    ],
  },
];

export default apiCatalog;
