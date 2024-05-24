import React, { useEffect, useState } from "react";
import { Card, Col, message, Row, Statistic } from "antd";
import { itemStatic } from "@/utils/fakeJson";
import axiosClient from "@/service/axiosConfig";

const StatisticAll = () => {
  const [dataItem, setDataItem] = useState(itemStatic);

  const updateItemStaticValue = (key, value) => {
    setDataItem((prevItemStatic) =>
      prevItemStatic.map((item) =>
        item.key === key ? { ...item, value: value?.toString() || "0" } : item
      )
    );
  };

  const fetchProduct = async () => {
    try {
      const response = await axiosClient.get(`/v1/products`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const productItem = dataItem.find((item) => item.key === "product");
        if (productItem) {
          updateItemStaticValue("product", response.data.count);
        }
      } else {
        message.error("Failed to fetch products");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching products");
      }
    }
  };

  const fetchConditon = async () => {
    try {
      const response = await axiosClient.get(`/v1/condition`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const productItem = dataItem.find((item) => item.key === "condition");
        if (productItem) {
          updateItemStaticValue("condition", response.data.count);
        }
      } 
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axiosClient.get(`/v1/status`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const productItem = dataItem.find((item) => item.key === "status");
        if (productItem) {
          updateItemStaticValue("status", response.data.count);
        }
      } 
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axiosClient.get(`/v1/category`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const productItem = dataItem.find((item) => item.key === "category");
        if (productItem) {
          updateItemStaticValue("category", response.data.count);
        }
      } 
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };
  const fetchAcount= async () => {
    try {
      const response = await axiosClient.get(`/v1/accounts`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const productItem = dataItem.find((item) => item.key === "account");
        if (productItem) {
          updateItemStaticValue("account", response.data.count);
        }
      } 
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };
  const fetchClassification= async () => {
    try {
      const response = await axiosClient.get(`/v1/classification`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const productItem = dataItem.find((item) => item.key === "classification");
        if (productItem) {
          updateItemStaticValue("classification", response.data.count);
        }
      } 
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchConditon()
    fetchStatus()
    fetchCategory()
    fetchAcount()
    fetchClassification()
  }, []);

  return (
    <Row gutter={16} className="mb-10">
      {dataItem?.map((item) => (
        <Col span={6} key={item.key}>
          <Card className="!shadow-xl mb-4" bordered={false}>
            <Statistic
              title={item?.name}
              value={item.value}
              // precision={2}
              valueStyle={{
                color: "#3f8600",
              }}
              //   prefix={<ArrowUpOutlined />}
              //   suffix="%"
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatisticAll;
