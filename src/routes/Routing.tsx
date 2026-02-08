import { JSX, lazy, LazyExoticComponent, Suspense } from "react";
import { Outlet, Route } from "react-router";
import { ENUM } from "../utils/enum";

import CartProvider from "../context/CartProvider";

import Fallback from "../components/Fallback";

import ProfileProvider from "../context/ProfileProvider";
import SellProvider from "../context/SellProvider";
import PersistLogin from "../modules/auth/PersistLogin";
import RequireAuth from "../modules/auth/RequireAuth";

import Home from "../modules/home/Home";
import Main from "../modules/home/Main";

import Messages from "../modules/chat/Messages";
import Follow from "../modules/follow/Follow";
import Followers from "../modules/follow/Followers";
import Followings from "../modules/follow/Followings";
import Report from "../modules/report/Report";
import Search from "../modules/search/Search";
import Sell from "../modules/sell/Sell";

const Authentication = lazy(() => import("../modules/auth/Authentication"));
const Login = lazy(() => import("../modules/auth/Login"));
const Signup = lazy(() => import("../modules/auth/Signup"));
const GoogleCallback = lazy(() => import("../modules/auth/GoogleCallback"));

const Profile = lazy(() => import("../modules/profile/Profile"));
const Products = lazy(() => import("../modules/product/Products"));
const SavedProducts = lazy(() => import("../modules/product/SavedProducts"));
const ProductLayout = lazy(() => import("../modules/product/ProductLayout"));
const Product = lazy(() => import("../modules/product/Product"));

const Notifications = lazy(
  () => import("../modules/notifications/Notifications"),
);

const Cart = lazy(() => import("../modules/cart/Cart"));

const Orders = lazy(() => import("../modules/order/Orders"));
const OrderLayout = lazy(() => import("../modules/order/OrderLayout"));
const Order = lazy(() => import("../modules/order/Order"));

const Chat = lazy(() => import("../modules/chat/Chat"));

const Error = lazy(() => import("../modules/error/Error"));

const Settings = lazy(() => import("../modules/settings/Settings"));
const PersonalSettings = lazy(
  () => import("../modules/settings/personal/PersonalSettings"),
);
const ProfilePictureSettings = lazy(
  () => import("../modules/settings/personal/ProfilePictureSettings"),
);
const ProfileInfoSettings = lazy(
  () => import("../modules/settings/personal/ProfileInfoSettings"),
);
const AddressSettings = lazy(
  () => import("../modules/settings/address/AddressSettings"),
);
const ChangePassword = lazy(
  () => import("../modules/settings/password/ChangePassword"),
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
  props: T,
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

      <Route path='/auth/google/callback' element={<GoogleCallback />} />
    </>
  );
};

export const privateRoutes = () => {
  return (
    <>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.All} />}>
          {/* PROVIDERS FOR AUTHENTICATED USERS */}
          <Route
            element={
              <CartProvider>
                <Outlet />
              </CartProvider>
            }>
            {/* HOME */}
            <Route path='/' element={<Main />}>
              <Route index element={<Home />} />

              <Route
                element={<RequireAuth allowedRoles={ENUM.AUTH.ROLES.All} />}>
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
                <Route
                  path='/product/:pid'
                  element={withSuspense(ProductLayout)}>
                  <Route index element={<Product />} />
                </Route>

                {/* NOTIFICATIONS */}
                <Route
                  path='/notifications'
                  element={withSuspense(Notifications)}
                />

                {/* CART */}
                <Route path='/cart' element={withSuspense(Cart)} />

                {/* ORDERS */}
                <Route path='/orders' element={withSuspense(Orders)} />
                <Route path='/order/:uuid' element={withSuspense(OrderLayout)}>
                  <Route index element={<Order />} />
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
          {/* PROVIDERS FOR AUTHENTICATED USERS */}
          <Route
            element={
              <CartProvider>
                <Outlet />
              </CartProvider>
            }>
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
              <Route
                path='/profile/:uname/followings'
                element={<Followings />}
              />
            </Route>

            {/* SEARCH */}
            <Route path='/search' element={<Search />} />

            {/* REPORT */}
            <Route path='/report/:type/:id' element={<Report />} />
          </Route>
        </Route>
      </Route>
    </>
  );
};
