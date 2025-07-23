import axios from "axios";

const rootURL = import.meta.env.VITE_BASE_URL;
const authEP = rootURL + "auth";
const productEP = rootURL + "products";

///getting token///
const getAccessJWT = () => sessionStorage.getItem("accessJWT");
const getRefreshJWT = () => localStorage.getItem("refreshJWT");

export const apiProcesser = async ({
  method = "get",
  url,
  data,
  isPrivate,
  isRefreshJwt,
  contentType = "application/json",
}) => {
  const headers = {
    Authorization: isPrivate
      ? isRefreshJwt
        ? getRefreshJWT()
        : getAccessJWT()
      : null,
    "Content-Type": contentType,
  };

  try {
    const { data: resp } = await axios({ method, url, data, headers });
    return resp;
  } catch (error) {
    const message = error?.response?.data?.message || error.message;

    ///expires///
    if (message === "jwt expired") {
      const newToken = await renewAccessJWT();
      if (newToken) {
        //rercall//
        return apiProcesser({ method, url, data, isPrivate });
      }
      //refresh token//
      localStorage.removeItem("refreshJWT");
      sessionStorage.removeItem("accessJWT");
    }

    return { status: "error", message };
  }
};

///access new token//
export const renewAccessJWT = async () => {
  const { accessJWT } = await apiProcesser({
    method: "get",
    url: authEP + "/refresh-token",
    isPrivate: true,
    isRefreshJwt: true,
  });

  if (accessJWT) {
    sessionStorage.setItem("accessJWT", accessJWT);
  }
  return accessJWT;
};

///endpoint export///
export { authEP, productEP };
