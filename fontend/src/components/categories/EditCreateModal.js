import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { categoryState } from "@/atom";
import { EditOutlined } from "@ant-design/icons";

const EditCategoryModal = ({ id_category, data }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setCategories] = useRecoilState(categoryState);

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
      const res = await axiosClient.put(
        `v1/edit-category/${id_category}`,
        values,
        {
          withCredentials: true,
        }
      );

      message.success("Cập nhật thành công!");
      setCategories((prev) =>
        prev.map((item) =>
          item.id === res.data.categories.id ? res.data.categories : item
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
        message.error("Không thể thêm category. Vui lòng thử lại sau.");
      }
    }
  };

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
        title="Cập Nhật"
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
        <Form
          id="add-cate"
          form={form}
          onFinish={handleSave}
          layout="vertical"
          className="p-3"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
          >
            <Input showCount maxLength={200} placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Nhập Mô tả" />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Input addonBefore="https://" placeholder="Địa chỉ ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
