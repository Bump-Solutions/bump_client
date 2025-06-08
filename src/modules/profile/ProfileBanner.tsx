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
      const colorData = await getProfilePictureColors(user?.profilePicture);
      setColorData(colorData);
    };

    if (user?.profilePicture) getColorData();

    return () => {
      setColorData(null);
    };
  }, [user?.profilePicture]);

  const dominantColor =
    user?.profileBackgroundColor || colorData?.dominantColor;

  const palette =
    user?.profilePictureColorPalette?.split(";") || colorData?.palette;

  const isLight = isLightColor(user?.profileBackgroundColor || dominantColor);

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
