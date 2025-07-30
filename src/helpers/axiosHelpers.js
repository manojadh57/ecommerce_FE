import axios from "axios";

const rootURL = import.meta.env.VITE_BASE_URL; // e.g. http://localhost:8000/api/customer/v1/
export const authEP = rootURL + "auth";
export const categoriesEP = rootURL + "categories";
export const productsEP = rootURL + "products";

/* ------------------------------------------------------------------ */
/*  JWT helpers                                                        */
/* ------------------------------------------------------------------ */
const getAccessJWT = () => sessionStorage.getItem("accessJWT");
const getRefreshJWT = () => localStorage.getItem("refreshJWT");

/* ------------------------------------------------------------------ */
/*  Generic request wrapper                                            */
/* ------------------------------------------------------------------ */
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
      const fresh = await renewAccessJWT();
      if (fresh) return apiProcesser({ method, url, data, isPrivate });
      localStorage.clear();
      sessionStorage.clear();
    }
    return { status: "error", message: msg };
  }
};

/* ------------------------------------------------------------------ */
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

/* ====================== CATEGORY REQUESTS ========================= */
export const getAllCategories = () => apiProcesser({ url: categoriesEP });
export const getCategoryById = (id) =>
  apiProcesser({ url: `${categoriesEP}/${id}` });
export const getSubCategories = (parentId) =>
  apiProcesser({ url: `${categoriesEP}/${parentId}/sub-categories` });

/* ====================== PRODUCT REQUESTS  ========================= */
export const getAllProducts = (q = "") => apiProcesser({ url: productsEP + q });
export const getProductById = (id) =>
  apiProcesser({ url: `${productsEP}/${id}` });
export const getProductsByCatId = (id) =>
  apiProcesser({ url: `${productsEP}?category=${id}` });
