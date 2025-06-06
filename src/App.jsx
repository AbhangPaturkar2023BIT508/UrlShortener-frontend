import React from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewLink from "./pages/NewLink";
import Redirect from "./pages/Redirect";
import Invalid from "./pages/Invalid";

import { useAuth, AuthProvider } from "./context/AuthContext"; // Your Auth Context

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
});

// Wrapper for private routes - only accessible if user logged in
function PrivateRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// Wrapper for public routes (login/register) - redirect if user logged in
function PublicRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Notifications position="top-right" zIndex={2077} />
          <div style={{ flex: 1 }}>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Redirect and invalid pages - accessible without auth */}
                <Route path="/r/:shortCode" element={<Redirect />} />
                <Route path="/invalid" element={<Invalid />} />

                {/* Private routes - require auth */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="new" element={<NewLink />} />
                  </Route>
                </Route>

                {/* Fallback for unmatched routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;
