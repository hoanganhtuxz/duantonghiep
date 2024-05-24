"use client";

import { useRecoilValue } from "recoil";
import { userInfoSelector } from "../../atom";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { MdHomeWork } from "react-icons/md";

import React, { useState } from "react";
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
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space } from "antd";
import Loading from "./loading";
import { AiOutlineAlignRight } from "react-icons/ai";
import { CiShoppingTag } from "react-icons/ci";
import { logoutUser } from "@/service/auth";
import { VscGroupByRefType } from "react-icons/vsc";
import { LiaPercentageSolid } from "react-icons/lia";
import ModalProfile from "./(component)/ModalProfile";

const { Header, Sider, Content } = Layout;

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

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  const userInfo = useRecoilValue(userInfoSelector);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathname = usePathname();

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      logoutUser();
      localStorage.removeItem("userInfo");
      router.push("/login");
    } else if (e.key === "editProfile") {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (!userInfo?.email) {
      router.push("/login");
    }
  }, []);

  const handleMenu = (key) => {
    const page = key.key;
    router.push(`.${page}`);
  };

  const itemRole = () => {
    if (userInfo?.role === "admin") {
      return sidebarItem;
    }
    if (userInfo?.role === "user") {
      return sidebarItem.filter((i) => i.key !== "!accounts");
    }
    if (userInfo?.role === "management") {
      return sidebarItem.filter((i) => i.key !== "/accounts");
    }
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        theme="light"
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        className="border-r"
      >
        <div className="demo-logo-vertical h-[64px] border-b pl-7 pt-4">
          <Space>
            <MdHomeWork className="text-xl text-blue-800" />
            <h3 className="font-semibold text-xl  text-blue-700">Interior</h3>
          </Space>
        </div>
        <Menu
          selectedKeys={[pathname]}
          theme="light"
          mode="inline"
          onClick={handleMenu}
          items={itemRole() || []}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{ padding: 0, background: colorBgContainer, paddingRight: 24 }}
        >
          <div className="flex items-center justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="flex items-center">
              <Dropdown
                overlay={<Menu onClick={handleMenuClick} items={menuItems} />}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="flex bg-slate-100 rounded-full px-1 pr-3 h-[40px] items-center cursor-pointer">
                  <Avatar
                    size={32}
                    src={userInfo?.avatar?.url}
                    className="mr-2"
                  >
                    {(userInfo?.length > 0 && userInfo?.name[0]) || ""}
                  </Avatar>
                  <span className="text-gray-800 font-semibold">
                    {userInfo?.name}
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          className="min-h-[calc(100vh-120px)] thin-scroll overflow-y-auto"
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
          }}
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Content>
      </Layout>

      {visible && <ModalProfile visible={visible} setVisible={setVisible} />}
    </Layout>
  );
}
