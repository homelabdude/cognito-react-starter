import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import SectionOne from "./section1/section1";
import SectionTwo from "./section2/section2";

const Dashboard = ({ signOut, user }) => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState("section1");

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
  };

  const [tokens, setTokens] = useState({ accessToken: "", idToken: "" });
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const session = await fetchAuthSession();
        setTokens(session.tokens);
        setTokenError(null);
      } catch (error) {
        console.error("Error getting tokens:", error);
        setTokenError(error.message);
      }
    };
    getTokens();
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="min-vh-100 bg-body-secondary">
      {tokenError && (
        <div className="alert alert-danger m-0 rounded-0 text-center" role="alert">
          Error loading authentication tokens: {tokenError}
        </div>
      )}
      <Navbar variant="dark" className="navbar-custom shadow-sm">
        <Nav className="me-auto ms-3 small">
          <Nav.Link onClick={handleHomeClick} className="text-white-50">
            [Home]
          </Nav.Link>
          <Nav.Link
            onClick={() => handleNavItemClick("section1")}
            className={
              activeNavItem === "section1"
                ? "text-white border-bottom border-2"
                : "text-white-50"
            }
          >
            [Section 1]
          </Nav.Link>
          <Nav.Link
            onClick={() => handleNavItemClick("section2")}
            className={
              activeNavItem === "section2"
                ? "text-white border-bottom border-2"
                : "text-white-50"
            }
          >
            [Section 2]
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto me-3">
          <NavDropdown
            title={<span className="text-white">{user.username}</span>}
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      <div>
        {activeNavItem === "section1" && <SectionOne tokens={tokens} />}
        {activeNavItem === "section2" && <SectionTwo tokens={tokens} />}
      </div>
    </div>
  );
};

export default Dashboard;
