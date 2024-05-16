import React, { useEffect } from "react";
import { Button, Form, Modal, Upload, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosClient from "@/service/axiosConfig";

const ProfileUser = ({ open, setOpen }) => {
  const [form] = Form.useForm();

  const getUserInfo = async () => {
    const res = await axiosClient.get("/user");
    if (res) {
      console.log("res", res);
    }
  };

  const handleSubmit = (values) => {
    // Gửi dữ liệu lên server để cập nhật thông tin
    console.log("Received values of form:", values);
  };

  const handleUploadAvatar = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  useEffect(() => {
    getUserInfo();
  });

  return (
    <div>
      <Modal
        title="Modal 1000px width"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <Form
          form={form}
          name="update-profile"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="avatar"
            label="Avatar"
            valuePropName="fileList"
            getValueFromEvent={handleUploadAvatar}
          >
            <Upload
              name="avatar"
              action="/upload.do"
              listType="picture"
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileUser;
