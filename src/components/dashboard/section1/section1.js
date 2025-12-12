const SectionOne = ({ tokens }) => (
  <div className="p-4 bg-body-secondary min-vh-100">
    <div className="bg-primary text-white p-3 px-4 rounded-3 mb-4 shadow-sm">
      <h3 className="mb-2 fw-bold">Token Information</h3>
      <p className="mb-0 opacity-75">
        View ID token details and access token from AWS Cognito authentication
      </p>
    </div>

    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4">
            <h5 className="text-primary fw-semibold mb-3">ID Token Details</h5>
            {tokens.idToken && tokens.idToken.payload && (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <tbody>
                    {Object.entries(
                      JSON.parse(JSON.stringify(tokens.idToken.payload)),
                    ).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-semibold w-25">{key}</td>
                        <td className="text-secondary text-break small">
                          {value}
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
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body p-4">
            <h5 className="text-primary fw-semibold mb-3">Access Token</h5>
            <p className="text-secondary mb-0 text-break small lh-base">
              Bearer {tokens.accessToken?.toString?.() || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SectionOne;
