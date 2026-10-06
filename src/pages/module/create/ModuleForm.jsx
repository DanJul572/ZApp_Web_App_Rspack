import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import LongText from '@/components/input/LongText';
import ShortText from '@/components/input/ShortText';
import SectionCard from '@/components/page/SectionCard';

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
    <SectionCard
      icon={<InfoOutlined />}
      title="Module Information"
      subtitle="Name is used as the table name, label is shown to users"
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LongText
            label="Module Description"
            onChange={setModuleDescription}
            rows={5}
            value={moduleDescription}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};

export default ModuleForm;
