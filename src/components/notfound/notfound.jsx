import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="text-center" style={{ maxWidth: "28rem" }}>
        <p className="fw-bold text-primary mb-2">404</p>
        <h1 className="h2 fw-bold mb-3">Page not found</h1>
        <p className="text-body-secondary mb-4">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft size={12} />
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
