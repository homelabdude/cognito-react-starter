import { useEffect } from "react";
import { Toast as BootstrapToast } from "react-bootstrap";

const Toast = ({
  show,
  message,
  variant = "success",
  onClose,
  delay = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 9999,
        minWidth: "300px",
      }}
    >
      <BootstrapToast
        show={show}
        onClose={onClose}
        bg={variant}
        autohide={false}
      >
        <BootstrapToast.Header closeButton>
          <strong className="me-auto">
            {variant === "success" ? "Success" : "Error"}
          </strong>
        </BootstrapToast.Header>
        <BootstrapToast.Body
          className={variant === "success" ? "text-white" : ""}
        >
          {message}
        </BootstrapToast.Body>
      </BootstrapToast>
    </div>
  );
};

export default Toast;
