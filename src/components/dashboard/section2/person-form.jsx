import { useState } from "react";
import { validatePersonField } from "../../../utils/validation";
import { FaFilter, FaTimes } from "react-icons/fa";

const PersonForm = ({
  formData,
  setFormData,
  handleSubmit,
  resetSearch,
  hasActiveFilters = false,
}) => {
  const [mode, setMode] = useState("add");

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = validatePersonField(id, value, formData[id]);
    setFormData({ ...formData, [id]: newValue });
  };

  return (
    <div
      className="card border-0 shadow-sm overflow-hidden"
      style={{ minHeight: "75vh", maxHeight: "75vh" }}
    >
      <div className="card-body p-3 d-flex flex-column overflow-auto">
        <div className="p-1 pb-2">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-1 fw-semibold text-primary">
              {mode === "add" ? "Add Person" : "Search Person"}
            </h5>
            {mode === "search" && hasActiveFilters && (
              <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                <FaFilter size={10} />
                Active
              </span>
            )}
          </div>
          <p className="text-muted mb-0 small">
            {mode === "add"
              ? "Create a new person record"
              : hasActiveFilters
                ? "Filters are currently applied to the results"
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
              onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
              onChange={handleChange}
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
                onChange={handleChange}
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
            {mode === "search" && hasActiveFilters && (
              <button
                type="button"
                className="btn btn-sm flex-grow-1 ${hasActiveFilters btn-warning"
                onClick={resetSearch}
              >
                {hasActiveFilters && <FaTimes className="me-1" size={12} />}
                {hasActiveFilters ? "Clear Filters" : "Reset"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
