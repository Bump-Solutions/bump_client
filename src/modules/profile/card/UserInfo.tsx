import { Link, useLocation } from "react-router";
import { useProfile } from "../../../hooks/profile/useProfile";
import { ROUTES } from "../../../routes/routes";

interface Stat {
  label: string;
  value: number | string | null;
  href: string;
}

const UserInfo = () => {
  const location = useLocation();
  const { user, isOwnProfile } = useProfile();

  const stats: Stat[] = user?.username
    ? [
        {
          label: "Követők",
          value: user?.followersCount ?? null, // 0 is rendben marad
          href: ROUTES.PROFILE(user.username).FOLLOWERS,
        },
        {
          label: "Követések",
          value: user?.followingsCount ?? null,
          href: ROUTES.PROFILE(user.username).FOLLOWINGS,
        },
      ]
    : [];

  return (
    <div className='user__info__wrapper'>
      <div className='user__info-block'>
        <table className='w-full'>
          <tbody>
            {stats
              .filter((stat) => stat.value !== null)
              .map((stat, index) => (
                <tr key={index}>
                  <td className='ta-left'>
                    <Link
                      to={stat.href}
                      state={{ background: location }}
                      className='link black'>
                      {stat.label}
                    </Link>
                  </td>
                  <td className='ta-right'>
                    <Link
                      to={stat.href}
                      state={{ background: location }}
                      className='link black'>
                      {stat.value}
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className='user__info-block'>
        <p className='fc-gray-600 fs-14'>
          {isOwnProfile ? "Csatlakoztál:" : "Csatlakozott:"}{" "}
          {user?.joined && (
            <time dateTime={new Date(user.joined).toISOString()}>
              {new Date(user.joined).toLocaleDateString()}
            </time>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
