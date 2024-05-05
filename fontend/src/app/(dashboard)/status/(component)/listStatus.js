import React, {  useEffect } from "react";
import { Table, message, Avatar, Space } from "antd";
import axiosClient from "@/service/axiosConfig";
import dayjs from "dayjs";
import { useRecoilState, useRecoilValue } from "recoil";
import { statusState ,queryStatusState} from "@/atom";
import EditCategoryModal from "./EditProductModal";
import DeleteStatus from "./deleteStatus";


const StatusTable = () => {
  const [status, setStatus] = useRecoilState(statusState);

  const query = useRecoilValue(queryStatusState);

  useEffect(() => {
    const value = `?keyword=${query.keyword}&sort=${query.sort}`;
    fetchProduct(value);
  
  }, [query.keyword, query.sort]);

  const fetchProduct = async (query) => {
    try {
      const response = await axiosClient.get(
        `/v1/status${query}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setStatus(response.data.status); 
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

  const indexColumn = {
    title: "STT",
    key: "index",
    width:'50px',
    render: (text, record, index) => {
      const currentPage = 1;
      const pageSize = 7;
      return (currentPage - 1) * pageSize + index + 1;
    },
  };

  const columns = [
    indexColumn,
    {
      title: "Trạng thái",
      dataIndex: "name",
      key: "name",
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
      dataSource={status}
      rowKey="_id"
      pagination={{
        pageSize: 7,
      }}
    />
  );
};

export default StatusTable;
