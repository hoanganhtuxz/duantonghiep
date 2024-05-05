import { message } from "antd";
import axiosClient from "./axiosConfig";

export const logoutUser = async () => {
  try {
    await axiosClient.get(`v1/logout`, {
      withCredentials: true,
    });
    localStorage.removeItem("userInfo");
  } catch (error) {
    if (error?.response?.data?.message) {
      message.error(error?.response?.data?.message);
    } else {
      message.error("Vui lòng thử lại sau.");
    }
  }
};
