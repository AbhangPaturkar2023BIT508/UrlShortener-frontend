import React from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewLink from "./pages/NewLink";
import Redirect from "./pages/Redirect";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" zIndex={2077} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/r/:shortCode" element={<Redirect />} />

            {/* Protected routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/new" element={<NewLink />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
