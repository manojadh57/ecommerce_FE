import { toast } from "react-toastify";
import { setUser, logout } from "./userSlice.js";
import { postNewUser, loginUser } from "./userAxios.js";
import { apiProcesser, authEP } from "../../helpers/axiosHelpers.js";

//signup
export const userSignupAction = (userObj) => async () => {
  const p = postNewUser(userObj);
  toast.promise(p, { pending: "Signing up…" });
  return p;
};

//fetch user data
export const getUserDetailAction = () => async (dispatch) => {
  try {
    // GET /auth/profile 
    const res = await apiProcesser({
      method: "get",
      url: `${authEP}/profile`,
      isPrivate: true,
    });

    
    const user = res?.user ?? res?.data?.user ?? res?.data;
    if (user) dispatch(setUser(user));
    return user;
  } catch (e) {
    // If unauthorized, clear tokens and logout
    if (e?.response?.status === 401) {
      sessionStorage.removeItem("accessJWT");
      localStorage.removeItem("refreshJWT");
      dispatch(logout());
    }
    throw e;
  }
};

//login//
export const userSignInAction = (cred) => async (dispatch) => {
  try {
    const { status, message, tokens, user } = await loginUser(cred);

    // toast by status (success|error)
    toast[status || "info"](
      message || (status === "success" ? "Logged in" : "Login failed")
    );

    if (status === "success") {
      // Save JWTs
      if (tokens?.accessJWT)
        sessionStorage.setItem("accessJWT", tokens.accessJWT);
      if (tokens?.refreshJWT)
        localStorage.setItem("refreshJWT", tokens.refreshJWT);

      // Update Redux store with user info
      if (user) dispatch(setUser(user));

      return { status: "success" };
    }
    return { status: "error" };
  } catch (e) {
    toast.error(e?.message || "Login failed. Please try again.");
    return { status: "error" };
  }
};

//auto logion//

export const restoreSession = () => async (dispatch) => {
  try {
    const access = sessionStorage.getItem("accessJWT");
    const refresh = localStorage.getItem("refreshJWT");

    // If access exists, just pull profile
    if (access) {
      await dispatch(getUserDetailAction());
      return;
    }

    // If only refresh exists, mint a new access and then pull profile
    if (refresh) {
      const res = await apiProcesser({
        method: "post",
        url: `${authEP}/refresh-token`,
        data: { token: refresh },
      });

      const newAccess = res?.tokens?.accessJWT ?? res?.accessJWT;
      if (newAccess) {
        sessionStorage.setItem("accessJWT", newAccess);
        await dispatch(getUserDetailAction());
        return;
      }
    }

    // no valid tokens -> ensure logged out state
    dispatch(logout());
  } catch {
    sessionStorage.removeItem("accessJWT");
    localStorage.removeItem("refreshJWT");
    dispatch(logout());
  }
};

//logout//
export const userLogoutAction = () => (dispatch) => {
  try {
    sessionStorage.clear();
    localStorage.clear();
  } finally {
    dispatch(logout());
    toast.info("Logged out");
  }
};
