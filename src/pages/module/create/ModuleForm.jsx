import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import LongText from '@/componentss/input/LongText';
import ShortText from '@/componentss/input/ShortText';

const ModuleForm = (props) => {
  const {
    moduleName,
    setModuleName,
    moduleLabel,
    setModuleLabel,
    moduleDescription,
    setModuleDescription,
  } = props;

  return (
    <Card
      sx={{
        padding: 2,
        marginBlock: 1,
      }}
    >
      <Grid container="true" spacing={2}>
        <Grid display="flex" flexDirection="column" gap={2} size={6}>
          <ShortText
            label="Module Name"
            onChange={setModuleName}
            value={moduleName}
          />
          <ShortText
            label="Module Label"
            onChange={setModuleLabel}
            value={moduleLabel}
          />
        </Grid>
        <Grid size={6}>
          <LongText
            label="Module Description"
            onChange={setModuleDescription}
            rows={6}
            value={moduleDescription}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default ModuleForm;
