import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useRef } from 'react';
import EmailEditor from 'react-email-editor';

const EmailBuilder = () => {
  const emailEditorRef = useRef(null);

  const saveTemplate = () => {
    const editor = emailEditorRef.current?.editor;

    if (!editor) return;

    editor.exportHtml(async (data) => {
      const { html, design } = data;

      console.log('HTML Output:', html);
      console.log('Design JSON:', design);
    });
  };

  const onReady = () => {
    console.log('Editor is ready');
    // Optional: Load template awal
    // emailEditorRef.current.editor.loadDesign(initialDesign);
  };

  return (
    <Card
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Button
        sx={{
          mb: 2,
          alignSelf: 'flex-end',
        }}
        variant="contained"
        onClick={saveTemplate}
      >
        Save
      </Button>

      <EmailEditor
        style={{
          flex: 1,
          width: '100%',
          height: '79vh',
          border: '1px solid #ccc',
        }}
        ref={emailEditorRef}
        onReady={onReady}
        options={{
          displayMode: 'email',
        }}
      />
    </Card>
  );
};

export default EmailBuilder;
