import { useState, useEffect } from "react";

/**
 * Custom hook to detect media query matches
 * @param {string} query - The media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};
