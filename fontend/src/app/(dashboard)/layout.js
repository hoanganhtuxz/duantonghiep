"use client";

import { useRecoilValue } from "recoil";
import { userInfoSelector } from "../../atom";
import { usePathname, useRouter } from "next/navigation";
import React, { useState ,useEffect ,Suspense} from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space } from "antd";
import Loading from "./loading";
import { MdHomeWork } from "react-icons/md";
import { logoutUser } from "@/service/auth";

import ProfileUser from "@/components/auth/profileUser";
import { menuItems, sidebarItem } from "@/utils/fakeJson";
import { getListStatus } from "@/service/data";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  const userInfo = useRecoilValue(userInfoSelector);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
 setOpen(true)
    }
  };

  useEffect(() => {
    if (!userInfo.email) {
      router.push("/login");
    }
    getListStatus()
  }, []);

  const handleMenu = (key) => {
    const page = key.key;
    router.push(`.${page}`);
  };

  const itemRole = () => {
    if (userInfo.role === "admin") {
      return sidebarItem;
    }
    if (userInfo.role === "user") {
      return sidebarItem.filter((i) => i.key !== "!accounts");
    }
    if (userInfo.role === "management") {
      return sidebarItem.filter((i) => i.key !== "/accounts");
    }
  };



 

  return (
    <>
      {/* <ProfileUser open={open} setOpen={setOpen} /> */}
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
            style={{
              padding: 0,
              background: colorBgContainer,
              paddingRight: 24,
            }}
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
                      {(userInfo.length > 0 && userInfo?.name[0]) || ""}
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
      </Layout>
    </>
  );
}
