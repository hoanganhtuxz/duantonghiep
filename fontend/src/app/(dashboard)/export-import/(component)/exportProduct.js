import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Select,
} from "antd";
import axiosClient from "@/service/axiosConfig";
import NumberProductExport from "./NumberProductExport";

const ExportProduct = () => {
  
  const onFinish = (value) => {};

  const [products, setProducts] = useState(null);
  const [listChonseProduct, setListChonseProducts] = useState([]);

  const getListProducts = async () => {
    try {
      const response = await axiosClient.get(`/v1/products`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const newData = response.data.product.map((product) => ({
          ...product,
          value: product._id,
          label: product.name,
        }));
        setProducts(newData);
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

  const onChange = (value) => {
    const sortData = products?.filter((i) => i._id === value);
    setListChonseProducts((prev) => {
      if (prev.some((item) => item._id === value)) {
        return prev;
      } else {
        return [...prev, ...sortData];
      }
    });
  };

  const handleRemoveExportProduct = (id) => {
    setListChonseProducts((prev) => prev.filter((i) => i._id !== id));
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    getListProducts();
  }, []);

  return (
    <div>
      <Form
        layout="vertical"
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Tìm kiếm và chọn sản phẩm"
          name="product"
          rules={[{ required: true, message: "Tìm kiếm sả phẩm" }]}
        >
          <Select
            // mode="multiple"
            showSearch
            placeholder="Chọn hoặc tìm kiếm sản phẩm"
            onChange={onChange}
            filterOption={filterOption}
            options={products || []}
          />
        </Form.Item>
        <div>
          <List
            className="mb-4"
            dataSource={listChonseProduct}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                actions={[
                  <NumberProductExport
                    key="quantity"
                    maxProduct={item?.quantity}
                  />,
                  <Button
                    type="text"
                    key="delete"
                    danger
                    onClick={() => handleRemoveExportProduct(item?._id)}
                  >
                    Xoá
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={50}
                      shape="square"
                      className="bg-blue-100"
                      src={`https://static.thenounproject.com/png/4974686-200.png`}
                    />
                  }
                  title={
                    <a className="hover:text-blue-500 text-blue-500 font-medium">
                      {item.name}
                    </a>
                  }
                  description={
                    <div>Mã code: {item?.code || " *** *** *** "}</div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
        {/* <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            type="number"
            placeholder="Nhập số lượng"
          />
        </Form.Item> */}

        <Form.Item
          label="Người xuất kho"
          name="user"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <Input className="w-full" placeholder="Nhập tên người xuất kho" />
        </Form.Item>
        <Form.Item
          label="Tổng tiền"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <Input className="w-full" placeholder="Nhập tên người xuất kho" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ đại lí"
          name="address"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input.TextArea
            placeholder="Nhập thông tin địa chỉ đại li"
            style={{ height: 50, resize: "none" }}
          />
        </Form.Item>
        <Form.Item label="Ghi chú" name="information">
          <Input.TextArea
            placeholder="Nhập nội dung ghi chú"
            style={{ height: 100, resize: "none" }}
          />
        </Form.Item>
        <Form.Item>
      <div className="flex justify-end">
      <Button type="primary" htmlType="submit">Xác nhận xuất kho</Button>
      </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExportProduct;
