import { ENUM } from "../../utils/enum";

import { useTitle } from "react-use";
import { useEffect, useState } from "react";
import { getProfilePictureColors } from "../../services/profileService";
import { isLightColor } from "../../utils/functions";

import { useProfile } from "../../hooks/profile/useProfile";
import { useToggle } from "../../hooks/useToggle";

import BgColorPicker from "./BgColorPicker";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";

import { PaintbrushVertical } from "lucide-react";

export interface ColorData {
  dominantColor: string;
  palette: string[];
}

const ProfileBanner = () => {
  const { isOwnProfile, user } = useProfile();
  useTitle(`@${user?.username} - ${ENUM.BRAND.NAME}`);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [openBgColorPicker, toggleBgColorPicker] = useToggle(false);
  const [colorData, setColorData] = useState<ColorData | null>(null);

  useEffect(() => {
    const getColorData = async () => {
      const colorData = await getProfilePictureColors(user?.profile_picture!);
      setColorData(colorData);
    };

    if (user?.profile_picture) getColorData();

    return () => {
      setColorData(null);
    };
  }, [user?.profile_picture]);

  const dominantColor =
    user?.profile_background_color || colorData?.dominantColor;

  const palette =
    user?.profile_picture_color_palette?.split(";") || colorData?.palette;

  const isLight = isLightColor(user?.profile_background_color || dominantColor);

  return (
    <>
      <BgColorPicker
        isOpen={openBgColorPicker}
        close={() => {
          setSelectedColor(dominantColor!);
          toggleBgColorPicker(false);
        }}
        dominantColor={dominantColor!}
        palette={palette!}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

      <header
        className={`profile__banner ${isLight ? "light" : ""}`}
        style={{ backgroundColor: dominantColor }}>
        {isOwnProfile ? (
          <Tooltip
            content='Háttérszín módosítása'
            placement='top'
            showDelay={750}>
            <Button
              className='secondary'
              onClick={() => toggleBgColorPicker(true)}>
              <PaintbrushVertical className='svg-20' />
            </Button>
          </Tooltip>
        ) : null}
      </header>
    </>
  );
};

export default ProfileBanner;
