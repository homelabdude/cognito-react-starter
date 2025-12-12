import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="container-fluid p-0">
      {/* Top Banner */}
      <div className="row g-0">
        <div className="col bg-danger d-flex justify-content-center align-items-center text-white vh-50">
          <h1 className="text-center px-3">
            404 - Oops! The page you are looking for doesn't exist
          </h1>
        </div>
      </div>

      {/* Message */}
      <div className="row mt-5">
        <div
          className="col d-flex justify-content-center align-items-center text-danger"
          style={{ height: "30vh" }}
        >
          if you are lost,{" "}
          <Link to="/" className="text-danger fw-bold">
            Go Home
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default NotFound;
