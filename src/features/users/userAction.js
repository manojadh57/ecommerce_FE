import { toast } from "react-toastify";
import { setUser, logout } from "./userSlice.js";
import { postNewUser, loginUser } from "./userAxios.js";

// SIGNUP ACTION
export const userSignupAction = (userObj) => async () => {
  const p = postNewUser(userObj);
  toast.promise(p, { pending: "Signing up…" });
  return p;
};

// LOGIN ACTION
export const userSignInAction = (cred) => async (dispatch) => {
  try {
    const { status, message, tokens, user } = await loginUser(cred);

    toast[status](message);

    if (status === "success") {
      // Save JWTs
      sessionStorage.setItem("accessJWT", tokens.accessJWT);
      localStorage.setItem("refreshJWT", tokens.refreshJWT);

      // Update Redux store with user info
      dispatch(setUser(user));

      return { status: "success" };
    } else {
      return { status: "error" };
    }
  } catch (e) {
    toast.error("Login failed. Please try again.");
    return { status: "error" };
  }
};

// LOGOUT ACTION
export const userLogoutAction = () => (dispatch) => {
  sessionStorage.clear();
  localStorage.clear();
  dispatch(logout());
};
