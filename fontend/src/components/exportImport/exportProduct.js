import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import axiosClient from "@/service/axiosConfig";
import ListChonseProductExport from "./listChonseProductExport";
import { calculateTotalPrice, formatPrice } from "@/utils";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/components/inVoicePdf";
import InvoiceWord from "@/components/invoiceWord";

const ExportProduct = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState(null);
  const [listChonseProduct, setListChonseProducts] = useState([]);

  const onFinish = async (values) => {
    await handleUpdataExport(values);
  };

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
          price: product.price,
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
        return prev.map((i) => ({
          ...i,
          quantity: 1,
          totalQuatity: i.quantity,
        }));
      } else {
        const newArray = [...prev, ...sortData];
        return newArray.map((i) => ({
          ...i,
          quantity: 1,
          totalQuatity: i.quantity,
        }));
      }
    });
  };

  const chonseQuantity = (id, newQuatity) => {
    setListChonseProducts((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: newQuatity } : i))
    );
  };


  const handleUpdataExport = async (values) => {
    const dataExport = { ...values, products: listChonseProduct };

    const pauloadExport = listChonseProduct.map((product) => ({
      code: product.code,
      quantity: product.quantity,
    }));

    try {
      const response = await axiosClient.post(
        `/v1/export-product`,
        pauloadExport,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        message.success("Xuất file thành công");
        // InvoiceWord(dataExport);
      } 
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching export");
      }
    }
  };

  const handleDownloadPDF = async (dataExport) => {
    const blob = await pdf(<InvoicePDF data={dataExport} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    link.click();
  };

  const handleRemoveExportProduct = (id) => {
    setListChonseProducts((prev) => prev.filter((i) => i._id !== id));
  };

  useEffect(() => {
    const totalPrice = calculateTotalPrice(listChonseProduct || []);
    const formattedTotalPrice = formatPrice(totalPrice || 0);
    form.setFieldsValue({
      price: formattedTotalPrice || 0,
    });
  }, [listChonseProduct, form]);

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
        form={form}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Tìm kiếm và chọn sản phẩm"
          name="product"
          rules={[{ required: true, message: "Tìm kiếm sả phẩm" }]}
        >
          <Select
            showSearch
            placeholder="Chọn hoặc tìm kiếm sản phẩm"
            onChange={onChange}
            filterOption={filterOption}
          >
            {products?.map((product) => (
              <Select.Option key={product._id} value={product.value}>
                <div className="flex justify-between">
                  <p>{product.label}</p>
                  <p className="text-red-500">
                    {formatPrice(product.price || 0)}
                  </p>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <ListChonseProductExport
          chonseQuantity={chonseQuantity}
          handleRemoveExportProduct={handleRemoveExportProduct}
          listChonseProduct={listChonseProduct}
        />
        <Form.Item
          label="Người xuất kho"
          name="user"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <Input className="w-full" placeholder="Nhập tên người xuất kho" />
        </Form.Item>
        <Form.Item label="Tổng tiền" name="price">
          <Input
            className="w-full"
            addonAfter="VNĐ"
            value="59d"
            disabled
            placeholder="0đ"
          />
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
            <Button type="primary" htmlType="submit">
              Xác nhận xuất kho
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExportProduct;
