import { AxiosInstance } from "axios";
import {
  FetchedProfileDTO,
  FetchedProfileMetaDTO,
  UpdateProfileDTO,
} from "../dtos/ProfileDTO";
import {
  fromFetchedProfileDTO,
  fromFetchedProfileMetaDTO,
  toUpdateProfileDTO,
} from "../mappers/profileMapper";
import { ProfileMetaModel, ProfileModel } from "../models/profileModel";
import { ColorData } from "../modules/profile/ProfileBanner";
import { ApiResponse } from "../types/api";
import { API } from "../utils/api";
import { getImageDominantColorAndPalette } from "../utils/colors";

export const getProfile = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<ProfileModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedProfileDTO;
  }>(API.PROFILE.GET_PROFILE, {
    signal,
  });

  return fromFetchedProfileDTO(response.data.message);
};

export const updateProfile = async (
  axiosPrivate: AxiosInstance,
  newProfile: Partial<ProfileModel>
): Promise<ApiResponse> => {
  const payload: UpdateProfileDTO = toUpdateProfileDTO(newProfile);

  return await axiosPrivate.put(API.PROFILE.UPDATE_PROFILE, payload);
};

export const getProfileMeta = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<ProfileMetaModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedProfileMetaDTO;
  }>(API.PROFILE.GET_PROFILE_META, {
    signal,
  });

  return fromFetchedProfileMetaDTO(response.data.message);
};

export const getProfilePictureColors = async (
  image: string | null | undefined
): Promise<ColorData | null> => {
  if (!image) return null;
  const { dominantColor, palette } = await getImageDominantColorAndPalette(
    image,
    12
  );

  if (!dominantColor) return null;

  // filter out any nulls in the palette:
  const cleanPalette = palette.filter(
    (c): c is string => c !== null && typeof c === "string"
  );

  return { dominantColor, palette: cleanPalette };
};

// TODO: image type
export const uploadProfilePicture = async (
  axiosPrivate: AxiosInstance,
  file: File
): Promise<ApiResponse> => {
  return await axiosPrivate.put(API.PROFILE.UPLOAD_PROFILE_PICTURE, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const setProfileBackgroundColor = async (
  axiosPrivate: AxiosInstance,
  color: string
): Promise<ApiResponse> => {
  return await axiosPrivate.put(API.PROFILE.SET_PROFILE_BACKGROUND_COLOR, {
    profile_background_color: color,
  });
};
