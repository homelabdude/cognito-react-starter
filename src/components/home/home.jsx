import { Link } from "react-router";

const Home = () => {
  return (
    <div className="container-fluid p-0">
      {/* Top Banner */}
      <div className="row g-0">
        <div
          className="col bg-primary d-flex justify-content-center align-items-center text-white"
          style={{ minHeight: "50vh" }}
        >
          <h1 className="fw-bold">Welcome to your home page</h1>
        </div>
      </div>

      {/* Go to Dashboard Button */}
      <Link
        to="/dashboard"
        className="btn btn-primary position-absolute top-0 end-0 m-3 shadow-sm fw-semibold"
      >
        Dashboard
      </Link>

      {/* Text Sections */}
      <div className="row mt-5 px-3">
        <div className="col-md-6">
          <h2>[Section 1]</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            feugiat lorem, ut ultrices sapien.
          </p>
        </div>
        <div className="col-md-6">
          <h2>[Section 2]</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            feugiat lorem, ut ultrices sapien.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
