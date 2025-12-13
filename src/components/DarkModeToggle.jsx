import React from "react";
import { useTheme } from "../context/ThemeContext";

const DarkModeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="dark-mode-toggle btn btn-primary shadow"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "✹" : "⏾"}
    </button>
  );
};

export default DarkModeToggle;
