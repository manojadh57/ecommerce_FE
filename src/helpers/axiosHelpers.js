import axios from "axios";

const rootURL = import.meta.env.VITE_BASE_URL;
export const authEP = rootURL + "auth";

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
  } catch (e) {
    const msg = e?.response?.data?.message || e.message;
    if (msg === "jwt expired") {
      const newTok = await renewAccessJWT();
      if (newTok) return apiProcesser({ method, url, data, isPrivate });
      localStorage.clear();
      sessionStorage.clear();
    }
    return { status: "error", message: msg };
  }
};

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
