import React from "react";
import { Space, Table, Tag, Select } from "antd";
const columns = [
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Số lượng",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Danh mục",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tình trạng",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Phân loại",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const StatisticalTables = () => {
    return(
        <div>
              <Space className="mb-4">
            <p>Bộ lọc:</p>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              options={[
                { value: "", label: "1 Tuần" },
                { value: "", label: "2 Tuần" },
                { value: "lucy", label: "1 Tháng" },
                { value: "Yiminghe", label: "3 Tháng" },
                { value: "disabled", label: "6 Tháng" },
                { value: "disabled", label: "9 Tháng" },
                { value: "disabled", label: "12 Tháng" },
              ]}
            />
          </Space>
          <Table columns={columns} dataSource={data} />;
        </div>
    )
    
}

export default StatisticalTables;
