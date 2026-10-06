import FileUpload from '@mui/icons-material/FileUpload';
import Save from '@mui/icons-material/Save';
import ViewModule from '@mui/icons-material/ViewModule';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Upload from '@/components/button/Upload';
import PageHeader from '@/components/page/PageHeader';
import { useAlert } from '@/contexts/AlertProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { useLoading } from '@/contexts/LoadingProvider';
import { readJSONFile } from '@/helpers/readFile';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';
import FieldForm from './FieldForm';
import ModuleForm from './ModuleForm';

const Page = () => {
  const request = Request();
  const translator = Translator();

  const navigate = useNavigate();

  const { setLoading } = useLoading();
  const { setAlert } = useAlert();
  const { config } = useConfig();

  const [moduleName, setModuleName] = useState(null);
  const [moduleLabel, setModuleLabel] = useState(null);
  const [moduleDescription, setModuleDescription] = useState(null);
  const [fieldRows, setFieldRows] = useState([]);

  const onBack = () => {
    navigate(-1);
  };

  const onUpload = (event) => {
    readJSONFile(event)
      .then((json) => {
        setModuleName(json.name);
        setModuleLabel(json.label);
        setModuleDescription(json.description);
        setFieldRows(json.fields);
        event.target.value = null;
      })
      .catch((error) => console.log(error));
  };

  const onSave = () => {
    setLoading(true);

    const fields = [...fieldRows].map((field) => {
      field.id = undefined;
      return field;
    });

    const data = {
      name: moduleName,
      label: moduleLabel,
      description: moduleDescription,
      fields: fields,
    };

    request
      .post(config.api.module.create, data)
      .then((res) => {
        setAlert({
          status: true,
          type: 'success',
          message: res.message,
        });
        navigate('/module');
      })
      .catch((err) => {
        setAlert({
          status: true,
          type: 'error',
          message: err,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <PageHeader
        sticky
        onBack={onBack}
        icon={<ViewModule />}
        title="Create Module"
        subtitle="Describe the module, then add the fields it should store"
        actions={
          <>
            <Upload
              label={translator('upload')}
              onUpload={onUpload}
              type=".json"
              startIcon={<FileUpload />}
            />
            <Button variant="contained" onClick={onSave} startIcon={<Save />}>
              {translator('save')}
            </Button>
          </>
        }
      />
      <ModuleForm
        moduleDescription={moduleDescription}
        moduleLabel={moduleLabel}
        moduleName={moduleName}
        setModuleDescription={setModuleDescription}
        setModuleLabel={setModuleLabel}
        setModuleName={setModuleName}
      />
      <FieldForm fieldRows={fieldRows} setFieldRows={setFieldRows} />
    </Box>
  );
};

export default Page;
