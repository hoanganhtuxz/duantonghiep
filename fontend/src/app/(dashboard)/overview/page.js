"use client";

import { message } from "antd";
import ApexBarChart from "./(component)/barchart";
import StatisticalTables from "./(component)/statistical-tables";
import { useEffect, useState } from "react";
import axiosClient from "@/service/axiosConfig";
import { getDefaultEndDate, getDefaultStartDate } from "@/utils";
import StatisticAll from "./(component)/statich";

export default function Page() {
  const [queryReport, setQueryReport] = useState({
    startDate: getDefaultStartDate("1w"),
    endDate: getDefaultEndDate("1w"),
  });
  const [queryReport2, setQueryReport2] = useState({
    startDate: getDefaultStartDate("1w"),
    endDate: getDefaultEndDate("1w"),
  });
  const [queryTable, setQueryTable] = useState({  page: 1,
    limit: 10,
    groupBy: 'date',
    date: new Date().toISOString().split('T')[0],});

  const [dataChart, setDataChart] = useState({
    total: 0,
    data: null,
    pageIndex: 0,
  });

  const [dataChart2, setDataChart2] = useState({
    total: 0,
    data: null,
    pageIndex: 0,
  });

  const [dataStatic, setDataStatic] = useState({
    total: 0,
    data: null,
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
        setDataChart2({
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
    const { startDate, endDate } = queryReport;
    if (startDate && endDate) {
      const query = `?type=import_product&startDate=${startDate}&endDate=${endDate}&groupBy=date&totalItem=7`;
      fetchImport(query);
    }
  }, [queryReport]);
  
  useEffect(() => {
    const { startDate, endDate } = queryReport2;
    if (startDate && endDate) {
      const valueExport = `?type=export_product&startDate=${startDate}&endDate=${endDate}&groupBy=date&totalItem=7`;
      fetchExport(valueExport);
    }
  }, [queryReport2]);


  const fetchStaticProduct = async (query) => {
    try {
      const response = await axiosClient.get(`/v1/statistic-products${query}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setDataStatic({
          total: response.data.product?.length,
          data: response.data?.product,
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
      fetchStaticProduct(`?${new URLSearchParams(queryTable).toString()}`);
  }, [queryTable]);



  return (
    <div>
      <StatisticAll />
      <div className="text-md font-bold mb-10 mt-04">
        Biểu đồ thống kê nhập kho
      </div>
      <ApexBarChart
        dataChart={dataChart}
        type="import"
        setQueryReport={setQueryReport}
      />
      <div className="text-md font-bold mb-10 mt-04">
        Biểu đồ thống kê xuất kho
      </div>
      <ApexBarChart
      showFilter
        dataChart={dataChart2}
        type="import"
        colorChart="#90ee7e"
        setQueryReport={setQueryReport2}
      />
      <div className="text-md font-bold mb-4">Bảng thống kê sản phẩm</div>
      <StatisticalTables dataStatic={dataStatic} setQueryTable={setQueryTable} />
    </div>
  );
}
