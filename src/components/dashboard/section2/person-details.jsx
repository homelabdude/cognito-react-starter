import { Modal, Button } from "react-bootstrap";

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
  const handleUpdateWithMessage = async () => {
    const result = await handleUpdate();
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
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">Edit Person Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label fw-medium small">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={editablePerson.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label fw-medium small">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={editablePerson.lastName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="age" className="form-label fw-medium small">
                Age
              </label>
              <input
                type="text"
                className="form-control"
                id="age"
                name="age"
                value={editablePerson.age}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="phoneNumber"
                className="form-label fw-medium small"
              >
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={editablePerson.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdateWithMessage}>
          Update Details
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PersonDetails;
