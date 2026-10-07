import EScriptKind from '@/enums/EScriptKind';
import { checkSyntax } from './sandbox';

// Harus sama dengan key sandboxContext di ScriptEngine + `param`
const SCRIPT_VARIABLES = [
  'zcore',
  'zbuilder',
  'zquery',
  'zreport',
  'console',
  'param',
];

/** Bungkus expression user menjadi body fungsi sandbox. */
export const toExpressionScript = (code) => `return ${code}`;

/**
 * Cek sintaks kode user tanpa menjalankannya (dipakai editor builder).
 * `kind` adalah nilai EScriptKind. Mengembalikan pesan error, atau null.
 */
export const checkScript = (code, kind) => {
  const script =
    kind === EScriptKind.expression.value ? toExpressionScript(code) : code;
  return checkSyntax(script, SCRIPT_VARIABLES);
};
