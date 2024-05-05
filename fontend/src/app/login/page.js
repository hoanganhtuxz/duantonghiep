"use client";

import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const LoginForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/v1/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );
      const { success, user, accessToken } = response.data;

      if (success) {
        setLoading(false);
        localStorage.setItem("userInfo", JSON.stringify(user));
        if (values.remember) {
          localStorage.setItem("userEmail", values.email);
        }
        router.push("/overview", { scroll: true });
      } else {
        setLoading(false);
        message.error("Đăng nhập không thành công");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center w-full h-[100vh] bg-slate-100">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="w-[400px] m-auto bg-white shadow-md p-5 rounded-lg"
      >
        <h3 className="mb-8 mt-2 text-center text-lg font-medium">Đăng nhập</h3>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Lưu mật khẩu</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            className="bg-blue-500"
            htmlType="submit"
            block
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
