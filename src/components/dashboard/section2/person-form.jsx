import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { validatePersonField } from "../../../utils/validation";
import { FaFilter, FaPlus, FaSearch, FaTimes } from "react-icons/fa";

const PersonForm = ({
  formData,
  setFormData,
  handleSubmit,
  resetSearch,
  hasActiveFilters = false,
  isSubmitting = false,
}) => {
  const [mode, setMode] = useState("add");
  const isAdd = mode === "add";

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = validatePersonField(id, value, formData[id]);
    setFormData({ ...formData, [id]: newValue });
  };

  // `half` fields sit two-per-row to keep the form short enough to fit
  const renderField = ({
    id,
    label,
    required = false,
    half = false,
    ...inputProps
  }) => (
    <div className={half ? "col-6" : "col-12"}>
      <label htmlFor={id} className="form-label fw-medium mb-1 small">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        type="text"
        className="form-control form-control-sm"
        id={id}
        value={formData[id]}
        onChange={handleChange}
        required={required}
        disabled={isSubmitting}
        {...inputProps}
      />
    </div>
  );

  return (
    <div className="card border-0 overflow-hidden panel-card">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-semibold">
            {isAdd ? "Add Person" : "Search Person"}
          </h5>
          {!isAdd && hasActiveFilters && (
            <span className="badge rounded-pill text-bg-warning d-flex align-items-center gap-1">
              <FaFilter size={9} />
              Active
            </span>
          )}
        </div>
        <p className="text-body-secondary mb-0 small mt-1">
          {isAdd
            ? "Create a new person record"
            : hasActiveFilters
              ? "Filters are currently applied to the results"
              : "Find by name, phone number, or both"}
        </p>
      </div>

      <div className="card-body p-3 d-flex flex-column overflow-auto">
        <div className="btn-group mb-3 w-100" role="group" aria-label="Mode">
          <input
            type="radio"
            className="btn-check"
            name="person-form-mode"
            id="mode-add"
            checked={isAdd}
            onChange={() => setMode("add")}
          />
          <label
            className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2"
            htmlFor="mode-add"
          >
            <FaPlus size={11} />
            Add
          </label>
          <input
            type="radio"
            className="btn-check"
            name="person-form-mode"
            id="mode-search"
            checked={!isAdd}
            onChange={() => setMode("search")}
          />
          <label
            className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2"
            htmlFor="mode-search"
          >
            <FaSearch size={11} />
            Search
          </label>
        </div>

        <form onSubmit={(e) => handleSubmit(e, mode)} className="flex-grow-1">
          <div className="row g-2 gy-3">
            {renderField({
              id: "firstName",
              label: "First Name",
              required: isAdd,
              half: isAdd,
              placeholder: isAdd ? "Jane" : "Search by name",
              autoComplete: "off",
            })}

            {isAdd &&
              renderField({
                id: "lastName",
                label: "Last Name",
                half: true,
                placeholder: "Doe",
                autoComplete: "off",
              })}

            {renderField({
              id: "phoneNumber",
              label: "Phone Number",
              required: isAdd,
              placeholder: isAdd ? "e.g. +15551234567" : "Search by phone",
              inputMode: "tel",
              autoComplete: "off",
            })}

            {isAdd &&
              renderField({
                id: "age",
                label: "Age",
                required: true,
                half: true,
                placeholder: "0–120",
                inputMode: "numeric",
                autoComplete: "off",
              })}

            {isAdd &&
              renderField({
                id: "tag",
                label: "Tag",
                half: true,
                placeholder: "Optional",
                autoComplete: "off",
              })}
          </div>

          <div className="d-flex flex-column gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner size="sm" className="text-reset" />
              ) : isAdd ? (
                <FaPlus size={12} />
              ) : (
                <FaSearch size={12} />
              )}
              {isAdd ? (isSubmitting ? "Adding..." : "Add Person") : "Search"}
            </button>
            {!isAdd && hasActiveFilters && (
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                onClick={resetSearch}
              >
                <FaTimes size={12} />
                Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
