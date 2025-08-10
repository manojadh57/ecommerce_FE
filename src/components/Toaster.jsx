import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toast.css";

export default function Toaster() {
  return (
    <ToastContainer
      position="top-left"
      transition={Slide}
      autoClose={2200}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      draggable={false}
      pauseOnHover
      // keep the container under your navbar
      style={{ top: "calc(var(--nav-h, 72px) + 12px)" }}
      // keep width tidy on desktop
      className="toast-container-left"
      theme="light"
    />
  );
}
