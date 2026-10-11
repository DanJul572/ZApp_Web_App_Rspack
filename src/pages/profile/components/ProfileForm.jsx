import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ShortText from '@/components/input/ShortText';
import ContentLoader from '@/components/loading/ContentLoader';
import SectionCard from '@/components/page/SectionCard';
import UserAvatar from '@/components/page/UserAvatar';
import { useAuth } from '@/contexts/AuthProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import { useUserData } from '@/contexts/UserDataProvider';
import ProfilePicture, {
  profilePictureQueryKey,
  readAsDataUrl,
} from '@/hooks/ProfilePicture';
import Request from '@/hooks/Request';
import Toaster from '@/hooks/Toaster';
import getErrorMessage from '@/pages/email/getErrorMessage';

export const PICTURE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Same limit as the API (config/profile.js).
export const PICTURE_MAX_SIZE_MB = 2;

export const profileQueryKey = ['profile'];

const ProfileForm = () => {
  const request = Request();
  const toaster = Toaster();
  const queryClient = useQueryClient();

  const { config } = useConfig();
  const { userData } = useUserData();
  const { refetch: refreshUserData } = useAuth();
  const currentPicture = ProfilePicture();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // A picture picked in this form ({ file, preview }), saved together with the name and email.
  const [newPicture, setNewPicture] = useState(null);
  const [removePicture, setRemovePicture] = useState(false);

  const queryKey = [...profileQueryKey, userData?.userId];

  const { data: profile, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await request.get(config.api.profile.detail);
      return res.data;
    },
    enabled: !!userData?.userId,
    retry: 0,
  });

  const fillForm = (data) => {
    setName(data.name);
    setEmail(data.email);
    setNewPicture(null);
    setRemovePicture(false);
  };

  useEffect(() => {
    if (profile) fillForm(profile);
  }, [profile]);

  const shownPicture = newPicture
    ? newPicture.preview
    : removePicture
      ? null
      : currentPicture;

  const isChanged =
    !!profile &&
    (name.trim() !== profile.name ||
      email.trim() !== profile.email ||
      !!newPicture ||
      (removePicture && !!currentPicture));

  const onPickPicture = async (event) => {
    const file = event.target.files?.[0];
    // Cleared so picking the same file again still fires a change.
    event.target.value = '';
    if (!file) return;

    if (!PICTURE_TYPES.includes(file.type)) {
      toaster.showErrorToast(
        'Profile picture must be a JPG, PNG or WEBP image',
      );
      return;
    }
    if (file.size > PICTURE_MAX_SIZE_MB * 1024 * 1024) {
      toaster.showErrorToast(
        `Profile picture is too large (max ${PICTURE_MAX_SIZE_MB}MB)`,
      );
      return;
    }

    setNewPicture({ file, preview: await readAsDataUrl(file) });
    setRemovePicture(false);
  };

  const onRemovePicture = () => {
    setNewPicture(null);
    setRemovePicture(true);
  };

  const mutation = useMutation({
    mutationKey: ['profile-update'],
    mutationFn: () => {
      const files = newPicture
        ? [{ file: newPicture.file, id: newPicture.file.name }]
        : [];
      return request.post(
        config.api.profile.update,
        { name, email, removePicture },
        files,
        false,
      );
    },
    onSuccess: (res) => {
      toaster.showSuccessToast(res.message);
      queryClient.setQueryData(queryKey, res.data);
      fillForm(res.data);
      queryClient.invalidateQueries({ queryKey: profilePictureQueryKey });
      // The name in the top bar comes from the session, which the API has renewed.
      refreshUserData();
    },
    onError: (err) => {
      toaster.showErrorToast(
        getErrorMessage(err, 'Failed to update the profile'),
      );
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <SectionCard
      icon={<PersonOutlined />}
      title="Profile"
      subtitle="Your photo, name and email"
      sx={{ mb: 0 }}
    >
      {isLoading ? (
        <ContentLoader />
      ) : (
        <Box component="form" onSubmit={onSubmit} noValidate>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
            <UserAvatar size={88} fontSize={34} src={shownPicture} />
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCamera />}
                  disabled={mutation.isPending}
                >
                  Upload photo
                  <input
                    type="file"
                    hidden
                    accept={PICTURE_TYPES.join(',')}
                    onChange={onPickPicture}
                    data-testid="picture-input"
                  />
                </Button>
                <Button
                  variant="text"
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={onRemovePicture}
                  disabled={!shownPicture || mutation.isPending}
                >
                  Remove
                </Button>
              </Box>
              <Typography variant="caption" color="textSecondary">
                JPG, PNG or WEBP, max {PICTURE_MAX_SIZE_MB} MB.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ShortText
              label="Name"
              value={name}
              onChange={setName}
              disabled={mutation.isPending}
            />
            <ShortText
              label="Email"
              value={email}
              onChange={setEmail}
              disabled={mutation.isPending}
            />
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}
          >
            <Button
              variant="text"
              onClick={() => fillForm(profile)}
              disabled={!isChanged || mutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={mutation.isPending}
              disabled={!isChanged || mutation.isPending}
            >
              Save changes
            </Button>
          </Box>
        </Box>
      )}
    </SectionCard>
  );
};

export default ProfileForm;
