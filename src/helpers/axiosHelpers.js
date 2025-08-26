import axios from "axios";
import { toast } from "react-toastify";

const rootURL = import.meta.env.VITE_BASE_URL;
export const authEP = rootURL + "auth";
export const categoriesEP = rootURL + "categories";
export const productsEP = rootURL + "products";

//jwt helper/
const getAccessJWT = () => sessionStorage.getItem("accessJWT");
const getRefreshJWT = () => localStorage.getItem("refreshJWT");

export const apiProcesser = async ({
  method = "get",
  url,
  data,
  showToast = false,
  isPrivate,
  isRefreshJwt,
  contentType = "application/json",
}) => {
  const headers = {
    Authorization: isPrivate
      ? isRefreshJwt
        ? getRefreshJWT()
        : "Bearer " + getAccessJWT()
      : null,
    "Content-Type": contentType,
  };

  try {
    let axiosPromise = axios({ method, url, data, headers });
    if (showToast) {
      toast.promise(axiosPromise, {
        pending: "Please wait....",
      });
    }
    const { data: resp } = await axiosPromise;
    showToast && toast[resp.status](resp.message);
    return resp;
  } catch (e) {
    const msg = e?.response?.data?.message || e.message;
    showToast && toast.error(msg); // error toast for catch block

    if (msg === "jwt expired") {
      const fresh = await renewAccessJWT();
      if (fresh) return apiProcesser({ method, url, data, isPrivate });
      localStorage.clear();
      sessionStorage.clear();
    }
    return { status: "error", message: msg };
  }
};

//for sign up or registering the userr
export const signUpNewUserAPI = async (payload) => {
  const obj = {
    url: authEP + "/signup",
    method: "post",
    payload,
    showToast: true,
  };
  const result = await apiProcesser(obj);
  console.log(result);
};

//for veirfying and activating the user
export const verifyNewUserApi = async (token) => {
  const obj = {
    url: `${authEP}/verify/${token}`,
    method: "get",
  };
  return await apiProcesser(obj);
};

//req password//

export const requestPasswordResetApi = async (email) => {
  const obj = {
    url: `${authEP}/forgot-password`,
    method: "post",
    data: { email },
  };
  return await apiProcesser(obj);
};

//reset password//

export const resetPasswordApi = async ({ token, password }) => {
  const obj = {
    url: `${authEP}/reset-password`,
    method: "post",
    data: { token, password },
  };
  return await apiProcesser(obj);
};

//renewing the accessJWT
export const renewAccessJWT = async () => {
  const { accessJWT } = await apiProcesser({
    method: "get",
    url: authEP + "/refresh-token",
    isPrivate: true,
    isRefreshJwt: true,
  });
  if (accessJWT) sessionStorage.setItem("accessJWT", accessJWT);
  return accessJWT;
};

// Request password reset OTP
export const requestPassResetOTPApi = async (payload) => {
  const obj = {
    url: authEP + "/otp",
    method: "post",
    data: payload, 
    showToast: true,
  };
  return await apiProcesser(obj);
};

// Reset the password
export const resetPassApi = async (payload) => {
  const obj = {
    url: authEP + "/reset-password",
    method: "post",
    data: payload,
    showToast: true,
  };
  return await apiProcesser(obj);
};

//categories//
export const getAllCategories = () => apiProcesser({ url: categoriesEP });
export const getCategoryById = (id) =>
  apiProcesser({ url: `${categoriesEP}/${id}` });


//products//
export const getAllProducts = (q = "") => apiProcesser({ url: productsEP + q });
export const getProductById = (id) =>
  apiProcesser({ url: `${productsEP}/${id}` });
export const getProductsByCatId = (id) =>
  apiProcesser({ url: `${productsEP}?category=${id}` });
