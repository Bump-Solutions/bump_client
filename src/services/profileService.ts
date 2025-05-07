import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { AxiosInstance } from "axios";
import { getImageDominantColorAndPalette } from "../utils/functions";
import { User } from "../types/user";

export const getProfile = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<ApiResponse> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.PROFILE.GET_PROFILE,
    {
      signal,
    }
  );

  return response.data.message;
};

export const updateProfile = async (
  axiosPrivate: AxiosInstance,
  newProfile: Partial<User>
): Promise<ApiResponse> => {
  return await axiosPrivate.put(API.PROFILE.UPDATE_PROFILE, {
    username: newProfile.username,
    first_name: newProfile.first_name,
    last_name: newProfile.last_name,
    phone_number: newProfile.phone_number,
    bio: newProfile.bio,
    location: newProfile.address,
  });
};

export const getProfilePicture = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<string> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.PROFILE.GET_PROFILE_PICTURE,
    {
      signal,
    }
  );

  return response.data.message.profile_picture;
};

export const getProfilePictureColors = async (image: string) => {
  if (!image) return { dominantColor: null, palette: null };
  const { dominantColor, palette } = await getImageDominantColorAndPalette(
    image,
    12
  );
  return { dominantColor, palette };
};

// TODO: image type
export const uploadProfilePicture = async (
  axiosPrivate: AxiosInstance,
  newProfilePicture: File
): Promise<ApiResponse> => {
  return await axiosPrivate.put(
    API.PROFILE.UPLOAD_PROFILE_PICTURE,
    newProfilePicture,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const setProfileBackgroundColor = async (
  axiosPrivate: AxiosInstance,
  color: string
): Promise<ApiResponse> => {
  return await axiosPrivate.put(API.PROFILE.SET_PROFILE_BACKGROUND_COLOR, {
    profile_background_color: color,
  });
};
