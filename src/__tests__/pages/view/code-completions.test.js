import EActionType from '@/enums/EActionType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import getCodeSpec from '@/pages/view/create/properties/code/codeSpecs';
import { createCompletionSource } from '@/pages/view/create/properties/code/completions';

// Tiruan minimal CompletionContext CodeMirror; kursor di akhir `doc`
const complete = (spec, doc, explicit = false) => {
  const source = createCompletionSource(spec);
  return source({
    explicit,
    state: { sliceDoc: (from, to) => doc.slice(from, to) },
    matchBefore: (regex) => {
      const text = doc.match(new RegExp(`(?:${regex.source})$`))[0];
      return { from: doc.length - text.length, to: doc.length, text };
    },
  });
};

const labels = (result) => result.options.map((option) => option.label);

const tableUpdateSpec = getCodeSpec('onClick', {
  group: EComponentGroupType.table.value,
  actionType: EActionType.update.value,
});

describe('view builder code completions', () => {
  it('suggests top level variables for the property kind', () => {
    const expression = labels(complete(getCodeSpec('label'), 'z'));
    expect(expression).toEqual(
      expect.arrayContaining(['zcore', 'zquery', 'zreport']),
    );
    expect(expression).not.toContain('zbuilder');

    const action = labels(complete(getCodeSpec('onClick'), 'z'));
    expect(action).toEqual(expect.arrayContaining(['zcore', 'zbuilder']));
    expect(action).not.toContain('zquery');
  });

  it('suggests members after a dot and replaces only the last word', () => {
    const result = complete(getCodeSpec('onClick'), 'x = zcore.formData.se');
    expect(result.from).toBe('x = zcore.formData.'.length);
    expect(labels(result)).toEqual(
      expect.arrayContaining(['get', 'getAll', 'set', 'setAll', 'removeAll']),
    );

    const set = result.options.find((option) => option.label === 'set');
    expect(set.apply).toBe("set('fieldName', value)");
    expect(set.type).toBe('function');
  });

  it('hides members not allowed in expressions', () => {
    const result = complete(getCodeSpec('hidden'), 'zcore.formData.');
    expect(labels(result)).toEqual(['get', 'getAll']);
  });

  it('includes param only where the runtime passes one', () => {
    expect(labels(complete(tableUpdateSpec, 'par'))).toContain('param');
    expect(labels(complete(tableUpdateSpec, 'param.'))).toEqual(['row']);
    expect(labels(complete(getCodeSpec('onClick'), 'par'))).not.toContain(
      'param',
    );
  });

  it('ignores unknown chains and empty input', () => {
    expect(complete(getCodeSpec('onClick'), 'row.')).toBeNull();
    expect(complete(getCodeSpec('onClick'), 'foo().zcore.')).toBeNull();
    expect(complete(getCodeSpec('onClick'), 'a + ')).toBeNull();
    expect(labels(complete(getCodeSpec('onClick'), 'a + ', true))).toContain(
      'zcore',
    );
  });
});
