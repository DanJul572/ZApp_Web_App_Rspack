import EActionType from '@/enums/EActionType';
import EButtonType from '@/enums/EButtonType';
import EChartType from '@/enums/EChartType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EProperties from '@/enums/EProperties';
import EScriptKind from '@/enums/EScriptKind';
import apiCatalog from '@/interpreter/script/apiCatalog';
import { checkScript } from '@/interpreter/script/scriptSyntax';
import getCodeSpec from '@/pages/view/create/properties/code/codeSpecs';

const expression = EScriptKind.expression.value;
const action = EScriptKind.action.value;

const allSpecs = () => {
  const names = [
    ...EProperties.CCodeFormProperties,
    ...EProperties.CToggleCodeFormProperties,
  ].map((property) => property.name);
  const groups = Object.values(EComponentGroupType).map((g) => g.value);

  const specs = [getCodeSpec('onLoad')];
  for (const name of names) {
    for (const group of groups) {
      specs.push(getCodeSpec(name, { group }));
    }
  }
  specs.push(
    getCodeSpec('value', { type: EChartType.pie.value }),
    getCodeSpec('value', { type: EChartType.gauge.value }),
    getCodeSpec('onClick', { type: EButtonType.group.value }),
    getCodeSpec('onClick', {
      group: EComponentGroupType.table.value,
      actionType: EActionType.update.value,
    }),
  );
  return specs;
};

describe('view builder code check', () => {
  it('validates expressions the way ScriptEngine evaluates them', () => {
    expect(checkScript("'Save'", expression)).toBeNull();
    expect(checkScript("zcore.formData.get('name')", expression)).toBeNull();
    expect(checkScript("'Save", expression)).toEqual(expect.any(String));
    // Statement bukan expression
    expect(checkScript('if (true) {}', expression)).toEqual(expect.any(String));
  });

  it('validates action scripts as statements', () => {
    expect(checkScript('const a = 1;\nconsole.log(a);', action)).toBeNull();
    expect(checkScript('zcore.redirect.prev(', action)).toEqual(
      expect.any(String),
    );
    // Nama variabel sandbox tidak boleh dideklarasikan ulang
    expect(checkScript('let zcore = 1;', action)).toEqual(expect.any(String));
  });
});

describe('view builder code specs', () => {
  it('uses action kind only for click and load scripts', () => {
    expect(getCodeSpec('onClick').kind).toBe(action);
    expect(getCodeSpec('onLoad').kind).toBe(action);
    expect(getCodeSpec('label').kind).toBe(expression);
    expect(getCodeSpec('hidden').kind).toBe(expression);
  });

  it('exposes param only where the runtime passes one', () => {
    const tableUpdate = getCodeSpec('onClick', {
      group: EComponentGroupType.table.value,
      actionType: EActionType.update.value,
    });
    const tableInsert = getCodeSpec('onClick', {
      group: EComponentGroupType.table.value,
      actionType: EActionType.insert.value,
    });

    expect(tableUpdate.params.map((p) => p.code)).toContain('param.row');
    expect(tableInsert.params).toEqual([]);
    expect(getCodeSpec('onClick').params).toEqual([]);
  });

  it('only ships templates with valid syntax', () => {
    for (const spec of allSpecs()) {
      for (const template of spec.templates) {
        expect([template.title, checkScript(template.code, spec.kind)]).toEqual(
          [template.title, null],
        );
      }
    }
  });

  it('only lists catalog snippets with valid syntax', () => {
    for (const group of apiCatalog) {
      for (const item of group.items) {
        // Snippet katalog berisi placeholder `value`, cukup cek sebagai script
        expect([item.code, checkScript(item.code, action)]).toEqual([
          item.code,
          null,
        ]);
      }
    }
  });
});
