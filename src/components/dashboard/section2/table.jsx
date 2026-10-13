import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaEdit,
  FaExclamationTriangle,
  FaFilter,
  FaTimes,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import PersonDetails from "./person-details.jsx";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { validatePersonField } from "../../../utils/validation";

const Table = ({
  title,
  columns,
  data,
  loading = false,
  initialLoading = false,
  error = false,
  onRetry,
  currentPage,
  totalPages,
  onPageChange,
  deleteItem,
  updatePersonInList,
  onPersonClick,
  onPersonUpdate,
  showSuccess,
  showError,
  hasActiveFilters = false,
  onClearFilters,
  onPersonRowClick,
  openingPersonId = null,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editablePerson, setEditablePerson] = useState(null);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const visibleColumns = isMobile
    ? columns.filter((column) => column.important)
    : columns;

  const handleEditClick = async (id) => {
    // Open the modal straight away and show a spinner while loading
    setEditingId(id);
    setEditablePerson(null);
    try {
      const person = await onPersonClick(id);
      setEditablePerson(person);
    } catch (error) {
      console.error("Error fetching person details:", error);
      showError("Error loading person details. Please try again.");
      setEditingId(null);
    }
  };

  const handleClose = () => {
    setEditingId(null);
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
      return { success: true };
    } catch (error) {
      console.error("Error updating person details:", error);
      return { success: false, error };
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteItem(personToDelete.id);
    setIsDeleting(false);
    setPersonToDelete(null);
  };

  const renderBody = () => {
    if (initialLoading) {
      return (
        <div className="empty-state">
          <Spinner className="spinner-border-lg mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mb-0">Loading persons...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="empty-state">
          <span className="icon-badge text-danger bg-danger-subtle">
            <FaExclamationTriangle size={18} />
          </span>
          <p className="fw-semibold text-body mb-1">Couldn't load persons</p>
          <p className="small mb-3">
            Something went wrong while contacting the API.
          </p>
          <Button size="sm" variant="outline-primary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="empty-state">
          <span className="icon-badge">
            {hasActiveFilters ? <FaFilter size={18} /> : <FaUsers size={18} />}
          </span>
          <p className="fw-semibold text-body mb-1">
            {hasActiveFilters ? "No matching records" : "No persons yet"}
          </p>
          <p className="small mb-3">
            {hasActiveFilters
              ? "Try adjusting or clearing your search filters."
              : "Use the form to add your first person."}
          </p>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={onClearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      );
    }

    return (
      <table
        className={`table table-hover mb-0 ${onPersonRowClick ? "table-clickable" : ""} ${loading ? "table-loading" : ""}`}
        aria-busy={loading}
      >
        <thead className="sticky-top">
          <tr>
            {visibleColumns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="py-2 px-3 fw-semibold text-uppercase"
              >
                {column.label}
              </th>
            ))}
            <th scope="col" className="py-2 px-3 text-uppercase text-end">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onPersonRowClick && onPersonRowClick(item.id)}
              className={openingPersonId === item.id ? "table-active" : ""}
            >
              {visibleColumns.map((column, index) => (
                <td
                  key={column.key}
                  className={`py-2 px-3 small ${index === 0 ? "fw-medium" : "text-body-secondary"}`}
                >
                  {item[column.key] == null || item[column.key] === ""
                    ? "—"
                    : item[column.key]}
                </td>
              ))}
              <td className="py-1 px-2 text-end text-nowrap">
                {openingPersonId === item.id ? (
                  <Spinner size="sm" className="me-2" role="status">
                    <span className="visually-hidden">Opening...</span>
                  </Spinner>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item.id);
                      }}
                      title="Edit"
                      aria-label={`Edit ${item.firstName}`}
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPersonToDelete(item);
                      }}
                      title="Delete"
                      aria-label={`Delete ${item.firstName}`}
                    >
                      <FaTrash size={13} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const isFirstPage = currentPage === 0;
  const isLastPage = totalPages === 0 || currentPage === totalPages - 1;

  const renderPageButton = (label, icon, page, disabled) => (
    <li className={`page-item ${disabled ? "disabled" : ""}`}>
      <button
        type="button"
        className="page-link d-flex align-items-center h-100"
        onClick={() => onPageChange(page)}
        disabled={disabled || loading}
        aria-label={label}
        title={label}
      >
        {icon}
      </button>
    </li>
  );

  return (
    <div className="h-100">
      <div className="card border-0 overflow-hidden panel-card d-flex flex-column">
        <div className="card-header d-flex align-items-center justify-content-between gap-2">
          <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
            {title}
            {loading && !initialLoading && (
              <Spinner size="sm" role="status">
                <span className="visually-hidden">Refreshing...</span>
              </Spinner>
            )}
          </h5>
          {hasActiveFilters && (
            <span className="badge rounded-pill text-bg-warning d-flex align-items-center gap-1">
              <FaFilter size={9} />
              Filtered
              <button
                type="button"
                className="btn p-0 ms-1 lh-1 border-0"
                onClick={onClearFilters}
                aria-label="Clear filters"
                title="Clear filters"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
        </div>

        <div className="flex-grow-1 overflow-auto">{renderBody()}</div>

        {!initialLoading && !error && totalPages > 0 && (
          <div className="border-top px-3 py-2 d-flex align-items-center justify-content-between gap-2 bg-body-tertiary">
            <span className="small text-body-secondary">
              Page {currentPage + 1} of {totalPages}
            </span>
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                {renderPageButton(
                  "First page",
                  <FaAngleDoubleLeft />,
                  0,
                  isFirstPage,
                )}
                {renderPageButton(
                  "Previous page",
                  <FaAngleLeft />,
                  currentPage - 1,
                  isFirstPage,
                )}
                {renderPageButton(
                  "Next page",
                  <FaAngleRight />,
                  currentPage + 1,
                  isLastPage,
                )}
                {renderPageButton(
                  "Last page",
                  <FaAngleDoubleRight />,
                  totalPages - 1,
                  isLastPage,
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>

      <PersonDetails
        show={editingId !== null}
        isLoading={editablePerson === null}
        editablePerson={editablePerson}
        handleInputChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleClose={handleClose}
        showSuccess={showSuccess}
        showError={showError}
      />

      <Modal
        show={personToDelete !== null}
        onHide={() => !isDeleting && setPersonToDelete(null)}
        centered
        size="sm"
      >
        <Modal.Body className="p-4 text-center">
          <span className="icon-badge text-danger bg-danger-subtle mb-3">
            <FaTrash size={16} />
          </span>
          <h5 className="fw-semibold">Delete person?</h5>
          <p className="text-body-secondary small mb-0">
            <strong className="text-body">
              {[personToDelete?.firstName, personToDelete?.lastName]
                .filter(Boolean)
                .join(" ")}
            </strong>{" "}
            will be permanently removed. This can't be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4 d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="flex-grow-1"
            onClick={() => setPersonToDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-grow-1"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Spinner size="sm" className="me-2 text-white" />}
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Table;
