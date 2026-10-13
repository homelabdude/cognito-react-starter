import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// `inline` renders the toggle inside a navbar instead of floating bottom-right
const DarkModeToggle = ({ inline = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className={inline ? "theme-toggle-inline" : "dark-mode-toggle"}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? <FaSun size={16} /> : <FaMoon size={15} />}
    </button>
  );
};

export default DarkModeToggle;
