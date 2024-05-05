import React, { useState } from "react";
import { Button, Modal, Form, Input, message} from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState } from "recoil";
import { conditionState} from "@/atom";


const AddStatusModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setProducts] = useRecoilState(conditionState);


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
      const res = await axiosClient.post(`v1/condition`, values, {
        withCredentials: true,
      });
      message.success("Thêm thành công!");
      setProducts((prev) => [res.data.data, ...prev]);
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
              label="Tên phân loại"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input showCount maxLength={200} placeholder="Nhập tên" />
            </Form.Item>
            
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea
                style={{ resize: "none", minHeight: "60px" }}
                placeholder="Nhập Mô tả"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddStatusModal;
