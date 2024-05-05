import React, { useEffect } from "react";
import { Table, message, Avatar, Space } from "antd";
import axiosClient from "@/service/axiosConfig";
import dayjs from "dayjs";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryState, queryCategoryState } from "@/atom";
import EditCategoryModal from "./EditCreateModal";
import DeleteCategory from "./deleteCategory";

const CategoryTable = () => {
  const [categores, setCategories] = useRecoilState(categoryState);
  const query = useRecoilValue(queryCategoryState);

  useEffect(() => {
    const value = `?keyword=${query.keyword}&sort=${query.sort}`;
    fetchCategories(value);
  }, [query.keyword, query.sort]);

  const fetchCategories = async (query) => {
    try {
      const response = await axiosClient.get(`/v1/category${query}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCategories(response.data.categories); // Chuyển đối tượng single category thành mảng
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

  const indexColumn = {
    title: "STT",
    key: "index",
    width: "40px",
    render: (text, record, index) => {
      const currentPage = 1;
      const pageSize = 7;
      return (currentPage - 1) * pageSize + index + 1;
    },
  };

  const columns = [
    indexColumn,
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar
          src={avatar?.url}
          alt="Avatar"
          style={{ width: 30, height: 30 }}
        />
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày thêm",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <p className="text-sm font-light">
          {dayjs(createdAt).format("DD/MM/YYYY")}
        </p>
      ),
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => (
        <p className="text-sm font-light">
          {dayjs(updatedAt).format("DD/MM/YYYY")}
        </p>
      ),
    },
    {
      // dataIndex: "action",
      key: "action",
      width: "100px",
      render: (record) => (
        <Space>
          <EditCategoryModal id_category={record?._id} data={record} />
          <DeleteCategory id_category={record?._id} />
        </Space>
      ),
    },
  ];
  // description
  return (
    <Table
      columns={columns}
      dataSource={categores}
      rowKey="_id"
      pagination={{
        pageSize: 7,
      }}
    />
  );
};

export default CategoryTable;
