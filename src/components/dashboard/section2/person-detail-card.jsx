import { FaArrowLeft } from "react-icons/fa";

const PersonDetailCard = ({ person, onBack }) => {
  return (
    <div
      className="card border-0 shadow-sm overflow-hidden"
      style={{ minHeight: "75vh" }}
    >
      <div className="card-body p-3 d-flex flex-column">
        <div className="p-1 mb-4">
          <button
            className="btn btn-outline-primary btn-sm mb-3"
            onClick={onBack}
          >
            <FaArrowLeft className="me-2" size={12} />
            Back to List
          </button>
          <h5 className="mb-0 fw-bold text-primary">{person.firstName}</h5>
        </div>

        <div className="flex-grow-1">
          <p className="text-muted">
            Here's where you start doing awesome things for user object:{" "}
            {person.firstName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailCard;
