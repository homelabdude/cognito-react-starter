import { useState } from "react";
import { FaTrash, FaEdit, FaFilter } from "react-icons/fa";
import PersonDetails from "./person-details.jsx";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { validatePersonField } from "../../../utils/validation";

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
  updatePersonInList,
  onPersonClick,
  onPersonUpdate,
  showSuccess,
  showError,
  hasActiveFilters = false,
  onPersonRowClick,
}) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editablePerson, setEditablePerson] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleNameClick = async (id) => {
    setIsLoading(true);
    try {
      const person = await onPersonClick(id);
      setSelectedPerson(person);
      setEditablePerson(person);
    } catch (error) {
      console.error("Error fetching person details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPerson(null);
    setEditablePerson(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = validatePersonField(name, value, editablePerson[name]);
    setEditablePerson((prevPerson) => ({ ...prevPerson, [name]: newValue }));
  };

  const handleUpdate = async () => {
    try {
      const updatedPerson = await onPersonUpdate(
        editablePerson.id,
        editablePerson,
      );
      updatePersonInList(updatedPerson);
      setSelectedPerson(updatedPerson);
      return { success: true };
    } catch (error) {
      console.error("Error updating person details:", error);
      return { success: false, error };
    }
  };

  const renderCell = (item, key) => (
    <td key={key} className="py-2 px-2 small">
      <span >{item[key]}</span>
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

  const renderTable = () => (
    <div
      className="card border-0 shadow-sm overflow-hidden"
      style={{ minHeight: "75vh", maxHeight: "75vh" }}
    >
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="p-1 pb-2">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-1 fw-semibold text-primary">{title}</h5>
            {hasActiveFilters && (
              <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                <FaFilter size={10} />
                Filtered
              </span>
            )}
          </div>
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
                    className="py-2 px-2 border-bottom text-center text-uppercase text-muted"
                    style={{ width: "80px" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => onPersonRowClick && onPersonRowClick(item.id)}
                    style={{ cursor: onPersonRowClick ? 'pointer' : 'default' }}
                    className="person-row"
                  >
                    {Object.keys(item)
                      .filter((key) => !excludedKeys.includes(key))
                      .map((key) =>
                        isMobile
                          ? renderMobileCell(item, key)
                          : renderDesktopCell(item, key),
                      )}
                    <td className="py-2 px-2 text-center">
                      <button
                        className="btn btn-link p-0 m-0 text-primary me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNameClick(item.id);
                        }}
                        title="Edit"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        className="btn btn-link p-0 m-0 text-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
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
      {renderTable()}

      {editablePerson && (
        <PersonDetails
          show={!!selectedPerson}
          isLoading={isLoading}
          editablePerson={editablePerson}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdate}
          handleClose={handleClose}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
    </div>
  );
};

export default Table;
