import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { classificationState } from "@/atom";
import { EditOutlined } from "@ant-design/icons";

const EditCategoryModal = ({ id_update, data }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setProducts] = useRecoilState(classificationState);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = async (values) => {
    try {
      const res = await axiosClient.put(
        `v1/classification/${id_update}`,
        values,
        {
          withCredentials: true,
        }
      );

      message.success("Cập nhật thành công!");

      setProducts((prev) =>
        prev.map((item) =>
          item.id === res.data.product.id ? res.data.product : item
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
          <Button onClick={() => setVisible(false)} htmlType="button">
            Huỷ
          </Button>,
          <Button
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
        <Form
          id="add-cate"
          form={form}
          onFinish={handleSave}
          layout="vertical"
          className="p-3"
        >
          <Form.Item
            name="name"
            label="Tên phân loại"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input showCount maxLength={200} placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Nhập Mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
