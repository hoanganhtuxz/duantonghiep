import React, {  useEffect } from "react";
import { Table, message, Avatar, Space } from "antd";
import axiosClient from "@/service/axiosConfig";
import { useRecoilState, useRecoilValue } from "recoil";
import { queryProductState ,productState,categoryState} from "@/atom";
import EditCategoryModal from "./EditProductModal";
import DeleteProducts from "./deleteProduct";




const ProductsTable = () => {
  const [products, setProducts] = useRecoilState(productState);
  const [, setCategories] = useRecoilState(categoryState);

  const query = useRecoilValue(queryProductState);

  useEffect(() => {
    const value = `?keyword=${query.keyword}&sort=${query.sort}`;
    fetchProduct(value);
  
  }, [query.keyword, query.sort]);

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get(
        `/v1/category`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setCategories(response.data.categories); // Chuyển đối tượng single category thành mảng
      } else {
        message.error("Failed to fetch categories");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching categories");
      }
    }
  };

  useEffect(()=>{
    fetchCategories()
  },[])

  const fetchProduct = async (query) => {
    try {
      const response = await axiosClient.get(
        `/v1/products${query}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setProducts(response.data.product); 
      } else {
        message.error("Failed to fetch ");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Error fetching");
      }
    }
  };

  const indexColumn = {
    title: "STT",
    key: "index",
    width: "50px",
    render: (text, record, index) => {
      const currentPage = 1;
      const pageSize = 7;
      return (currentPage - 1) * pageSize + index + 1;
    },
  };

  const columns = [
    indexColumn,
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar
          src={avatar?.url}
          alt="Avatar"
          style={{ width: 30, height: 30 }}
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <p className="text-sm font-light">
          {price} <strong>Đ</strong>
        </p>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <p className="text-sm font-light">
          {quantity}
        </p>
      ),
    },
    {
      // dataIndex: "action",
      key: "action",
      width: "100px",
      render: (record) => (
        <Space>
          <EditCategoryModal id_dell={record?._id} data={record} />
          <DeleteProducts id_category={record?._id} />
        </Space>
      ),
    },
  ];
  // description
  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="_id"
      pagination={{
        pageSize: 7,
      }}
    />
  );
};

export default ProductsTable;
