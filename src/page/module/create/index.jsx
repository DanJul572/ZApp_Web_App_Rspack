import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Upload from '@/component/button/Upload';
import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';
import { useAlert } from '@/context/AlertProvider';
import { useLoading } from '@/context/LoadingProvider';
import { readJSONFile } from '@/helper/readFile';
import Request from '@/hook/Request';
import Translator from '@/hook/Translator';
import FieldForm from './FieldForm';
import ModuleForm from './ModuleForm';

const Page = () => {
  const { post } = Request();
  const translator = Translator();

  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { setAlert } = useAlert();

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

    post(CApiUrl.module.create, data)
      .then((res) => {
        setAlert({
          status: true,
          type: 'success',
          message: res,
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
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          variant="outlined"
          size={CTheme.button.size.name}
          onClick={onBack}
        >
          {translator('back')}
        </Button>
        <Upload label={translator('upload')} onUpload={onUpload} type=".json" />
        <Button
          variant="contained"
          size={CTheme.button.size.name}
          onClick={onSave}
        >
          {translator('save')}
        </Button>
      </Box>
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
