import React from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Heading,
  Text,
  ThemeProvider as AmplifyThemeProvider,
  View,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import awsExports from "./aws-exports";
import Home from "./components/home/home.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";
import NotFound from "./components/notfound/notfound.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import DarkModeToggle from "./components/DarkModeToggle.jsx";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsExports.USER_POOL_ID,
      userPoolClientId: awsExports.USER_POOL_APP_CLIENT_ID,
    },
  },
});

// Indigo brand scale so the Amplify login matches the Bootstrap accent color
const amplifyTheme = {
  name: "app-theme",
  tokens: {
    colors: {
      primary: {
        10: { value: "#eef2ff" },
        20: { value: "#e0e7ff" },
        40: { value: "#a5b4fc" },
        60: { value: "#818cf8" },
        80: { value: "#6366f1" },
        90: { value: "#4f46e5" },
        100: { value: "#4338ca" },
      },
    },
  },
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: "dark",
      tokens: {
        colors: {
          primary: {
            10: { value: "#1e1b4b" },
            20: { value: "#312e81" },
            40: { value: "#4f46e5" },
            60: { value: "#6366f1" },
            80: { value: "#818cf8" },
            90: { value: "#a5b4fc" },
            100: { value: "#c7d2fe" },
          },
        },
      },
    },
  ],
};

const components = {
  Header() {
    return <View paddingTop="3em"></View>;
  },
  SignIn: {
    Header() {
      return (
        <View padding="2rem 2rem 0">
          <Heading level={4} fontWeight={700}>
            [Your Login Heading]
          </Heading>
          <Text color="font.secondary" marginTop="0.25rem">
            Sign in to continue to your dashboard
          </Text>
        </View>
      );
    },
  },
  Footer() {
    return (
      <View textAlign="center" padding="1.5rem">
        <Link to="/" className="small text-decoration-none">
          ← Back to home
        </Link>
      </View>
    );
  },
};

const AppRoutes = () => {
  const { isDark } = useTheme();

  return (
    <AmplifyThemeProvider
      theme={amplifyTheme}
      colorMode={isDark ? "dark" : "light"}
    >
      <DarkModeToggle />
      <Routes>
        {/* Routes that require authentication */}
        <Route
          path="/dashboard"
          element={
            <Authenticator hideSignUp components={components}>
              {({ signOut, user }) => (
                <Dashboard signOut={signOut} user={user} />
              )}
            </Authenticator>
          }
        />

        {/* Routes that don't require authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </AmplifyThemeProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}
