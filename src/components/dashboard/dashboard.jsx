import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import SectionOne from "./section1/section1.jsx";
import SectionTwo from "./section2/section2.jsx";
import DarkModeToggle from "../DarkModeToggle.jsx";

const Dashboard = ({ signOut, user }) => {
  const [activeNavItem, setActiveNavItem] = useState("section1");
  const [navExpanded, setNavExpanded] = useState(false);

  const handleNavSelect = (navItem) => {
    if (navItem) setActiveNavItem(navItem);
    setNavExpanded(false);
  };

  const [tokens, setTokens] = useState({ accessToken: "", idToken: "" });
  const [tokensLoading, setTokensLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const session = await fetchAuthSession();
        setTokens(session.tokens ?? { accessToken: "", idToken: "" });
        setTokenError(null);
      } catch (error) {
        console.error("Error getting tokens:", error);
        setTokenError(error.message);
      } finally {
        setTokensLoading(false);
      }
    };
    getTokens();
  }, []);

  const displayName = user.signInDetails?.loginId ?? user.username;

  return (
    <div className="dashboard-shell min-vh-100 d-flex flex-column bg-body-secondary">
      {tokenError && (
        <div
          className="alert alert-danger m-0 rounded-0 text-center small"
          role="alert"
        >
          Error loading authentication tokens: {tokenError}
        </div>
      )}
      <Navbar
        variant="dark"
        expand="md"
        sticky="top"
        className="navbar-custom shadow-sm"
        expanded={navExpanded}
        onToggle={setNavExpanded}
      >
        <Container fluid className="px-3 px-md-4">
          <Navbar.Brand as={Link} to="/" className="text-white">
            [Your App]
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-2 ms-auto ms-md-2 order-md-last">
            <DarkModeToggle inline />
            <Navbar.Toggle aria-controls="dashboard-nav" />
          </div>
          <Navbar.Collapse id="dashboard-nav">
            <Nav
              className="me-auto gap-md-1 my-2 my-md-0"
              activeKey={activeNavItem}
              onSelect={handleNavSelect}
            >
              <Nav.Link as="button" eventKey="section1" className="px-3">
                [Section 1]
              </Nav.Link>
              <Nav.Link as="button" eventKey="section2" className="px-3">
                [Section 2]
              </Nav.Link>
            </Nav>
            <Nav className="mb-2 mb-md-0">
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center gap-2 text-white">
                    <FaUserCircle size={18} />
                    <span
                      className="text-truncate d-inline-block"
                      style={{ maxWidth: "14rem" }}
                    >
                      {displayName}
                    </span>
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Header className="small">
                  Signed in as
                  <div className="fw-semibold text-body text-truncate">
                    {displayName}
                  </div>
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={signOut}
                  className="d-flex align-items-center gap-2"
                >
                  <FaSignOutAlt size={13} />
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="dashboard-main">
        {activeNavItem === "section1" && (
          <SectionOne tokens={tokens} loading={tokensLoading} />
        )}
        {activeNavItem === "section2" && <SectionTwo tokens={tokens} />}
      </main>
    </div>
  );
};

export default Dashboard;
