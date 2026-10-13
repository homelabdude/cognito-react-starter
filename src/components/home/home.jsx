import { Link } from "react-router";
import { FaArrowRight, FaLayerGroup, FaShieldAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero */}
      <header className="hero-gradient">
        <nav className="container d-flex align-items-center justify-content-between py-3">
          <span className="fw-bold fs-5">[Your App]</span>
          <Link
            to="/dashboard"
            className="btn btn-light btn-sm fw-semibold px-3 shadow-sm"
          >
            Dashboard
          </Link>
        </nav>

        <div className="container py-5 text-center text-md-start">
          <div className="py-md-5" style={{ maxWidth: "40rem" }}>
            <h1 className="display-5 fw-bold mb-3">
              Welcome to your home page
            </h1>
            <p className="lead mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>
              A React starter with AWS Cognito authentication, a protected
              dashboard and a dark mode that just works.
            </p>
            <Link
              to="/dashboard"
              className="btn btn-light btn-lg fw-semibold px-4 d-inline-flex align-items-center gap-2"
            >
              Get started
              <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Text Sections */}
      <main className="container flex-grow-1 py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card card-hover border-0 h-100">
              <div className="card-body p-4">
                <span className="icon-badge mb-3">
                  <FaShieldAlt size={18} />
                </span>
                <h2 className="h5 fw-semibold">[Section 1]</h2>
                <p className="text-body-secondary mb-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non feugiat lorem, ut ultrices sapien.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-hover border-0 h-100">
              <div className="card-body p-4">
                <span className="icon-badge mb-3">
                  <FaLayerGroup size={18} />
                </span>
                <h2 className="h5 fw-semibold">[Section 2]</h2>
                <p className="text-body-secondary mb-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non feugiat lorem, ut ultrices sapien.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-top py-4">
        <div className="container small text-body-secondary">
          © {new Date().getFullYear()} [Your App]
        </div>
      </footer>
    </div>
  );
};

export default Home;
