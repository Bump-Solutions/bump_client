import { ROUTES } from "../../../routes/routes";
import { Link, useLocation } from "react-router";
import { useProfile } from "../../../hooks/profile/useProfile";
import { useState, useEffect } from "react";

interface Stat {
  label: string;
  value: number | string | null;
  href?: string;
}

const UserInfo = () => {
  const location = useLocation();
  const { user, isOwnProfile } = useProfile();

  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    setStats([
      {
        label: "Követők",
        value: user.followers_count || null,
        href: ROUTES.PROFILE(user.username).FOLLOWERS,
      },
      {
        label: "Követések",
        value: user.followings_count || null,
        href: ROUTES.PROFILE(user.username).FOLLOWINGS,
      },
    ]);
  }, [user]);

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
        <p className='fc-light fs-14'>
          {isOwnProfile ? "Csatlakoztál:" : "Csatlakozott:"} {user.joined}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
