import React from "react";
import { Space, Table, Tag, Select } from "antd";
import { extractTotalQuantities, getDateRange, processData } from "@/utils";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (category) => {
      if (category && category.name) {
        return category.name;
      }
      return ''; // Hoặc một giá trị mặc định khác
    },
  },
  // Các cột khác...
];


const StatisticalTables = ({ dataStatic, setQueryTable }) => {

  const handleOptionChange = (value) => {
    const { startDate, endDate } = getDateRange(value);
    if (!startDate || !endDate) {
      console.error("Invalid date range");
      return;
    }
    
    const query = {
      page: 1,
      limit: 10,
      groupBy: 'date',
    };
    
    if (value === '1w' || value === '2w') {
      query.date = endDate.toISOString().split('T')[0];
    } else {
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      
      if (startYear === endYear) {
        if (startMonth === endMonth) {
          query.month = startMonth;
          query.year = startYear;
        } else {
          query.startMonth = startMonth;
          query.endMonth = endMonth;
          query.year = startYear;
        }
      } else {
        query.startYear = startYear;
        query.endYear = endYear;
      }
    }
    
    const queryString = new URLSearchParams(query).toString();
    setQueryTable(queryString)
  };

  console.log('dataStatic',dataStatic)

  return (
    <div>
      <Space className="mb-4">
        <p>Bộ lọc:</p>
        <Select
          defaultValue="1w"
          onChange={handleOptionChange}
          style={{ width: 120 }}
          options={[
            { value: "1w", label: "1 Tuần" },
            { value: "2w", label: "2 Tuần" },
            { value: "1m", label: "1 Tháng" },
            { value: "3m", label: "3 Tháng" },
            { value: "6m", label: "6 Tháng" },
            { value: "9m", label: "9 Tháng" },
            { value: "12m", label: "12 Tháng" },
          ]}
        />
      </Space>
      <Table columns={columns} dataSource={dataStatic?.data || []} />
    </div>
  );
};

export default StatisticalTables;
