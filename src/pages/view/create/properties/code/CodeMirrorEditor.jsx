import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import Box from '@mui/material/Box';
import CodeMirror from '@uiw/react-codemirror';
import { useImperativeHandle, useMemo, useRef } from 'react';
import { createCompletionSource } from './completions';

/**
 * Editor CodeMirror untuk CodeDialog, dengan autocomplete dari apiCatalog.
 * Di-lazy-load oleh CodeDialog agar bundle CodeMirror hanya dimuat saat
 * editor kode dibuka.
 *
 * `ref` mengekspos { insert(text), focus() } untuk panel Reference.
 */
const CodeMirrorEditor = (props) => {
  const { value, onChange, spec, placeholder, minHeight, ref } = props;

  const editorRef = useRef(null);

  const extensions = useMemo(
    () => [
      javascript(),
      // Digabung dengan completion bawaan (keyword, variabel lokal)
      javascriptLanguage.data.of({
        autocomplete: createCompletionSource(spec),
      }),
    ],
    [spec],
  );

  useImperativeHandle(ref, () => ({
    insert: (text) => {
      const view = editorRef.current?.view;
      if (!view) return false;
      view.dispatch(view.state.replaceSelection(text));
      view.focus();
      return true;
    },
    focus: () => editorRef.current?.view?.focus(),
  }));

  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        '& .cm-editor': { fontSize: 13 },
        '& .cm-scroller': {
          fontFamily: '"Source Code Pro", Consolas, monospace',
        },
        '& .cm-editor.cm-focused': { outline: 'none' },
      }}
    >
      <CodeMirror
        ref={editorRef}
        value={value}
        onChange={onChange}
        extensions={extensions}
        placeholder={placeholder}
        minHeight={minHeight}
        maxHeight="400px"
        theme="dark"
        autoFocus
        basicSetup={{ foldGutter: false }}
      />
    </Box>
  );
};

export default CodeMirrorEditor;
