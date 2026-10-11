import { useQuery } from '@tanstack/react-query';
import { useConfig } from '@/contexts/ConfigProvider';
import { useUserData } from '@/contexts/UserDataProvider';
import Request from '@/hooks/Request';

// Invalidate this key after the picture is changed to refresh every avatar.
export const profilePictureQueryKey = ['profile-picture'];

export const readAsDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/**
 * The signed-in user's picture as a data URL, or null when they have none. All avatars share
 * one cached request per user.
 */
const ProfilePicture = () => {
  const { config } = useConfig();
  const { userData } = useUserData();
  const request = Request();

  const userId = userData?.userId;

  const { data } = useQuery({
    queryKey: [...profilePictureQueryKey, userId],
    queryFn: async () => {
      // The API answers 204 (an empty body) when there is no picture.
      const blob = await request.getFile(config.api.profile.picture);
      return blob?.size ? readAsDataUrl(blob) : null;
    },
    enabled: !!userId,
    staleTime: Infinity,
    retry: 0,
  });

  return data || null;
};

export default ProfilePicture;
