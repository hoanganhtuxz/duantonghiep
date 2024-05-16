import { message } from "antd";
import axiosClient from "./axiosConfig";

export const getListStatus = async () => {
  try {
    const response = await axiosClient.get(`/v1/status`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data;
    } else {
      message.error("Failed to fetch");
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      message.error(error?.response?.data?.message);
    } else {
      message.error("Error fetching");
    }
  }
};
