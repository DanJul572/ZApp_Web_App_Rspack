import Checklist from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useId, useRef } from 'react';

const Richtext = (props) => {
  const { label, disabled = false, onChange, defaultValue } = props;

  const editorInstance = useRef(null);
  const editorId = useId();

  const initEditor = () => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: editorId,
        autofocus: !disabled,
        placeholder: !disabled ? 'Write Here' : null,
        data: defaultValue || {}, // apply default value
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: { class: List, inlineToolbar: true },
          checklist: { class: Checklist, inlineToolbar: true },
          table: { class: Table, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
          code: Code,
          inlineCode: InlineCode,
          marker: Marker,
          delimiter: Delimiter,
          warning: Warning,
          embed: Embed,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/fetchUrl',
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: '/api/uploadFile',
                byUrl: '/api/fetchUrl',
              },
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    initEditor();

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [editorId]);

  const handleSave = async () => {
    try {
      const outputData = await editorInstance.current.save();
      if (onChange) {
        onChange(outputData);
      }
    } catch (error) {
      console.error('Save Failed:', error);
    }
  };

  const handleClear = async () => {
    try {
      await editorInstance.current.clear();
      if (onChange) {
        onChange({ blocks: [] }); // emit kosong
      }
    } catch (error) {
      console.error('Clear Failed:', error);
    }
  };

  return (
    <Box>
      {label && <Typography style={{ marginBottom: 8 }}>{label}</Typography>}
      <Card>
        <CardContent>
          <div
            id={editorId}
            style={{
              paddingLeft: 50,
              opacity: disabled ? 0.5 : 1,
              pointerEvents: disabled ? 'none' : 'auto',
            }}
          />
        </CardContent>
      </Card>
      {!disabled && (
        <ButtonGroup
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="contained" onClick={handleSave} disabled={disabled}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleClear} disabled={disabled}>
            Clear
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default Richtext;
