import React, { useEffect } from "react";
import { Table, message, Avatar, Space } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountState, queryAccountState } from "@/atom";
import EditCategoryModal from "./EditAcountModal";
import DeleteStatus from "./deleteStatus";

const AccountTable = () => {
  const [accounts, setAccount] = useRecoilState(accountState);

  const query = useRecoilValue(queryAccountState);

  useEffect(() => {
    const value = `?keyword=${query.keyword}&sort=${query.sort}`;
    fetchProduct(value);
  }, [query.keyword, query.sort]);

  const fetchProduct = async (query) => {
    try {
      const response = await axiosClient.get(`/v1/accounts${query}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setAccount(response.data.results);
      } else {
        message.error("Failed to fetch ");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };
  const iRole = (value) => {
    if (value === "user") return "Người dùng";
    if (value === "admin") return "Toàn quyền";
    if (value === "management") return "Quản lí";
  };

  const indexColumn = {
    title: "STT",
    key: "index",
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
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <p className="text-sm font-light">{email}</p>,
    },
    {
      title: "Phân quyền",
      dataIndex: "role",
      key: "role",
      render: (role) => <p className="text-sm font-light">{iRole(role)}</p>,
    },
    {
      // dataIndex: "action",
      key: "action",
      width: "100px",
      render: (record) => (
        <Space>
          <EditCategoryModal id_update={record?._id} data={record} />
          <DeleteStatus id_delete={record?._id} />
        </Space>
      ),
    },
  ];
  // description
  return (
    <Table
      columns={columns}
      dataSource={accounts}
      rowKey="_id"
      pagination={{
        pageSize: 7,
      }}
    />
  );
};

export default AccountTable;
