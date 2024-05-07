import React from "react";
import { InputNumber, Space } from "antd";

const NumberProductExport = ({ maxProduct }) => {
  return (
    <Space>
      <p>Số lượng:</p>
      <InputNumber
        className="w-[100px]"
        type="number"
        min={1}
        defaultValue={1}
        max={maxProduct}
        placeholder="Số lượng"
      /> 
    </Space>
  );
};

export default NumberProductExport;
