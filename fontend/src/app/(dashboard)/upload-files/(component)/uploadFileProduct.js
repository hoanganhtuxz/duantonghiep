import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload ,Form} from "antd";
const { Dragger } = Upload;

const UploadFileProduct = () => {
  const form = Form.useForm()
  
  return (
    <div>
    
      <Dragger>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Nhấp hoặc kéo tệp vào khu vực này để tải lên
        </p>
        <p className="ant-upload-hint">
          Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công
          ty hoặc các tập tin bị cấm khác.
        </p>
      </Dragger>
    </div>
  );
};

export default UploadFileProduct;
