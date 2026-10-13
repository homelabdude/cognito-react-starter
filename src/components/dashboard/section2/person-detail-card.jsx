import { FaArrowLeft } from "react-icons/fa";
import { formatDate } from "../../../utils/utils";

const DETAIL_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "age", label: "Age" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "tag", label: "Tag" },
  { key: "createTime", label: "Created", format: formatDate },
];

const PersonDetailCard = ({ person, onBack }) => {
  const fullName = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(" ");
  const initials = [person.firstName, person.lastName]
    .filter(Boolean)
    .map((name) => name[0].toUpperCase())
    .join("");

  return (
    <div className="card border-0 overflow-hidden">
      <div className="card-header d-flex align-items-center gap-3 py-3 px-4 bg-transparent">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={onBack}
        >
          <FaArrowLeft size={11} />
          Back to list
        </button>
      </div>

      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <span
            className="icon-badge fs-5 fw-bold rounded-circle"
            style={{ width: "3.5rem", height: "3.5rem" }}
          >
            {initials || "?"}
          </span>
          <div style={{ minWidth: 0 }}>
            <h4 className="mb-0 fw-bold text-truncate">{fullName}</h4>
            {person.tag && (
              <span className="badge rounded-pill bg-primary-subtle text-primary mt-1">
                {person.tag}
              </span>
            )}
          </div>
        </div>

        <dl className="row g-3 mb-4">
          {DETAIL_FIELDS.map(({ key, label, format }) => (
            <div className="col-sm-6 col-lg-4" key={key}>
              <div className="p-3 rounded-3 bg-body-tertiary border h-100">
                <dt className="small text-body-secondary fw-normal mb-1">
                  {label}
                </dt>
                <dd className="mb-0 fw-medium text-break">
                  {person[key] == null || person[key] === ""
                    ? "—"
                    : format
                      ? format(person[key])
                      : person[key]}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <p className="text-body-secondary small mb-0">
          Here's where you start doing awesome things for user object:{" "}
          {person.firstName}
        </p>
      </div>
    </div>
  );
};

export default PersonDetailCard;
