import { ROUTES } from "../../../routes/routes";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";

import Image from "../../../components/Image";
import Spinner from "../../../components/Spinner";

import { CircleUser, Pencil } from "lucide-react";
import { useToast } from "../../../hooks/useToast";

interface InfoBoxProps {
  label: string;
  value: string;
  span?: boolean;
}

const InfoBox = ({ label, value }: InfoBoxProps) => {
  return (
    <div className='info-box'>
      <span className='info-box__label'>{label}</span>
      <span className='info-box__value'>{value}</span>
    </div>
  );
};

interface InfoRowProps {
  data: InfoBoxProps[];
  span?: boolean;
}

const InfoRow = ({ data, span }: InfoRowProps) => {
  return (
    <div className={`info-row ${span ? "info-row--full" : ""}`}>
      {data.map((item, index) => (
        <InfoBox key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};

interface SettingsBoxProps {
  title: string;
  edit: string;
  data: InfoBoxProps[][];
}

const SettingsBox = ({ title, edit, data }: SettingsBoxProps) => {
  return (
    <article className='settings-box'>
      <h3>{title}</h3>
      <Link to={edit} className='button secondary'>
        <Pencil />
      </Link>

      <div className='user-info'>
        {data.map((row, index) => (
          <InfoRow key={index} data={row} span={row[0].span} />
        ))}
      </div>
    </article>
  );
};

const PersonalSettings = () => {
  const navigate = useNavigate();

  const { formData, isLoading, isError, error } = usePersonalSettings();

  const { addToast } = useToast();

  useEffect(() => {
    if (isError) {
      addToast("error", error);
      navigate(-1);
    }
  }, [isError]);

  return (
    <div className='page__wrapper'>
      <h1 className='page__title'>
        <CircleUser /> Személyes adatok
      </h1>
      <p className='page__desc mb-2'>
        Ezen az oldalon módosíthatod a profiloddal kapcsolatos információkat és
        a személyes adataidat is.
      </p>

      {isLoading ? (
        <div className='relative py-3'>
          <Spinner />
        </div>
      ) : formData ? (
        <>
          <article className='settings-box image-box'>
            <Link to={ROUTES.SETTINGS.UPLOAD} className='button secondary'>
              <Pencil />
            </Link>
            <h3>Fénykép</h3>
            <div className='image-box__content'>
              <Image
                src={formData.profile_picture}
                alt={formData.username.slice(0, 2)}
                placeholderColor='#212529'
              />
              <div>
                <Link
                  to={ROUTES.PROFILE(formData.username).ROOT}
                  className='image-box__name link'>
                  {formData.username}
                </Link>
                <span className='image-box__rank'>Contributor</span>
                {formData.address?.city && formData.address?.country ? (
                  <span className='image-box__address'>
                    {formData.address.city}, {formData.address.country}
                  </span>
                ) : (
                  <span style={{ height: "25.6px" }} />
                )}
              </div>
            </div>
          </article>

          <SettingsBox
            title='Adatok'
            edit={ROUTES.SETTINGS.PROFILE}
            data={[
              [
                {
                  label: "Vezetéknév",
                  value: formData.last_name || "Nincs megadva",
                },
                {
                  label: "Keresztnév",
                  value: formData.first_name || "Nincs megadva",
                },
              ],
              [
                {
                  label: "Felhasználónév",
                  value: formData.username || "Nincs megadva",
                },
                {
                  label: "Telefonszám",
                  value: formData.phone_number || "Nincs megadva",
                },
              ],
              [
                {
                  label: "Bemutatkozás",
                  value: formData.bio || "Nincs megadva",
                  span: true,
                },
              ],
            ]}
          />

          <SettingsBox
            title='Cím'
            edit={ROUTES.SETTINGS.ADDRESSES}
            data={[
              [
                {
                  label: "Név",
                  value: formData.address?.name || "Nincs megadva",
                },
                {
                  label: "Ország",
                  value: formData.address?.country || "Nincs megadva",
                },
              ],
              [
                {
                  label: "Város, irányítószám",
                  value: formData.address?.city
                    ? `${formData.address.city}, ${formData.address.zip}`
                    : "Nincs megadva",
                },
                {
                  label: "Utca, házszám",
                  value: formData.address?.street || "Nincs megadva",
                },
              ],
            ]}
          />
        </>
      ) : (
        <p className='error-text'>Nem sikerült betölteni az adatokat.</p>
      )}
    </div>
  );
};

export default PersonalSettings;
