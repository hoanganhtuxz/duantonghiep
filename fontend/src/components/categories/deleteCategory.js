import React from "react";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { categoryState } from "@/atom";

const DeleteCategory = ({ id_category }) => {
  const [, setCategories] = useRecoilState(categoryState);

  const confirm = async () => {
    try {
      const response = await axiosClient.delete(`/v1/category/${id_category}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        message.success("Xoá thành công");
        setCategories((prev) => {
          const updatedCategories = prev.filter((i) => i._id !== id_category);
          return updatedCategories;
        });
      } else {
        message.error("Failed to fetch categories");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching categories");
      }
    }
  };

  const cancel = (e) => {};

  return (
    <Popconfirm
      title="Bạn muốn xoá"
      description="Sau khi xoá sẽ không thể khôi phục"
      onConfirm={confirm}
      onCancel={cancel}
      okText="Xoá"
      cancelText="Huỷ"
    >
      <Button danger type="text">
        <DeleteOutlined />
      </Button>
    </Popconfirm>
  );
};

export default DeleteCategory;
