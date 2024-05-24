import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Form, Select, message, Button, Space } from "antd";
import axiosClient from "@/service/axiosConfig";
import { GrDownload } from "react-icons/gr";
import { useRouter } from "next/navigation";

const { Dragger } = Upload;

const UploadFileProduct = () => {
  const [listChonseProduct, setListChonseProducts] = useState([]);
  const [products, setProducts] = useState(null);
  const [form] = Form.useForm();
  // const router = useRouter()
  const [fileList, setFileList] = useState([]);
  const getListProducts = async () => {
    try {
      const response = await axiosClient.get(`/v1/products`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const newData = response.data.product.map((product) => ({
          ...product,
          value: product._id,
          label: product.name,
        }));
        setProducts(newData);
      } else {
        message.error("Failed to fetch product");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching product");
      }
    }
  };
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Tên sản phẩm", "Số lượng", "Giá", "Mã code"],
      ...listChonseProduct.map((item) => [
        item.name,
        item.quantity,
        item.price,
        item.code || "",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const columnWidths = [30, 15, 20, 25];
    worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const excelUrl = URL.createObjectURL(excelData);

    const downloadLink = document.createElement("a");
    downloadLink.href = excelUrl;
    downloadLink.download = "Du-lieu-san-pham.xlsx";
    downloadLink.click();
  };

  const uploadProduct = async () => {
    const key = "import-file";
    message.open({
      key,
      type: "loading",
      content: "Đang tải...",
    });
    const fileData = [];
    const dataImport = await readExcelFile(fileList[0].originFileObj);

    fileData.push(
      ...dataImport.map((item) => ({
        code: item["Mã code"] || "",
        quantity: item["Số lượng"] || "1",
        price: item["Giá"] || "",
        name: item["Tên sản phẩm"] || "",
      }))
    );

    try {
      const res = await axiosClient.post(`v1/import-product`, fileData, {
        withCredentials: true,
      });

      if (res.data.success) {
        message.open({
          key,
          type: "success",
          content: "Nhập kho thành công!",
          duration: 2,
        });
        form.resetFields();
        setFileList([])
      }

    } catch (error) {
      if (error?.response?.data?.message) {
        message.open({
          key,
          type: "error",
          content: error?.response?.data?.message,
          duration: 2,
        });
      } else {
        message.open({
          key,
          type: "error",
          content: "Không thể nhập kho với file xlsx",
          duration: 2,
        });
      }
    }
    
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (values) => {
    setListChonseProducts((prev) => {
      const newProducts = products
        .filter((i) => values.includes(i._id))
        .filter((i) => !prev.some((item) => item._id === i._id));

      return [...prev, ...newProducts];
    });
  };

  useEffect(() => {
    getListProducts();
  }, []);

  const uploadProps = {
    name: "file",
    maxCount: 1,
    multiple: false,
    fileList,
    onChange: handleChange,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File phải nhỏ hơn 2MB!");
      }
      return false;
    },
  };

  return (
    <div>
      <Form form={form} layout="vertical" name="export">
        <Form.Item
          label="Tìm kiếm và chọn sản phẩm export file"
          name="product"
          rules={[{ required: true, message: "Tìm kiếm sả phẩm" }]}
        >
          <Select
            value={listChonseProduct}
            mode="multiple"
            showSearch
            placeholder="Chọn hoặc tìm kiếm sản phẩm muốn export"
            onChange={onChange}
            filterOption={filterOption}
            options={products || []}
            
          />
        </Form.Item>
      </Form>

      <div>
        <Form.Item label="Tải xuống danh sách sản phẩm đã chọn:">
          <Space>
            <Button
              onClick={exportToExcel}
              icon={<GrDownload />}
              type="primary"
              ghost
            >
              Tải file Excel{" "}
            </Button>
          </Space>
        </Form.Item>
      </div>
      <div>Tải file Excel</div>
      <Dragger accept=".xlsx" {...uploadProps} multiple={false}>
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

      <div className="flex justify-end mt-6">
        <Button onClick={() => uploadProduct()} type="primary">
          Xác nhận nhập kho
        </Button>
      </div>
    </div>
  );
};

export default UploadFileProduct;
