import { Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexBarChart = ({ setQueryReport, dataChart }) => {
  const [series, setSeries] = useState([
    {
      name: "Xuất kho",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: ["#90ee7e"],
    xaxis: {
      categories: [
        "12/2/2023",
        "17/2/2023",
        "24/2/2023",
        "1/3/2023",
        "8/3/2023",
        "20/2/2023",
        "27/3/2023",
        "5/4/2023",
        "17/4/2023",
      ],
    },
    yaxis: {
      title: {
        text: "Thống kê",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  });

  return (
    <div>
      <Space>
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
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={600}
        />
      </div>
    </div>
  );
};

export default ApexBarChart;
