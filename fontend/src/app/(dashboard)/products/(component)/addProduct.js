/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { Button, Modal, Form, Input, message, Select, InputNumber } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { categoryState, productState } from "@/atom";

const AddProductModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categoris] = useRecoilState(categoryState);
  const [, setProducts] = useRecoilState(productState);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await axiosClient.post(`v1/products`, values, {
        withCredentials: true,
      });

      message.success("Thêm thành công!");
      setProducts((prev) => [res.data.product, ...prev]);
      setVisible(false);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Không thể thêm");
      }
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Button type="primary" className="bg-blue-500" onClick={showModal}>
        Thêm Mới
      </Button>
      <Modal
        title="Thêm Sản Phẩm Mới"
        open={visible}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button onClick={() => setVisible(false)} htmlType="button">
            Huỷ
          </Button>,
          <Button
            loading={loading}
            form="add-cate"
            className="bg-blue-500 "
            htmlType="submit"
            type="primary"
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="max-h-[calc(100vh-12em)] thin-scroll overflow-y-auto">
          <Form
            id="add-cate"
            form={form}
            onFinish={handleSave}
            layout="vertical"
            className="p-3 "
          >
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input showCount maxLength={200} placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá tiền"
              rules={[
                { required: true, message: "Vui lòng nhập số giá tiền!" },
              ]}
            >
              <InputNumber
                type="number"
                className="w-full"
                min={0}
                placeholder="Nhập tên"
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber
                type="number"
                className="w-full"
                min={0}
                placeholder="Nhập tên"
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Chọn danh mục"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <Select
                showSearch
                placeholder="Chọn danh mục"
                filterOption={filterOption}
                options={
                  categoris?.map((i) => ({
                    label: i.name,
                    value: i._id,
                  })) || []
                }
              />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <Input.TextArea
                style={{ resize: "none", minHeight: "60px" }}
                placeholder="Nhập Mô tả"
              />
            </Form.Item>
            <Form.Item name="avatar" label="Avatar">
              <Input addonBefore="https://" placeholder="Địa chỉ ảnh" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddProductModal;
