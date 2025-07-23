import { apiProcesser, authEP } from "../../helpers/axiosHelpers.js";

// /auth/signup
export const postNewUser = (userObj) =>
  apiProcesser({
    method: "post",
    url: authEP + "/signup",
    data: userObj,
  });

// /auth/login
export const loginUser = (credObj) =>
  apiProcesser({
    method: "post",
    url: authEP + "/login",
    data: credObj,
  });

////
export const fetchProfile = () =>
  apiProcesser({
    method: "get",
    url: authEP + "/profile",
    isPrivate: true,
  });
