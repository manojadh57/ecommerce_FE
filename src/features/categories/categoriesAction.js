import { setParents, setSubs, setStatus, setError } from "./categoriesSlice";
import { getAllCategories, getSubCategories } from "../../helpers/axiosHelpers";

export const loadCategoriesTree = () => async (dispatch) => {
  try {
    dispatch(setStatus("loading"));
    const categories = (await getAllCategories()) || [];
    const parents = categories.filter((c) => !c.parent);

    dispatch(setParents(parents));

    await Promise.all(
      parents.map(async (p) => {
        const { subCategories = [] } = await getSubCategories(p._id);
        if (subCategories.length)
          dispatch(setSubs({ parentId: p._id, subs: subCategories }));
      })
    );

    dispatch(setStatus("succeeded"));
  } catch (e) {
    dispatch(setError(e?.message || "Failed to load categories"));
  }
};
