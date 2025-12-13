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
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [activeSearchParams, setActiveSearchParams] = useState({});
  const [selectedPersonForView, setSelectedPersonForView] = useState(null);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchPersons],
  );

  const postData = async () => {
    try {
      await createPerson(formData);
      setFormData(INITIAL_FORM_DATA);
      showSuccess("Person successfully added!");
      // Preserve filters after adding
      fetchData(0, activeSearchParams);
    } catch (error) {
      console.error("Error making API call:", error);

      // Handle 409 Conflict with specific error message
      if (error.response?.status === 409 && error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Error adding person. Please try again.");
      }
    }
  };

  const deleteItem = async (id) => {
    try {
      await deletePerson(id);
      // Preserve filters after deleting
      fetchData(currentPage, activeSearchParams);
    } catch (error) {
      console.error("Error deleting item:", error);
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
    fetchData();
  }, [fetchData]);

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
      const searchParams = {
        name: formData.firstName,
        phone: formData.phoneNumber,
      };
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
    try {
      const person = await fetchPersonById(id);
      setSelectedPersonForView(person);
      setViewMode("detail");
    } catch (error) {
      console.error("Error fetching person details:", error);
      showError("Error loading person details. Please try again.");
    }
  };

  const handleBackToTable = () => {
    setViewMode("table");
    setSelectedPersonForView(null);
  };

  return (
    <div className="container-fluid p-4 bg-body-secondary min-vh-100">
      <Toast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />

      <div className="mb-4">
        <div className="bg-primary text-white p-3 px-4 rounded-3 mb-4 shadow-sm">
          <h3 className="mb-2 fw-bold">Person Management</h3>
          <p className="mb-0 opacity-75">
            Manage person records with authentication and API integration
          </p>
        </div>
      </div>

      <div className="row g-4">
        {viewMode === "table" && (
          <>
            <div className="col-lg-3">
              <PersonForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                resetSearch={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            <div className="col-lg-9">
              {loading ? (
                <div
                  className="card border-0 shadow-sm d-flex justify-content-center align-items-center"
                  style={{ minHeight: "75vh" }}
                >
                  <div className="text-center">
                    <div
                      className="spinner-border spinner-border-lg text-primary mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading persons...</p>
                  </div>
                </div>
              ) : (
                <Table
                  title="Persons"
                  headings={[
                    "First Name",
                    "Last Name",
                    "Age",
                    "Phone Number",
                    "Created",
                  ]}
                  importantHeadings={["First Name", "Phone Number"]}
                  importantKeys={["firstName", "phoneNumber"]}
                  data={persons}
                  excludedKeys={["id", "tag"]}
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
                  onPersonRowClick={handlePersonRowClick}
                />
              )}
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
