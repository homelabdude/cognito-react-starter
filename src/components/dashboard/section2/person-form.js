import { useState } from "react";

const PersonForm = ({
  formData,
  setFormData,
  handleSubmit,
  successMessage,
  errorMessage,
  resetSearch,
}) => {
  const [mode, setMode] = useState("add");

  const handleChange = (e, formData, setFormData) => {
    const { id, value } = e.target;
    let newValue = value;

    if (id === "firstName" || id === "lastName" || id === "tag") {
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
      if (newValue.length > 20) {
        newValue = newValue.substring(0, 20);
      }
    } else if (id === "age") {
      newValue = value.replace(/\D/g, "");
      if (
        newValue !== "" &&
        (parseInt(newValue) < 0 || parseInt(newValue) > 120)
      ) {
        newValue = formData.age;
      }
    } else if (id === "phoneNumber") {
      newValue = value.replace(/(?:\+|(?!^))\+|[^+\d]/g, "");
      if (newValue.length > 20) {
        newValue = newValue.substring(0, 20);
      }
    }

    setFormData({ ...formData, [id]: newValue });
  };

  return (
    <div
      className="card border-0 shadow-sm overflow-hidden"
      style={{ minHeight: "75vh", maxHeight: "75vh" }}
    >
      <div className="card-body p-3 d-flex flex-column overflow-auto">
        <div className="p-1 pb-2">
          <h5 className="mb-1 fw-semibold text-primary">
            {mode === "add" ? "Add Person" : "Search Person"}
          </h5>
          <p className="text-muted mb-0 small">
            {mode === "add"
              ? "Create a new person record"
              : "Find existing person records"}
          </p>
        </div>

        <div className="btn-group mb-3 w-100" role="group">
          <button
            type="button"
            className={`btn ${mode === "add" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setMode("add")}
          >
            Add
          </button>
          <button
            type="button"
            className={`btn ${mode === "search" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setMode("search")}
          >
            Search
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, mode)} className="flex-grow-1">
          <div className="mb-2">
            <label
              htmlFor="firstName"
              className="form-label fw-medium mb-1 small"
            >
              First Name{" "}
              {mode === "add" && <span className="text-danger">*</span>}
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange(e, formData, setFormData)}
              required
              placeholder="Enter first name"
            />
          </div>

          {mode === "add" && (
            <>
              <div className="mb-2">
                <label
                  htmlFor="lastName"
                  className="form-label fw-medium mb-1 small"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange(e, formData, setFormData)}
                  placeholder="Enter last name"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="age"
                  className="form-label fw-medium mb-1 small"
                >
                  Age <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleChange(e, formData, setFormData)}
                  required
                  placeholder="Enter age (0-120)"
                />
              </div>
            </>
          )}

          <div className="mb-2">
            <label
              htmlFor="phoneNumber"
              className="form-label fw-medium mb-1 small"
            >
              Phone Number{" "}
              {mode === "add" && <span className="text-danger">*</span>}
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange(e, formData, setFormData)}
              required
              placeholder="Enter phone number"
            />
          </div>

          {mode === "add" && (
            <div className="mb-2">
              <label htmlFor="tag" className="form-label fw-medium mb-1 small">
                Tag
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="tag"
                value={formData.tag}
                onChange={(e) => handleChange(e, formData, setFormData)}
                placeholder="Enter tag (optional)"
              />
            </div>
          )}

          <div className="d-flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-sm flex-grow-1 btn-primary"
            >
              {mode === "add" ? "Add Person" : "Search"}
            </button>
            {mode === "search" && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary flex-grow-1"
                onClick={resetSearch}
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {(successMessage || errorMessage) && (
          <div className="mt-2">
            {successMessage && (
              <div className="alert alert-success py-2 mb-0 small" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger py-2 mb-0 small" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonForm;
