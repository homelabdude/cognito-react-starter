import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import PersonDetails from "./person-details";

const apiUrl = process.env.REACT_APP_BACKEND_APP_API_BASE_URL;

const Table = ({
  title,
  headings,
  data,
  excludedKeys,
  currentPage,
  totalPages,
  onPageChange,
  deleteItem,
  importantKeys,
  importantHeadings,
  tokens,
  updateData,
}) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editablePerson, setEditablePerson] = useState(null);

  const handleNameClick = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}v1/persons/${id}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken?.toString?.() || ""}`,
        },
      });
      setSelectedPerson(response.data);
      setEditablePerson(response.data);
    } catch (error) {
      console.error("Error fetching person details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedPerson(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "firstName" || name === "lastName" || name === "tag") {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "age") {
      newValue = value.replace(/\D/g, "");
      if (
        newValue !== "" &&
        (parseInt(newValue) < 0 || parseInt(newValue) > 120)
      ) {
        newValue = editablePerson.age;
      }
    } else if (name === "phoneNumber") {
      newValue = value.replace(/(?:\+|(?!^))\+|[^+\d]/g, "");
      if (newValue.length > 20) {
        newValue = newValue.substring(0, 20);
      }
    }

    setEditablePerson((prevPerson) => ({ ...prevPerson, [name]: newValue }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}v1/persons/${editablePerson.id}`,
        editablePerson,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken?.toString?.() || ""}`,
          },
        },
      );
      updateData(response.data);
      setSelectedPerson(response.data);
      return true;
    } catch (error) {
      console.error("Error updating person details:", error);
      return false;
    }
  };

  const renderCell = (item, key) => (
    <td key={key} className="py-2 px-2 small">
      {key === "firstName" ? (
        <button
          className="btn btn-link p-0 m-0 text-decoration-none text-primary fw-medium"
          onClick={() => handleNameClick(item.id)}
        >
          {item[key]}
        </button>
      ) : (
        <span className="text-secondary">{item[key]}</span>
      )}
    </td>
  );

  const renderHeading = (heading, index) => (
    <th
      key={index}
      className="py-2 px-2 fw-semibold text-uppercase text-muted border-bottom small"
    >
      {heading}
    </th>
  );

  const renderMobileCell = (item, key) => {
    if (importantKeys && importantKeys.length > 0) {
      if (importantKeys.includes(key)) {
        return renderCell(item, key);
      }
    } else {
      return renderCell(item, key);
    }
    return null;
  };

  const renderMobileHeading = (heading, index) => {
    if (importantHeadings && importantHeadings.length > 0) {
      if (importantHeadings.includes(heading)) {
        return renderHeading(heading, index);
      }
    } else {
      return renderHeading(heading, index);
    }
    return null;
  };

  const renderDesktopCell = (item, key) => renderCell(item, key);
  const renderDesktopHeading = (heading, index) =>
    renderHeading(heading, index);

  const isMobile = window.innerWidth <= 768;

  const renderTable = () => (
    <div
      className="card border-0 shadow-sm overflow-hidden"
      style={{ minHeight: "75vh", maxHeight: "75vh" }}
    >
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="p-1 pb-2">
          <h5 className="mb-1 fw-semibold text-primary">{title}</h5>
        </div>

        <div className="flex-grow-1 overflow-auto">
          {data.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No records found</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="sticky-top bg-body">
                <tr>
                  {isMobile
                    ? headings.map((heading, index) =>
                        renderMobileHeading(heading, index),
                      )
                    : headings.map((heading, index) =>
                        renderDesktopHeading(heading, index),
                      )}
                  <th
                    className="py-2 px-2 border-bottom"
                    style={{ width: "50px" }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {Object.keys(item)
                      .filter((key) => !excludedKeys.includes(key))
                      .map((key) =>
                        isMobile
                          ? renderMobileCell(item, key)
                          : renderDesktopCell(item, key),
                      )}
                    <td className="py-2 px-2 text-center">
                      <button
                        className="btn btn-link p-0 m-0 text-danger"
                        onClick={() => deleteItem(item.id)}
                        title="Delete"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-top p-2 bg-body-tertiary">
          <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm mb-0 justify-content-center">
              <li
                className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
              >
                <button
                  className="page-link small"
                  onClick={() => onPageChange(0)}
                  disabled={currentPage === 0}
                >
                  First
                </button>
              </li>
              <li
                className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
              >
                <button
                  className="page-link small"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link small">
                  Page {currentPage + 1} of {totalPages || 1}
                </span>
              </li>
              <li
                className={`page-item ${totalPages === 0 || currentPage === totalPages - 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link small"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={totalPages === 0 || currentPage === totalPages - 1}
                >
                  Next
                </button>
              </li>
              <li
                className={`page-item ${totalPages === 0 || currentPage === totalPages - 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link small"
                  onClick={() => onPageChange(totalPages - 1)}
                  disabled={totalPages === 0 || currentPage === totalPages - 1}
                >
                  Last
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {!selectedPerson ? (
        renderTable()
      ) : (
        <PersonDetails
          isLoading={isLoading}
          editablePerson={editablePerson}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdate}
          handleBack={handleBack}
        />
      )}
    </div>
  );
};

export default Table;
