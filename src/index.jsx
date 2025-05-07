import "./assets/css/index.css";
import "./assets/css/input.css";
import "./assets/css/button.css";
import "./assets/css/toast.css";
import "./assets/css/tooltip.css";
import "./assets/css/modal.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import App from "./App";
import ToastContainer from "./components/ToastContainer";

import AuthProvider from "./context/AuthProvider";
import ToastProvider from "./context/ToastProvider";
import NavbarThemeProvider from "./context/NavbarThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s, 8s, 16s, 30s
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <AuthProvider>
            <NavbarThemeProvider>
              <ToastProvider>
                <ToastContainer />
                <Routes>
                  <Route path='/*' element={<App />} />
                </Routes>
              </ToastProvider>
            </NavbarThemeProvider>
          </AuthProvider>
        </QueryParamProvider>
      </Router>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
