"use client";
import UploadFileProduct from "./(component)/uploadFileProduct.js";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Radio } from "antd";
import { useState } from "react";
import ExportProduct from "./(component)/exportProduct.js";

const option = [
  {
    label: "Nhập kho",
    value: "import",
  },
  {
    label: "Xuất kho",
    value: "export",
  },
];

export default function Page() {
  const router = useRouter();
  const [value, setValue] = useState("import");

  const onChange = ({ target: { value } }) => {
    setValue(value);
  };
  return (
    <div>
      <div
        className="flex items-center mb-4 font-bold gap-2 cursor-pointer"
        // onClick={() => router.back(-1)}
      >
        {/* <FaChevronLeft /> */}
        Xuất/Nhập kho sản phẩm
      </div>
      <Radio.Group
        className="mb-4"
        optionType="button"
        buttonStyle="solid"
        options={option}
        onChange={onChange}
        value={value}
      />

      {value === "import" ? <UploadFileProduct /> : <ExportProduct />}
    </div>
  );
}
