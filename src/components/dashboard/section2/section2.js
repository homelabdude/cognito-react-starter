import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Table from "./table";
import { formatDate } from "../../../utils/utils";
import PersonForm from "./person-form";

const apiUrl = process.env.REACT_APP_BACKEND_APP_API_BASE_URL;

const SectionTwo = ({ tokens }) => {
  // ---------- States ------------
  const [persons, setPersons] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phoneNumber: "",
    tag: "",
  });

  // ----------- API Calls -----------
  const fetchData = useCallback(
    async (page = 0, searchParams = {}) => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams({
          page: page,
          size: 9,
          ...searchParams,
        }).toString();

        const response = await axios.get(`${apiUrl}v1/persons?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${tokens.accessToken?.toString?.() || ""}`,
          },
        });

        const formattedPersons = response.data.content.map((person) => ({
          ...person,
          createTime: formatDate(person.createTime),
        }));
        setPersons(formattedPersons);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [tokens.accessToken],
  );

  const postData = async () => {
    try {
      const response = await axios.post(`${apiUrl}v1/persons`, formData, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken?.toString?.() || ""}`,
        },
      });
      if (response.status === 200) {
        setErrorMessage("");
        setSuccessMessage("✔ Successfully added!");
        setTimeout(() => {
          setSuccessMessage("");
          setFormData({
            firstName: "",
            lastName: "",
            age: "",
            phoneNumber: "",
            tag: "",
          });
        }, 1000);
      }
      fetchData();
    } catch (error) {
      console.error("Error making API call:", error);
      setSuccessMessage("");
      setErrorMessage("✖️ Error adding person.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}v1/persons/${id}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken?.toString?.() || ""}`,
        },
      });
      if (response.status === 200) {
        fetchData(currentPage);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateData = (updatedPerson) => {
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
      fetchData(newPage);
    }
  };

  const handleSubmit = (e, mode) => {
    e.preventDefault();
    if (mode === "add") {
      postData();
    } else {
      fetchData(0, {
        name: formData.firstName,
        phone: formData.phoneNumber,
      });
    }
  };

  return (
    <div className="container-fluid p-4 bg-body-secondary min-vh-100">
      <div className="mb-4">
        <div className="bg-primary text-white p-3 px-4 rounded-3 mb-4 shadow-sm">
          <h3 className="mb-2 fw-bold">Person Management</h3>
          <p className="mb-0 opacity-75">
            Manage person records with authentication and API integration
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <PersonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            successMessage={successMessage}
            errorMessage={errorMessage}
            resetSearch={() => {
              setFormData({
                firstName: "",
                lastName: "",
                age: "",
                phoneNumber: "",
                tag: "",
              });
              fetchData();
            }}
          />
        </div>

        <div className="col-lg-8">
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
              updateData={updateData}
              tokens={tokens}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionTwo;
