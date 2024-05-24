import React, { useState } from "react";
import { Button, Modal, Form, Input, message, Select } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { accountState } from "@/atom";

const AddAccountsModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setAccounts] = useRecoilState(accountState);

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
      const payload = {
        ...values,
        role: values?.role ? values?.rol : "user",
      };
      const res = await axiosClient.post(`v1/accounts`, payload, {
        withCredentials: true,
      });
      message.success("Thêm thành công!");
      setAccounts((prev) => [res.data.data, ...prev]);
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
        title="Thêm Mới"
        open={visible}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="1" onClick={() => setVisible(false)} htmlType="button">
            Huỷ
          </Button>,
          <Button
          key="2" 
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
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="*******" />
            </Form.Item>
            <Form.Item name="role" label="Chọn quyền tài khoản">
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

export default AddAccountsModal;
