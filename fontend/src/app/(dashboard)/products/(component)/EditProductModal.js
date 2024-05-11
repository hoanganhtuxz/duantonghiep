import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, InputNumber, Select } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { categoryState, productState } from "@/atom";
import { EditOutlined } from "@ant-design/icons";

const EditCategoryModal = ({ id_dell, data }) => {
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
  };

  const handleSave = async (values) => {
    try {
      const res = await axiosClient.put(`v1/products/${id_dell}`, values, {
        withCredentials: true,
      });

      message.success("Cập nhật thành công!");

      setProducts((prev) =>
        prev.map((item) =>
          item._id === res.data.product._id ? res.data.product : item
        )
      );
      setVisible(false);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Không thể cập nhật");
      }
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  return (
    <>
      <Button type="text" onClick={showModal}>
        <EditOutlined />
      </Button>
      <Modal
        title="Cập nhật"
        open={visible}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button
            key="close"
            onClick={() => setVisible(false)}
            htmlType="button"
          >
            Huỷ
          </Button>,
          <Button
            key="save"
            loading={loading}
            form="add-cate"
            className="bg-blue-500 "
            onClick={() => form.submit()}
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

export default EditCategoryModal;
