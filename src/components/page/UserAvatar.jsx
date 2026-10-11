import Avatar from '@mui/material/Avatar';
import { useUserData } from '@/contexts/UserDataProvider';
import ProfilePicture from '@/hooks/ProfilePicture';

/**
 * Avatar of the signed-in user: their profile picture, or the first letter of their name when
 * they have none. Pass `src` to show another picture (null shows the letter).
 */
const UserAvatar = (props) => {
  const { size = 40, fontSize, src, sx } = props;

  const { userData } = useUserData();
  const picture = ProfilePicture();

  const userName = userData?.userName?.trim();

  return (
    <Avatar
      src={(src !== undefined ? src : picture) || undefined}
      alt={userName}
      sx={[
        { width: size, height: size, fontSize, bgcolor: 'primary.main' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {userName?.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
