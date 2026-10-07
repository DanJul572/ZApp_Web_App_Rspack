import PlayArrow from '@mui/icons-material/PlayArrow';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { lazy, Suspense, useRef, useState } from 'react';
import EScriptKind from '@/enums/EScriptKind';
import Translator from '@/hooks/Translator';
import ScriptEngine from '@/interpreter/script/ScriptEngine';
import { checkScript } from '@/interpreter/script/scriptSyntax';
import CodeHelpPanel from './CodeHelpPanel';

// CodeMirror cukup besar, jadi dimuat hanya saat editor kode pertama dibuka
const CodeMirrorEditor = lazy(() => import('./CodeMirrorEditor'));

const formatResult = (result) => {
  if (result === undefined) return 'undefined';
  try {
    return JSON.stringify(result, null, 2) ?? String(result);
  } catch {
    return String(result);
  }
};

// Penjelasan tambahan untuk error yang sering terjadi saat Test
const explainError = (error, code) => {
  if (error instanceof ReferenceError && /is not defined/.test(error.message)) {
    const name = error.message.split(' ')[0];
    return `If "${name}" is meant to be text, put it in quotes: '${name}'.`;
  }
  if (error instanceof TypeError && code.includes('param')) {
    return '`param` is empty during Test. It is only filled when the component runs.';
  }
  return null;
};

/**
 * Isi dialog. Dipisah dari Dialog agar hanya di-mount saat dialog terbuka:
 * draft kode selalu mulai dari nilai tersimpan, dan hook ScriptEngine tidak
 * dipanggil oleh setiap baris properti.
 */
const CodeDialogContent = (props) => {
  const { title, value, spec, onApply, onRemove, onClose } = props;

  const translator = Translator();
  const scriptEngine = ScriptEngine({ isBuilder: true });

  const editorRef = useRef(null);

  const [code, setCode] = useState(value || '');
  const [feedback, setFeedback] = useState(null);

  const isExpression = spec.kind === EScriptKind.expression.value;

  const changeCode = (newCode) => {
    setCode(newCode);
    setFeedback(null);
  };

  // Sisipkan di kursor; jika editor belum selesai dimuat, tambahkan di akhir
  const insertSnippet = (snippet) => {
    if (!editorRef.current?.insert(snippet)) changeCode(code + snippet);
  };

  // Expression hanya satu nilai jadi diganti; script aksi ditambahkan
  const applyTemplate = (template) => {
    const keepCode = !isExpression && code.trim();
    changeCode(
      keepCode ? `${code.trimEnd()}\n${template.code}` : template.code,
    );
    editorRef.current?.focus();
  };

  const getSyntaxError = () => {
    const syntaxError = checkScript(code, spec.kind);
    if (!syntaxError) return null;
    return { severity: 'error', title: 'Syntax error', detail: syntaxError };
  };

  const runCheck = () => {
    if (!code.trim()) {
      setFeedback({
        severity: 'info',
        title: 'Nothing to check',
        hint: 'Write some code or pick a template first.',
      });
      return;
    }

    const syntaxError = getSyntaxError();
    if (syntaxError) {
      setFeedback(syntaxError);
      return;
    }

    if (!isExpression) {
      setFeedback({
        severity: 'success',
        title: 'No syntax errors',
        hint: 'Action scripts are not run in the builder. Open the page to try it.',
      });
      return;
    }

    try {
      const result = scriptEngine.test(code);
      setFeedback({
        severity: 'success',
        title: 'Result',
        detail: formatResult(result),
        hint: code.includes('zquery')
          ? 'zquery always returns null in the builder.'
          : null,
      });
    } catch (error) {
      setFeedback({
        severity: 'error',
        title: error.name,
        detail: error.message,
        hint: explainError(error, code),
      });
    }
  };

  const apply = () => {
    if (!code.trim()) {
      onApply(null);
      return;
    }

    const syntaxError = getSyntaxError();
    if (syntaxError) {
      setFeedback({ ...syntaxError, hint: 'Fix it before applying.' });
      return;
    }

    onApply(code);
  };

  return (
    <>
      <DialogTitle sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        {title}
        <Chip
          label={
            isExpression
              ? EScriptKind.expression.label
              : EScriptKind.action.label
          }
          size="small"
          variant="outlined"
        />
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 300px' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {spec.hint}
            </Typography>
            <Suspense fallback={<Skeleton variant="rounded" height={220} />}>
              <CodeMirrorEditor
                ref={editorRef}
                value={code}
                onChange={changeCode}
                spec={spec}
                minHeight="220px"
                placeholder={
                  isExpression
                    ? "e.g. 'Save' (type z for suggestions)"
                    : 'e.g. zcore.redirect.prev(); (type z for suggestions)'
                }
              />
            </Suspense>
            {feedback && (
              <Alert
                severity={feedback.severity}
                onClose={() => setFeedback(null)}
              >
                <AlertTitle>{feedback.title}</AlertTitle>
                {feedback.detail && (
                  <Box
                    component="pre"
                    sx={{
                      fontFamily: '"Source Code Pro", Consolas, monospace',
                      fontSize: 12,
                      m: 0,
                      maxHeight: 160,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {feedback.detail}
                  </Box>
                )}
                {feedback.hint && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {feedback.hint}
                  </Typography>
                )}
              </Alert>
            )}
          </Box>
          <CodeHelpPanel
            spec={spec}
            onInsert={insertSnippet}
            onApplyTemplate={applyTemplate}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={runCheck}
          startIcon={<PlayArrow />}
          sx={{ mr: 'auto' }}
        >
          {isExpression ? 'Test' : 'Check syntax'}
        </Button>
        <Button onClick={onClose} variant="outlined">
          {translator('cancel')}
        </Button>
        {onRemove && (
          <Button onClick={onRemove} variant="outlined">
            {translator('delete')}
          </Button>
        )}
        <Button onClick={apply} variant="contained">
          {translator('apply')}
        </Button>
      </DialogActions>
    </>
  );
};

/**
 * Editor kode property builder dengan template, referensi API, cek sintaks,
 * dan Test untuk expression. `spec` berasal dari getCodeSpec.
 * `onApply(code)` menerima null jika editor dikosongkan.
 */
const CodeDialog = (props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <CodeDialogContent {...props} />
    </Dialog>
  );
};

export default CodeDialog;
