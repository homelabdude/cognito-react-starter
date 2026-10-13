import React, { useState, useEffect, useCallback } from "react";
import Table from "./table.jsx";
import { formatDate } from "../../../utils/utils";
import PersonForm from "./person-form.jsx";
import PersonDetailCard from "./person-detail-card.jsx";
import { usePersonsApi } from "../../../hooks/usePersonsApi";
import { useToast } from "../../../hooks/useToast";
import Toast from "../../Toast.jsx";

// Constants
const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  age: "",
  phoneNumber: "",
  tag: "",
};

// Columns shown in the table; `important` columns are kept on mobile
const COLUMNS = [
  { key: "firstName", label: "First Name", important: true },
  { key: "lastName", label: "Last Name" },
  { key: "age", label: "Age" },
  { key: "phoneNumber", label: "Phone Number", important: true },
  { key: "createTime", label: "Created" },
];

const getErrorMessage = (error, fallback) =>
  error.response?.status === 409 && error.response?.data?.message
    ? error.response.data.message
    : fallback;

const SectionTwo = ({ tokens }) => {
  const {
    fetchPersons,
    createPerson,
    deletePerson,
    fetchPersonById,
    updatePerson,
  } = usePersonsApi(tokens);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // ---------- States ------------
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSearchParams, setActiveSearchParams] = useState({});
  const [selectedPersonForView, setSelectedPersonForView] = useState(null);
  const [openingPersonId, setOpeningPersonId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "detail"

  // ----------- API Calls -----------
  const fetchData = useCallback(
    async (page = 0, searchParams = {}) => {
      try {
        setLoading(true);
        const result = await fetchPersons(page, searchParams);
        setPersons(result.persons);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
        setFetchError(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    },
    [fetchPersons],
  );

  const postData = async () => {
    setIsSubmitting(true);
    try {
      await createPerson(formData);
      setFormData(INITIAL_FORM_DATA);
      showSuccess("Person successfully added!");
      // Preserve filters after adding
      fetchData(0, activeSearchParams);
    } catch (error) {
      console.error("Error making API call:", error);
      showError(
        getErrorMessage(error, "Error adding person. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deletePerson(id);
      showSuccess("Person successfully deleted.");
      // Step back a page if we just removed the last row on this page
      const page =
        persons.length === 1 && currentPage > 0 ? currentPage - 1 : currentPage;
      // Preserve filters after deleting
      fetchData(page, activeSearchParams);
    } catch (error) {
      console.error("Error deleting item:", error);
      showError("Error deleting person. Please try again.");
    }
  };

  const updatePersonInList = (updatedPerson) => {
    setPersons((prevData) =>
      prevData.map((person) =>
        person.id === updatedPerson.id
          ? {
              ...updatedPerson,
              createTime: formatDate(updatedPerson.createTime),
            }
          : person,
      ),
    );
  };

  useEffect(() => {
    // Wait for the Cognito session so the first request is authenticated
    if (!tokens.accessToken) return;
    fetchData();
  }, [fetchData, tokens.accessToken]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchData(newPage, activeSearchParams);
    }
  };

  const handleSubmit = (e, mode) => {
    e.preventDefault();
    if (mode === "add") {
      postData();
    } else {
      // Only send the fields the user actually filled in
      const searchParams = Object.fromEntries(
        Object.entries({
          name: formData.firstName.trim(),
          phone: formData.phoneNumber.trim(),
        }).filter(([, value]) => value !== ""),
      );
      setActiveSearchParams(searchParams);
      fetchData(0, searchParams);
    }
  };

  const clearFilters = () => {
    setFormData(INITIAL_FORM_DATA);
    setActiveSearchParams({});
    fetchData(0, {});
  };

  const hasActiveFilters = Object.keys(activeSearchParams).length > 0;

  const handlePersonRowClick = async (id) => {
    setOpeningPersonId(id);
    try {
      const person = await fetchPersonById(id);
      setSelectedPersonForView(person);
      setViewMode("detail");
    } catch (error) {
      console.error("Error fetching person details:", error);
      showError("Error loading person details. Please try again.");
    } finally {
      setOpeningPersonId(null);
    }
  };

  const handleBackToTable = () => {
    setViewMode("table");
    setSelectedPersonForView(null);
  };

  return (
    <div className="container-fluid p-3 p-md-4 section-fill">
      <Toast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />

      <div className="page-header hero-gradient">
        <h3 className="mb-1 fw-bold">Person Management</h3>
        <p className="mb-0">
          Manage person records with authentication and API integration
        </p>
      </div>

      <div className="row g-4">
        {viewMode === "table" && (
          <>
            <div className="col-lg-4 col-xl-3">
              <PersonForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                resetSearch={clearFilters}
                hasActiveFilters={hasActiveFilters}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="col-lg-8 col-xl-9">
              <Table
                title="Persons"
                columns={COLUMNS}
                data={persons}
                loading={loading}
                initialLoading={!hasLoaded}
                error={fetchError}
                onRetry={() => fetchData(currentPage, activeSearchParams)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                deleteItem={deleteItem}
                updatePersonInList={updatePersonInList}
                onPersonClick={fetchPersonById}
                onPersonUpdate={updatePerson}
                showSuccess={showSuccess}
                showError={showError}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                onPersonRowClick={handlePersonRowClick}
                openingPersonId={openingPersonId}
              />
            </div>
          </>
        )}

        {viewMode === "detail" && selectedPersonForView && (
          <div className="col-12">
            <PersonDetailCard
              person={selectedPersonForView}
              onBack={handleBackToTable}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionTwo;
