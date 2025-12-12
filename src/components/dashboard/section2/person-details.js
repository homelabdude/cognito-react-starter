import { useState } from "react";

const PersonDetails = ({
  isLoading,
  editablePerson,
  handleInputChange,
  handleUpdate,
  handleBack,
}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateWithMessage = async () => {
    const isSuccess = await handleUpdate();
    if (isSuccess) {
      setSuccessMessage("✔ Successfully updated!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("✖️ Error Updating Details.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  return (
    <div>
      <div
        className="card border-0 shadow-sm overflow-hidden"
        style={{ minHeight: "75vh", maxHeight: "75vh" }}
      >
        <div className="card-body p-4 d-flex flex-column overflow-auto">
          <div className="p-1 pb-2">
            <h5 className="mb-1 text-primary fw-semibold">Person Details</h5>
            <p className="text-muted small mb-0">Update person information</p>
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="flex-grow-1">
              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="firstName"
                    className="form-label fw-medium small"
                  >
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
                  <label
                    htmlFor="lastName"
                    className="form-label fw-medium small"
                  >
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

              {(successMessage || errorMessage) && (
                <div className="mt-4">
                  {successMessage && (
                    <div
                      className="alert alert-success d-flex align-items-center mb-0"
                      role="alert"
                    >
                      <span>{successMessage}</span>
                    </div>
                  )}
                  {errorMessage && (
                    <div
                      className="alert alert-danger d-flex align-items-center mb-0"
                      role="alert"
                    >
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex gap-3 mt-4 pt-3 border-top">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary ms-auto px-4"
                  onClick={handleUpdateWithMessage}
                >
                  Update Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
