import { toast } from "react-toastify";
import { setUser, logout } from "./userSlice.js";
import { postNewUser, loginUser, fetchProfile } from "./userAxios.js";

export const userSignupAction = (obj) => async () => {
  const p = postNewUser(obj);
  toast.promise(p, { pending: "Signing up…" });
  return p;
};

export const userSignInAction = (cred) => async (dispatch) => {
  try {
    const { status, message, accessJWT, refreshJWT } = await loginUser(cred);
    toast[status](message);
    if (status == "success") {
      sessionStorage.setItem("accessJWT", accessJWT);
      localStorage.setItem("refreshJWT", refreshJWT);
      const { user } = await fetchProfile();
      dispatch(setUser(user));
      return { status: "success" };
    } else {
      return { status: "error" };
    }
  } catch (e) {
    return { status: "error" };
  }
};

export const userLogoutAction = () => (d) => {
  sessionStorage.clear();
  localStorage.clear();
  d(logout());
};
