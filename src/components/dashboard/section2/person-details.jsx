import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

// Edit fields; ids are prefixed so they don't clash with the add form
const FIELDS = [
  { name: "firstName", label: "First Name", autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", autoComplete: "family-name" },
  { name: "age", label: "Age", inputMode: "numeric" },
  {
    name: "phoneNumber",
    label: "Phone Number",
    inputMode: "tel",
    autoComplete: "tel",
  },
];

const PersonDetails = ({
  show,
  isLoading,
  editablePerson,
  handleInputChange,
  handleUpdate,
  handleClose,
  showSuccess,
  showError,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateWithMessage = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await handleUpdate();
    setIsSaving(false);
    if (result.success) {
      showSuccess("Person details successfully updated!");
      handleClose();
    } else {
      // Handle 409 Conflict with specific error message
      if (
        result.error?.response?.status === 409 &&
        result.error?.response?.data?.message
      ) {
        showError(result.error.response.data.message);
      } else {
        showError("Error updating details. Please try again.");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => !isSaving && handleClose()}
      centered
      size="lg"
    >
      <form onSubmit={handleUpdateWithMessage}>
        <Modal.Header closeButton>
          <Modal.Title as="h5" className="fw-semibold">
            Edit Person Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="row g-3">
              {FIELDS.map(({ name, label, ...inputProps }) => (
                <div className="col-md-6" key={name}>
                  <label
                    htmlFor={`edit-${name}`}
                    className="form-label fw-medium small"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`edit-${name}`}
                    name={name}
                    value={editablePerson[name] ?? ""}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    {...inputProps}
                  />
                </div>
              ))}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || isSaving}
          >
            {isSaving && <Spinner size="sm" className="me-2 text-reset" />}
            {isSaving ? "Saving..." : "Update Details"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default PersonDetails;
