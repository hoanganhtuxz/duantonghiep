import React from "react";
import { InputNumber, Space } from "antd";

const NumberProductExport = ({ maxProduct, handleChangQuantity }) => {
  return (
    <Space>
      <p>Số lượng:</p>
      <InputNumber
        className="w-[100px]"
        type="number"
        min={1}
        onChange={handleChangQuantity}
        defaultValue={1}
        max={maxProduct}
        placeholder="Số lượng"
      />
    </Space>
  );
};

export default NumberProductExport;
