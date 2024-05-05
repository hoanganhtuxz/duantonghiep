// file: atom.ts
import { atom, selector } from "recoil";
import Cookies from "js-cookie";

export const accessTokenState = atom({
  key: "accessTokenState",
  default: Cookies.get("accessToken") || "",
});

export const userInfoState = atom({
  key: "userInfoState",
  default: JSON.parse(localStorage.getItem("userInfo") || "{}"),
});

export const userInfoSelector = selector({
  key: "userInfoSelector",
  get: ({ get }) => {
    const userInfo = get(userInfoState);
    return userInfo;
  },
});

export const categoryState = atom({
  key: "categoryState",
  default: [],
});

export const productState = atom({
  key: "productState",
  default: [],
});

export const accountState = atom({
  key: "accountState",
  default: [],
});

export const statusState = atom({
  key: "statusState",
  default: [],
});

export const classificationState = atom({
  key: "classificationState",
  default: [],
});

export const conditionState = atom({
  key: "conditionState",
  default: [],
});


export const queryAccountState = atom({
  key: "queryAccountState",
  default: { keyword: "", sort: "desc" },
});
export const queryConditionState = atom({
  key: "queryClassificationState",
  default: { keyword: "", sort: "desc" },
});
export const queryClassificationState = atom({
  key: "queryClassificationState",
  default: { keyword: "", sort: "desc" },
});

export const queryCategoryState = atom({
  key: "queryCategoryState",
  default: { keyword: "", sort: "desc" },
});

export const queryProductState = atom({
  key: "queryProductState",
  default: { keyword: "", sort: "desc" },
});

export const queryStatusState = atom({
  key: "queryStatusState",
  default: { keyword: "", sort: "desc" },
});




export const categorySelector = selector({
  key: "categorySelector",
  get: ({ get }) => {
    const category = get(categoryState);
    return category;
  },
});
