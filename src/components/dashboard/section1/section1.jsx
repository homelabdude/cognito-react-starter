import { useState } from "react";
import { FaCheck, FaCopy, FaIdCard, FaKey } from "react-icons/fa";

// Standard JWT claims that hold epoch-second timestamps
const TIMESTAMP_CLAIMS = ["exp", "iat", "auth_time", "nbf"];

const formatClaim = (key, value) => {
  if (TIMESTAMP_CLAIMS.includes(key) && typeof value === "number") {
    return new Date(value * 1000).toLocaleString();
  }
  if (Array.isArray(value)) return value.join(", ");
  if (value !== null && typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <button
      type="button"
      className="btn-icon"
      onClick={handleCopy}
      disabled={!text}
      aria-label={copied ? "Copied" : "Copy access token"}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? <FaCheck size={13} /> : <FaCopy size={13} />}
    </button>
  );
};

const CardTitle = ({ icon, children, action }) => (
  <div
    className="d-flex align-items-center justify-content-between mb-3"
    style={{ minHeight: "2rem" }}
  >
    <h5 className="d-flex align-items-center gap-2 fw-semibold mb-0">
      <span className="text-primary">{icon}</span>
      {children}
    </h5>
    {action}
  </div>
);

const Placeholder = ({ lines }) => (
  <div className="placeholder-glow" aria-hidden="true">
    {Array.from({ length: lines }, (_, i) => (
      <span
        key={i}
        className="placeholder rounded d-block mb-2"
        style={{ width: `${60 + ((i * 17) % 40)}%`, height: "1.1rem" }}
      />
    ))}
  </div>
);

const SectionOne = ({ tokens, loading }) => {
  const claims = tokens.idToken?.payload
    ? Object.entries(tokens.idToken.payload)
    : [];
  const accessToken = tokens.accessToken?.toString?.() || "";

  return (
    <div className="container-fluid p-3 p-md-4">
      <div className="page-header hero-gradient">
        <h3 className="mb-1 fw-bold">Token Information</h3>
        <p className="mb-0">
          View ID token details and access token from AWS Cognito authentication
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 h-100">
            <div className="card-body p-4">
              <CardTitle icon={<FaIdCard />}>ID Token Details</CardTitle>
              {loading ? (
                <Placeholder lines={8} />
              ) : claims.length === 0 ? (
                <p className="text-body-secondary mb-0">
                  No ID token claims available.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <tbody>
                      {claims.map(([key, value]) => (
                        <tr key={key}>
                          <td className="fw-semibold small text-nowrap w-25 pe-3">
                            {key}
                          </td>
                          <td className="text-body-secondary text-break small">
                            {formatClaim(key, value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 h-100">
            <div className="card-body p-4">
              <CardTitle
                icon={<FaKey />}
                action={<CopyButton text={accessToken} />}
              >
                Access Token
              </CardTitle>
              {loading ? (
                <Placeholder lines={6} />
              ) : accessToken ? (
                <div className="code-block">
                  <span className="text-body-secondary">Bearer </span>
                  {accessToken}
                </div>
              ) : (
                <p className="text-body-secondary mb-0">
                  No access token available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
