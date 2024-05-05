import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Select } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { accountState } from "@/atom";
import { EditOutlined } from "@ant-design/icons";

const EditAcountsModal = ({ id_update, data }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setAccounts] = useRecoilState(accountState);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const res = await axiosClient.put(`v1/accounts/${id_update}`, values, {
        withCredentials: true,
      });

      message.success("Cập nhật thành công!");
      setAccounts((prev) =>
        prev.map((item) =>
          item._id === res.data.data._id ? res.data.data : item
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
        title="Cập Nhật"
        open={visible}
        onCancel={handleCancel}
        width={600}
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
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input showCount maxLength={200} placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="@gmail" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu mới">
              <Input.Password placeholder="*******" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Chọn quyền tài khoản"
              rules={[
                { required: true, message: "Vui lòng chọn quyền tài khoản" },
              ]}
            >
              <Select
                defaultValue="user"
                className="w-full"
                filterOption={filterOption}
                options={[
                  { value: "user", label: "Người dùng" },
                  { value: "admin", label: "Toàn quyền" },
                  { value: "management", label: "Quản lí" },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditAcountsModal;
