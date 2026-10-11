import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import Box from '@mui/material/Box';
import PageHeader from '@/components/page/PageHeader';
import PasswordForm from './components/PasswordForm';
import ProfileForm from './components/ProfileForm';

const Profile = () => (
  <Box>
    <PageHeader
      icon={<AccountCircleOutlined />}
      title="Profile"
      subtitle="Manage your photo, name, email and password"
    />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      <ProfileForm />
      <PasswordForm />
    </Box>
  </Box>
);

export default Profile;
