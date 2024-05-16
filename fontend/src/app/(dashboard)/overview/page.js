"use client";

import { message } from "antd";
import ApexBarChart from "./(component)/barchart";
import StatisticalTables from "./(component)/statistical-tables";
import { useEffect, useState } from "react";
import axiosClient from "@/service/axiosConfig";

export default function Page() {
  const [queryReport, setQueryReport] = useState("");
  const [dataChart, setDataChart] = useState({
    total: 0,
    data: null,
    pageIndex: 0,
  });

  const fetchImport = async (query) => {
    try {
      const response = await axiosClient.get(`/v1/report${query}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setDataChart({
          total: response.data.total,
          data: response.data.data,
          pageIndex: response.data.pageIndex,
        });

      } else {
        message.error("Failed to fetch faild");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching faild");
      }
    }
  };

  const fetchExport = async (query) => {
    try {
      const response = await axiosClient.get(`/v1/report${query}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setDataChart({
          total: response.data.total,
          data: response.data.data,
          pageIndex: response.data.pageIndex,
        });

      } else {
        message.error("Failed to fetch faild");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching faild");
      }
    }
  };

  

  useEffect(() => {
    // ?startDate=&endDate=&pageIndex=&totalItem=
    const value = `?type=import_product&groupBy=warehouseId`;
    fetchImport(value);
  }, [queryReport]);

  return (
    <div>
      <div className="text-md font-bold my-10">Biểu đồ thống kê sản phẩm nhập kho</div>
      <ApexBarChart dataChart={dataChart} type="import" setQueryReport={setQueryReport} />
      <div className="text-md font-bold my-10">Biểu đồ thống kê sản phẩm xuất kho</div>
      <ApexBarChart dataChart={dataChart} type="export" setQueryReport={setQueryReport} />
      <div className="text-md font-bold mb-4">Bảng thống kê sản phẩm</div>
      <StatisticalTables />
    </div>
  );
}
