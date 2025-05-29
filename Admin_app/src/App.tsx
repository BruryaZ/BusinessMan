//Brurya
"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { Layout, Menu, Button, Typography, Avatar, Space, Drawer, ConfigProvider, theme as antTheme } from "antd"
import { MenuOutlined, UserAddOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BuildOutlined, BankOutlined, BarChartOutlined, CrownOutlined, DollarOutlined, EyeOutlined, LoginOutlined, ShopOutlined, TeamOutlined, UploadOutlined, CloudDownloadOutlined } from "@ant-design/icons"
import { useMediaQuery } from "react-responsive"
import "./App.css"
import AdminLogin from "./components/AdminLogin"
import BusinessAndAdmin from "./components/BusinessAndAdmin"
import DataViewing from "./components/DataViweing"
import IncomAndExpennses from "./components/Incom&Expennses"
import ProductionReports from "./components/ProductionReports"
import RegisterBusinessData from "./components/RegisterBusinessData"
import UploadFiles from "./components/UploadFiles"
import UserLogin from "./components/UserLogin"
import UserManagemet from "./components/UserManagemet"
import UserRegister from "./components/UserRegister"
import GlobalContext from "./context/GlobalContext"
import AdminRoute from "./components/AdminRoute"
import { Home } from "@mui/icons-material"
import MyHome from "./components/MyHome"
import EditUserPage from "./components/EditUserPage"
import BusinessFiles from "./components/BusinessFiles"

// Components

const { Header, Sider, Content } = Layout
const { Title } = Typography

// Navigation items with icons
const navItems = [
  { key: "/", label: "בית", icon: <Home />, path: "/" },
  { key: "/register-user", label: "רישום משתמש", icon: <UserAddOutlined />, path: "/register-user" },
  { key: "/user-login", label: "כניסת משתמש", icon: <LoginOutlined />, path: "/user-login" },
  { key: "/admin-login", label: "כניסת מנהל", icon: <CrownOutlined />, path: "/admin-login" },
  { key: "/business-files", label: "קבצי העסק", icon: <CloudDownloadOutlined />, path: "/business-files" },
  { key: "/upload-file", label: "העלאת קבצים", icon: <UploadOutlined />, path: "/upload-file" },
  { key: "/view-data", label: "צפייה בנתונים", icon: <EyeOutlined />, path: "/view-data" },
  { key: "/user-management", label: "ניהול משתמשים", icon: <TeamOutlined />, path: "/user-management" },
  { key: "/production-reports", label: 'דו"ח ייצור', icon: <BarChartOutlined />, path: "/production-reports" },
  { key: "/incom&Expennses", label: "ניהול הוצאות והכנסות", icon: <DollarOutlined />, path: "/incom&Expennses" },
  { key: "/business-register", label: "רישום עסק חדש", icon: <ShopOutlined />, path: "/business-register" },
  {
    key: "/register-admin&business",
    label: "רישום עסק ומנהל חדש",
    icon: <BankOutlined />,
    path: "/register-admin&business",
  },
]

// Responsive drawer component
function ResponsiveDrawer() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isSmallScreen = useMediaQuery({ maxWidth: 1024 })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link to={item.path} onClick={(e) => e.stopPropagation()}>
        {item.label}
      </Link>
    ),
  }))

  const siderContent = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", direction: "rtl", width: "100%" }}>
      <div
        className="logo-section"
        style={{
          padding: "24px 16px",
          borderBottom: "1px solid #f0f0f0",
          textAlign: "center",
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Avatar
          size={collapsed ? 32 : 48}
          className="logo-avatar"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            marginBottom: collapsed ? 0 : 8,
          }}
        >
          <BuildOutlined />
        </Avatar>
        {!collapsed && (
          <Title level={4} className="logo-title" style={{ margin: "8px 0 0 0", color: "#667eea" }}>
            BusinessMan
          </Title>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="sidebar-menu"
        style={{
          border: "none",
          flex: 1,
          padding: "8px",
          direction: "rtl",
        }}
        items={menuItems}
        onClick={(e) => {
          e.domEvent.stopPropagation()
          if (isMobile) setMobileOpen(false)
        }}
      />

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #f0f0f0",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
          © 2025 BusinessMan
        </Typography.Text>
      </div>
    </div>
  )

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        algorithm: antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#667eea",
          borderRadius: 10,
          fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", width: "100%", direction: "rtl" }}>
        {/* Desktop Sider */}
        {!isMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={280}
            collapsedWidth={80}
            className="desktop-sider"
            style={{
              background: "#fff",
              position: "fixed",
              height: "100vh",
              right: 0,
              top: 0,
              zIndex: 1001,
              boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            {siderContent}
          </Sider>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            title={
              <Space style={{ direction: "rtl" }}>
                <Avatar style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <BuildOutlined />
                </Avatar>
                <span>BusinessMan</span>
              </Space>
            }
            placement="right"
            onClose={handleDrawerToggle}
            open={mobileOpen}
            width={280}
            className="mobile-drawer"
            style={{ padding: 0, direction: "rtl" }}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{ border: "none", direction: "rtl" }}
              items={menuItems}
              onClick={handleDrawerToggle}
            />
          </Drawer>
        )}

        <Layout
          className={`main-layout ${collapsed ? "collapsed" : ""}`}
          style={{
            marginRight: isMobile ? 0 : collapsed ? 80 : 280,
            width: isMobile ? "100%" : collapsed ? "calc(100% - 80px)" : "calc(100% - 280px)",
            minHeight: "100vh",
            direction: "rtl",
          }}
        >
          <Header
            className="main-header"
            style={{
              background: "#fff",
              padding: "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 100,
              width: "100%",
              direction: "rtl",
              height: "64px",
            }}
          >
            <Space style={{ direction: "rtl" }}>
              <Button
                type="text"
                className="menu-toggle-btn"
                icon={isMobile ? <MenuOutlined /> : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={isMobile ? handleDrawerToggle : handleCollapse}
                style={{ fontSize: "16px" }}
              />
              <Space style={{ direction: "rtl" }}>
                <BuildOutlined className="header-icon" style={{ color: "#667eea", fontSize: "20px" }} />
                <Title level={4} className="header-title" style={{ margin: 0, color: "#2d3748" }}>
                  מערכת ניהול עסקים
                </Title>
              </Space>
            </Space>

            {!isSmallScreen && (
              <Space className="header-nav" style={{ direction: "rtl" }}>
                {navItems.slice(0, 4).map((item) => (
                  <Button
                    key={item.key}
                    type={location.pathname === item.path ? "primary" : "text"}
                    icon={item.icon}
                    className="nav-btn"
                    style={{
                      borderRadius: "8px",
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={item.path} onClick={(e) => e.stopPropagation()}>
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </Space>
            )}
          </Header>

          <Content
            className="main-content"
            style={{
              padding: "0",
              background: "transparent",
              minHeight: "calc(100vh - 64px)",
              width: "100%",
              overflow: "auto",
              direction: "rtl",
              paddingTop: "20px",
            }}
          >
            <div
              className="content-wrapper"
              style={{
                minHeight: "calc(100vh - 84px)",
                padding: "20px 24px 24px 24px",
              }}
            >
              <Routes>
                <Route path="/" element={<MyHome />} />
                <Route path="/register-user" element={<UserRegister />} />
                <Route path="/user-login" element={<UserLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/upload-file" element={<UploadFiles />} />
                <Route path="/register-admin&business" element={<BusinessAndAdmin />} />
                <Route path="/edit-user/:id" element={<EditUserPage />} />

                <Route
                  path="/production-reports"
                  element={
                    <AdminRoute>
                      <ProductionReports />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/business-files"
                  element={
                    <AdminRoute>
                      <BusinessFiles />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/view-data"
                  element={
                    <AdminRoute>
                      <DataViewing />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/user-management"
                  element={
                    <AdminRoute>
                      <UserManagemet />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/business-register"
                  element={
                    <AdminRoute>
                      <RegisterBusinessData />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/incom&Expennses"
                  element={
                    <AdminRoute>
                      <IncomAndExpennses />
                    </AdminRoute>
                  }
                />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", direction: "rtl" }}>
      <GlobalContext>
        <Router>
          <ResponsiveDrawer />
        </Router>
      </GlobalContext>
    </div>
  )
}

export default App