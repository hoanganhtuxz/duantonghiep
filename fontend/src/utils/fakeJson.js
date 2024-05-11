import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ProductOutlined,
  BarChartOutlined,
  LogoutOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";

import { VscGroupByRefType } from "react-icons/vsc";
import { LiaPercentageSolid } from "react-icons/lia";
import { AiOutlineAlignRight } from "react-icons/ai";
import { CiShoppingTag } from "react-icons/ci";

const menuItems = [
  {
    label: "Thông tin",
    key: "editProfile",
    icon: <EditOutlined />,
  },

  {
    label: "Đăng xuất",
    danger: true,
    key: "logout",
    icon: <LogoutOutlined />,
  },
];
const sidebarItem = [
  {
    key: "/overview",
    icon: <BarChartOutlined />,
    label: "Tổng quan",
  },
  {
    key: "/export-import",
    icon: <PlusSquareOutlined />,
    label: "Xuất/Nhập kho",
  },
  {
    key: "/accounts",
    icon: <UserOutlined />,
    label: "Tài khoản",
  },
  {
    key: "/products",
    icon: <ProductOutlined />,
    label: "Sản phẩm",
  },
  {
    key: "/categories",
    icon: <AiOutlineAlignRight />,
    label: "Danh mục",
  },
  {
    key: "/status",
    icon: <CiShoppingTag />,
    label: "Trạng thái",
  },
  {
    key: "/classification",
    icon: <VscGroupByRefType />,
    label: "Phân loại",
  },
  {
    key: "/condition",
    icon: <LiaPercentageSolid />,
    label: "Tình trạng",
  },
];

export {
    sidebarItem,
    menuItems
}