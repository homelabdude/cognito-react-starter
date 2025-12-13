import { useCallback } from "react";
import axios from "axios";
import { formatDate } from "../utils/utils";

const apiUrl = process.env.REACT_APP_BACKEND_APP_API_BASE_URL;
const PAGE_SIZE = 9;

/**
 * Custom hook for person management API calls
 * @param {Object} tokens - Authentication tokens from AWS Cognito
 * @returns {Object} API methods for person management
 */
export const usePersonsApi = (tokens) => {
  const getAuthHeader = useCallback(() => ({
    Authorization: `Bearer ${tokens.accessToken?.toString?.() || ""}`,
  }), [tokens.accessToken]);

  /**
   * Fetch persons with pagination and optional search parameters
   */
  const fetchPersons = useCallback(
    async (page = 0, searchParams = {}) => {
      try {
        const queryParams = new URLSearchParams({
          page: page,
          size: PAGE_SIZE,
          ...searchParams,
        }).toString();

        const response = await axios.get(`${apiUrl}v1/persons?${queryParams}`, {
          headers: getAuthHeader(),
        });

        const formattedPersons = response.data.content.map((person) => ({
          ...person,
          createTime: formatDate(person.createTime),
        }));

        return {
          persons: formattedPersons,
          totalPages: response.data.totalPages,
          currentPage: page,
        };
      } catch (error) {
        console.error("Error fetching persons:", error);
        throw error;
      }
    },
    [getAuthHeader]
  );

  /**
   * Fetch a single person by ID
   */
  const fetchPersonById = useCallback(
    async (id) => {
      try {
        const response = await axios.get(`${apiUrl}v1/persons/${id}`, {
          headers: getAuthHeader(),
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching person details:", error);
        throw error;
      }
    },
    [getAuthHeader]
  );

  /**
   * Create a new person
   */
  const createPerson = useCallback(
    async (personData) => {
      try {
        const response = await axios.post(`${apiUrl}v1/persons`, personData, {
          headers: getAuthHeader(),
        });
        return response.data;
      } catch (error) {
        console.error("Error creating person:", error);
        throw error;
      }
    },
    [getAuthHeader]
  );

  /**
   * Update an existing person
   */
  const updatePerson = useCallback(
    async (id, personData) => {
      try {
        const response = await axios.patch(
          `${apiUrl}v1/persons/${id}`,
          personData,
          {
            headers: getAuthHeader(),
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error updating person:", error);
        throw error;
      }
    },
    [getAuthHeader]
  );

  /**
   * Delete a person by ID
   */
  const deletePerson = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(`${apiUrl}v1/persons/${id}`, {
          headers: getAuthHeader(),
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting person:", error);
        throw error;
      }
    },
    [getAuthHeader]
  );

  return {
    fetchPersons,
    fetchPersonById,
    createPerson,
    updatePerson,
    deletePerson,
  };
};
