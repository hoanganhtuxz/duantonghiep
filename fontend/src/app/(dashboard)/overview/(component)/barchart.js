import { Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { extractTotalQuantities, getDateRange, processData } from "@/utils";

const ApexBarChart = ({ setQueryReport, dataChart, dataChart2 ,colorChart ='#33b2df'}) => {
  console.log("dataChart", dataChart);

  const [series, setSeries] = useState([
    {
      name: "Nhập kho",
      data: [],
    },
    // {
    //   name: "Xuất kho",
    //   data: [],
    // },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
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
    colors: [colorChart],
    xaxis: {
      categories: [
       
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

  useEffect(() => {
    if (dataChart.data) {
      {
        const formattedDates = processData(dataChart?.data);
        setOptions((prevData) => ({
          ...prevData,
          xaxis: { categories: formattedDates },
        }));
      }
    }
  }, [dataChart]);

  useEffect(() => {
    if (dataChart.data) {
      const result = extractTotalQuantities(dataChart?.data);
      setSeries((prev) => [
        { ...prev[0].name, data: result },
      ]);
    }
  
  }, [dataChart2, dataChart]);

  const handleOptionChange = (value) => {
    const { startDate, endDate } = getDateRange(value);

    if (!startDate || !endDate) {
      console.error("Invalid date range");
      return;
    }

    const startDateString = `${startDate.getFullYear()}/${(
      startDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${startDate.getDate().toString().padStart(2, "0")}`;
    const endDateString = `${endDate.getFullYear()}/${(endDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${endDate.getDate().toString().padStart(2, "0")}`;

    setQueryReport({ startDate: startDateString, endDate: endDateString });
  };

  return (
    <div>
      <Space>
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
