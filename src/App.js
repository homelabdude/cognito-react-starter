import React from "react";
import { Amplify } from "aws-amplify";
import { Heading, View } from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import awsExports from "./aws-exports";
import Home from "./components/home/home";
import Dashboard from "./components/dashboard/dashboard";
import NotFound from "./components/notfound/notfound";
import { ThemeProvider } from "./context/ThemeContext";
import DarkModeToggle from "./components/DarkModeToggle";

const headingStyle = {
  fontSize: "1.5em",
  color: "#667eea",
  fontWeight: "600",
  paddingLeft: "1em",
  paddingRight: "1em",
  paddingTop: "1em",
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsExports.USER_POOL_ID,
      userPoolClientId: awsExports.USER_POOL_APP_CLIENT_ID,
    },
  },
});

const components = {
  Header() {
    return <View paddingTop="2em"></View>;
  },
  SignIn: {
    Header() {
      return <Heading style={headingStyle}> [Your Login Heading] </Heading>;
    },
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
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
      </Router>
    </ThemeProvider>
  );
}
