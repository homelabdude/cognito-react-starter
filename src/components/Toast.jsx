import { Toast as BootstrapToast, ToastContainer } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Toast = ({
  show,
  message,
  variant = "success",
  onClose,
  delay = 3000,
}) => {
  const isSuccess = variant === "success";
  const Icon = isSuccess ? FaCheckCircle : FaExclamationCircle;

  return (
    <ToastContainer
      position="top-end"
      className="p-3 position-fixed"
      style={{ zIndex: 1090 }}
    >
      <BootstrapToast
        show={show}
        onClose={onClose}
        bg={variant}
        delay={delay}
        autohide
      >
        <div className="d-flex align-items-start gap-2 p-3 text-white">
          <Icon className="flex-shrink-0 mt-1" size={16} aria-hidden="true" />
          <div className="flex-grow-1">
            <div className="fw-semibold">{isSuccess ? "Success" : "Error"}</div>
            <div className="small">{message}</div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white flex-shrink-0"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </BootstrapToast>
    </ToastContainer>
  );
};

export default Toast;
