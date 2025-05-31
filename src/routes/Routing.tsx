import { ENUM } from "../utils/enum";
import { JSX, lazy, LazyExoticComponent, Suspense } from "react";
import { Route } from "react-router";

import Fallback from "../components/Fallback";

import RequireAuth from "../modules/auth/RequireAuth";
import PersistLogin from "../modules/auth/PersistLogin";
import ProfileProvider from "../context/ProfileProvider";
import SellProvider from "../context/SellProvider";

import Main from "../modules/home/Main";
import Home from "../modules/home/Home";

import Sell from "../modules/sell/Sell";
import Follow from "../modules/follow/Follow";
import Followers from "../modules/follow/Followers";
import Followings from "../modules/follow/Followings";
import Search from "../modules/search/Search";
import Report from "../modules/report/Report";
import Messages from "../modules/chat/Messages";

const Authentication = lazy(() => import("../modules/auth/Authentication"));
const Login = lazy(() => import("../modules/auth/Login"));
const Signup = lazy(() => import("../modules/auth/Signup"));

const Profile = lazy(() => import("../modules/profile/Profile"));
const Products = lazy(() => import("../modules/product/Products"));
const SavedProducts = lazy(() => import("../modules/product/SavedProducts"));
const ProductLayout = lazy(() => import("../modules/product/ProductLayout"));
const Product = lazy(() => import("../modules/product/Product"));

const Chat = lazy(() => import("../modules/chat/Chat"));

const Error = lazy(() => import("../modules/error/Error"));

const Settings = lazy(() => import("../modules/settings/Settings"));
const PersonalSettings = lazy(
  () => import("../modules/settings/personal/PersonalSettings")
);
const ProfilePictureSettings = lazy(
  () => import("../modules/settings/personal/ProfilePictureSettings")
);
const ProfileInfoSettings = lazy(
  () => import("../modules/settings/personal/ProfileInfoSettings")
);
const AddressSettings = lazy(
  () => import("../modules/settings/address/AddressSettings")
);
const ChangePassword = lazy(
  () => import("../modules/settings/password/ChangePassword")
);

const withSuspense = (Component: LazyExoticComponent<any>) => {
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  );
};

const withSuspenseProps = <T extends object>(
  Component: LazyExoticComponent<(props: T) => JSX.Element>,
  props: T
) => {
  return (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
};

export const publicRoutes = () => {
  return (
    <>
      {/* AUTHENTICATION */}
      <Route path='/auth' element={withSuspense(Authentication)}>
        <Route index element={<Login />} />
        <Route path='signup' element={<Signup />} />
      </Route>
    </>
  );
};

export const privateRoutes = () => {
  return (
    <>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.All} />}>
          {/* HOME */}
          <Route path='/' element={<Main />}>
            <Route index element={<Home />} />

            <Route element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.All} />}>
              {/* PROFILE */}
              <Route
                path='/profile/:uname'
                element={
                  <ProfileProvider>{withSuspense(Profile)}</ProfileProvider>
                }>
                <Route index element={<Products />} />
                <Route path='products' element={<Products />} />
                <Route path='saved' element={<SavedProducts />} />
              </Route>

              {/* PRODUCT */}
              <Route path='/product/:pid' element={withSuspense(ProductLayout)}>
                <Route index element={<Product />} />
              </Route>
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={ENUM.AUTH.ROLES.Authenticated} />
              }>
              {/* SETTINGS */}
              <Route path='/settings' element={withSuspense(Settings)}>
                <Route index element={<PersonalSettings />} />
                <Route path='personal' element={<PersonalSettings />} />
                <Route path='upload' element={<ProfilePictureSettings />} />
                <Route path='profile' element={<ProfileInfoSettings />} />
                <Route path='addresses' element={<AddressSettings />} />
                <Route path='change-password' element={<ChangePassword />} />
              </Route>
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={ENUM.AUTH.ROLES.Validated} />
              }>
              {/* MESSAGES */}
              <Route path='/messages' element={withSuspense(Chat)}>
                <Route index element={<Messages />} />
                <Route path=':chat' element={<Messages />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </>
  );
};

export const errorRoutes = () => {
  return (
    <>
      <Route
        path='/unauthorized'
        element={withSuspenseProps(Error, { code: 403 })}
      />
      <Route path='/not-found' element={withSuspenseProps(Error, {})} />
      <Route path='*' element={withSuspenseProps(Error, { code: 404 })} />
    </>
  );
};

export const modalRoutes = (background: Location) => {
  return (
    <>
      <Route element={<PersistLogin />}>
        <Route
          element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.Validated} />}>
          {/* SELL */}
          <Route
            path='/sell'
            element={
              <SellProvider>
                <Sell />
              </SellProvider>
            }
          />
        </Route>

        <Route
          element={
            <RequireAuth allowedRoles={ENUM.AUTH.ROLES.Authenticated} />
          }>
          {/* FOLLOW */}
          <Route
            element={
              <ProfileProvider>
                <Follow background={background} />
              </ProfileProvider>
            }>
            <Route path='/profile/:uname/followers' element={<Followers />} />
            <Route path='/profile/:uname/followings' element={<Followings />} />
          </Route>

          {/* SEARCH */}
          <Route path='/search' element={<Search />} />

          {/* REPORT */}
          <Route path='/report/:type/:id' element={<Report />} />
        </Route>
      </Route>
    </>
  );
};
