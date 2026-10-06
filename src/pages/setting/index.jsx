import AppsOutlined from '@mui/icons-material/AppsOutlined';
import PersonOutline from '@mui/icons-material/PersonOutlined';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import { useConfig } from '@/contexts/ConfigProvider';
import { useUserData } from '@/contexts/UserDataProvider';
import CountdownSession from '@/hooks/CountdownSession';
import { version } from '../../../package.json';

const InfoRow = ({ label, value }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      py: 1.5,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-of-type': { borderBottom: 0, pb: 0 },
    }}
  >
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {value || '—'}
    </Typography>
  </Box>
);

const Setting = () => {
  const { config } = useConfig();
  const { userData } = useUserData();
  const timeLeft = CountdownSession();

  const userName = userData?.userName;

  return (
    <Box>
      <PageHeader
        icon={<Settings />}
        title="Settings"
        subtitle="Your account and application information"
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <SectionCard icon={<PersonOutline />} title="Account" sx={{ mb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                fontSize: 22,
                bgcolor: 'primary.main',
              }}
            >
              {userName?.trim().charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{userName || '—'}</Typography>
              <Typography variant="body2" color="textSecondary">
                Signed in
              </Typography>
            </Box>
          </Box>
          <InfoRow label="User name" value={userName} />
          <InfoRow label="Session remaining" value={timeLeft} />
        </SectionCard>

        <SectionCard icon={<AppsOutlined />} title="Application" sx={{ mb: 0 }}>
          <InfoRow label="Name" value={config.app.name} />
          <InfoRow label="Version" value={`v${version}`} />
          <InfoRow
            label="Language"
            value={config.app.language?.toUpperCase()}
          />
        </SectionCard>
      </Box>
    </Box>
  );
};

export default Setting;
