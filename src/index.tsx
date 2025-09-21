import "./assets/css/index.css";
import "./assets/css/input.css";
import "./assets/css/button.css";
import "./assets/css/toast.css";
import "./assets/css/tooltip.css";
import "./assets/css/modal.css";
import "./assets/css/dtable.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { createPortal } from "react-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Toaster } from "sonner";

import App from "./App";

import AuthProvider from "./context/AuthProvider";
import NotificationsProvider from "./context/NotificationsProvider";
import NavbarThemeProvider from "./context/NavbarThemeProvider";

import {
  CircleCheck,
  Info,
  Loader,
  OctagonX,
  TriangleAlert,
} from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 1s, 2s, 4s, 8s, 10s
    },
  },
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <AuthProvider>
            <NotificationsProvider>
              <NavbarThemeProvider>
                {createPortal(
                  <Toaster
                    position='bottom-right'
                    className='toaster'
                    theme='light'
                    richColors
                    icons={{
                      success: <CircleCheck />,
                      error: <OctagonX />,
                      info: <Info />,
                      warning: <TriangleAlert />,
                      loading: <Loader />,
                    }}
                    toastOptions={{
                      className: "toast",
                      classNames: {
                        success: "toast--success",
                        error: "toast--error",
                        info: "toast--info",
                        warning: "toast--warning",
                        loading: "toast--loading",
                      },
                    }}
                    visibleToasts={5}
                    duration={5000}
                  />,
                  document.body
                )}

                <Routes>
                  <Route path='/*' element={<App />} />
                </Routes>
              </NavbarThemeProvider>
            </NotificationsProvider>
          </AuthProvider>
        </QueryParamProvider>
      </Router>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
