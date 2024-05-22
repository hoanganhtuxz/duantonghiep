"use client";

import { userInfoSelector } from "@/atom";
import { Button, Form, Input, Modal, Upload } from "antd";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { EditOutlined } from "@ant-design/icons";

const ModalProfile = ({ visible, setVisible }) => {
  const userInfo = useRecoilValue(userInfoSelector);
  const [isOpen, setIsOpen] = useState({
    email: false,
    password: false,
  });
  const [form] = Form.useForm();

  console.log(userInfo);
  return (
    <Modal
      title="Thông tin tài khoản"
      open={visible}
      onCancel={() => setVisible(false)}
      width={700}
    >
      <div className="mt-8">
        <div class="flex items-center justify-center ">
          <label
            for="dropzone-file"
            class="group flex flex-col items-center justify-center w-[200px] h-[200px] rounded-[50%] overflow-hidden border-2 border-gray-300 border-dashed  cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div class=" group-hover:opacity-[50]  transition-all decoration-slate-200 flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semimedium">Click to upload </span>
              </p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" />
          </label>
        </div>
        <div className="flex flex-col gap-[16px] mt-[30px] w-full">
          <div className="py-[6px] px-[16px] rounded-[4px] bg-gray-100 min-h-[44px] flex items-center">
            <div className="flex justify-between items-center">
              <div className="text-[16px]">
                User Name: <span className="font-bold">{userInfo?.name}</span>
              </div>
            </div>
          </div>
          <div className="py-[6px] min-h-[44px] px-[16px] rounded-[4px] bg-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-[16px]">
                Email: <span className="font-medium">{userInfo?.email}</span>
              </div>
              <span
                className="w-[32px] h-[32px] rounded-[4px] bg-blue-400 flex justify-center items-center cursor-pointer"
                onClick={() =>
                  setIsOpen({ email: !isOpen?.email, password: false })
                }
              >
                <EditOutlined />
              </span>
            </div>
            {isOpen?.email && (
              <div className="mt-[16px]">
                <Form layout="vertical">
                  <Form.Item
                    name="email"
                    label="Chỉnh sửa email"
                    required={false}
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                    ]}
                  >
                    <Input placeholder="@gmail" />
                  </Form.Item>
                  <Button
                    // loading={loading}
                    type="primary"
                    className="bg-blue-500"
                    htmlType="submit"
                    block
                  >
                    Xác nhận
                  </Button>
                </Form>
              </div>
            )}
          </div>
          <div className="py-[6px] min-h-[44px] px-[16px] rounded-[4px] bg-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-[16px]">
                Password: <span className="font-medium">********</span>
              </div>
              <span
                className="w-[32px] h-[32px] rounded-[4px] bg-blue-400 flex justify-center items-center cursor-pointer"
                onClick={() =>
                  setIsOpen({ email: false, password: !isOpen?.password })
                }
              >
                <EditOutlined />
              </span>
            </div>
            {isOpen?.password && (
              <div className="mt-[16px]">
                <Form layout="vertical">
                  <Form.Item
                    name="oldPassword"
                    label="Chỉnh sửa mật khẩu"
                    required={false}
                    rules={[
                      { required: true, message: "Vui lòng nhập trường này!" },
                    ]}
                  >
                    <Input placeholder="Mật khẩu cũ" />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    required={false}
                    rules={[
                      { required: true, message: "Vui lòng nhập trường này!" },
                    ]}
                    className="mt-[-12px]"
                  >
                    <Input placeholder="Mật khẩu mới" />
                  </Form.Item>
                  <Button
                    // loading={loading}
                    type="primary"
                    className="bg-blue-500"
                    htmlType="submit"
                    block
                  >
                    Xác nhận
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalProfile;
