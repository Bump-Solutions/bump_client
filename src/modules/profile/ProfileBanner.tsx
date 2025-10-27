import { ENUM } from "../../utils/enum";

import { useEffect, useState } from "react";
import { useTitle } from "react-use";
import { getProfilePictureColors } from "../../services/profileService";
import { isLightColor } from "../../utils/colors";

import { useProfile } from "../../hooks/profile/useProfile";
import { useToggle } from "../../hooks/useToggle";

import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import BgColorPicker from "./BgColorPicker";

import { PaintbrushVertical } from "lucide-react";

export interface ColorData {
  dominantColor: string;
  palette: string[];
}

const DEFAULT_COLOR = "#868e96";
const DEFAULT_PALETTE = [
  "#212529",
  "#343a40",
  "#495057",
  "#868e96",
  "#adb5bd",
  "#ced4da",
  "#dee2e6",
  "#e9ecef",
];

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
    user?.profileBackgroundColor || colorData?.dominantColor || DEFAULT_COLOR;

  const palette =
    user?.profilePictureColorPalette?.split(";") ||
    colorData?.palette ||
    DEFAULT_PALETTE;

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
