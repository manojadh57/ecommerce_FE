import { toast } from "react-toastify";
import { setUser, logout } from "./userSlice.js";
import { postNewUser, loginUser, fetchProfile } from "./userAxios.js";

//signnupp
export const userSignupAction = (formObj) => async () => {
  const pending = postNewUser(formObj);
  toast.promise(pending, { pending: "Signing up…" });
  return pending;
};

//login
export const userSignInAction = (credObj) => async (dispatch) => {
  try {
    // login
    const { accessJWT, refreshJWT } = await loginUser(credObj);

    // save token
    sessionStorage.setItem("accessJWT", accessJWT);
    localStorage.setItem("refreshJWT", refreshJWT);

    // fetch profile
    const { user } = await fetchProfile();
    dispatch(setUser(user));

    toast.success("Login success");
    return { status: "success" };
  } catch (err) {
    toast.error(err.message || "Invalid credentials");
    return { status: "error" };
  }
};

//logout helper//
export const userLogoutAction = () => (dispatch) => {
  sessionStorage.clear();
  localStorage.clear();
  dispatch(logout());
};
