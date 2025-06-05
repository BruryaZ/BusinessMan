"use client"

import { useState, useEffect, useContext } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Space,
  Drawer,
  ConfigProvider,
  theme as antTheme,
} from "antd"
import {
  MenuOutlined,
  UserAddOutlined,
  BuildOutlined,
  BankOutlined,
  BarChartOutlined,
  CrownOutlined,
  DollarOutlined,
  EyeOutlined,
  LoginOutlined,
  TeamOutlined,
  UploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons"
import { useMediaQuery } from "react-responsive"
import "./App.css"

import AdminLogin from "./components/AdminLogin"
import BusinessAndAdmin from "./components/BusinessAndAdmin"
import ProductionReports from "./components/ProductionReports"
import UploadFiles from "./components/UploadFiles"
import UserLogin from "./components/UserLogin"
import UserRegister from "./components/UserRegister"
import GlobalContext, { globalContext } from "./context/GlobalContext"
import { Home } from "@mui/icons-material"
import MyHome from "./components/MyHome"
import EditUserPage from "./components/EditUserPage"
import BusinessFiles from "./components/BusinessFiles"
import AccountTransactions from "./components/AccountTransactions"
import DataViewing from "./components/DataViweing"
import UserManagement from "./components/UserManagemet"

const { Header, Sider, Content } = Layout
const { Title } = Typography

const navItems = [
  { key: "/", label: "בית", icon: <Home />, path: "/" },
  { key: "/register-user", label: "רישום משתמש", icon: <UserAddOutlined />, path: "/register-user" },
  { key: "/user-login", label: "כניסת משתמש", icon: <LoginOutlined />, path: "/user-login" },
  { key: "/admin-login", label: "כניסת מנהל", icon: <CrownOutlined />, path: "/admin-login" },
  { key: "/business-files", label: "קבצי העסק", icon: <CloudDownloadOutlined />, path: "/business-files" },
  { key: "/upload-file", label: "העלאת קבצים", icon: <UploadOutlined />, path: "/upload-file" },
  { key: "/view-data", label: "צפייה בנתונים", icon: <EyeOutlined />, path: "/view-data" },
  { key: "/user-management", label: "משתמשים", icon: <TeamOutlined />, path: "/user-management" },
  { key: "/production-reports", label: 'דו"ח ייצור', icon: <BarChartOutlined />, path: "/production-reports" },
  { key: "/account-transactions", label: "הוספת תנועה בחשבון", icon: <DollarOutlined />, path: "/account-transactions" },
  {
    key: "/register-admin&business",
    label: "רישום עסק ומנהל חדש",
    icon: <BankOutlined />,
    path: "/register-admin&business",
  },
]

function ResponsiveDrawer() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const globalContextDetails = useContext(globalContext)

  const [pageTitle, setPageTitle] = useState("")
  const [clientName, setClientName] = useState('אורח')

  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      "/": "דף הבית",
      "/register-user": "רישום משתמש",
      "/user-login": "כניסת משתמש",
      "/admin-login": "כניסת מנהל",
      "/business-files": "קבצי העסק",
      "/upload-file": "העלאת קבצים",
      "/view-data": "צפייה בנתונים",
      "/user-management": "ניהול משתמשים",
      "/production-reports": 'דו"ח ייצור',
      "/account-transactions": "תנועות חשבון",
      "/register-admin&business": "רישום עסק ומנהל",
    }

    if (location.pathname.startsWith("/edit-user/")) {
      setPageTitle("עריכת משתמש")
    } else {
      setPageTitle(routeTitles[location.pathname] || "עמוד לא מזוהה")
    }

    setClientName(globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName)
  }, [location.pathname])

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
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
        width: "100%",
      }}
    >
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
            style={{
              background: "#fff",
              padding: "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row-reverse", // כבר מוגדר
              position: "sticky",
              top: 0,
              zIndex: 100,
              height: "64px",
            }}
          >
            <Space
              size="middle"
              style={{ alignItems: "center", flexDirection: "row-reverse", flex: 1, justifyContent: "space-between" }}
            >
              {/* pageTitle מוצג בצד ימין */}
              {!isMobile && (
                <Title level={5} style={{ margin: 0, color: "#444" }}>
                  {pageTitle}
                </Title>
              )}

              <Space size="middle" style={{ alignItems: "center", flexDirection: "row-reverse" }}>
                {!isMobile && (
                  <Avatar
                    size={32}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "10px",
                      width: "62px",
                      height: "32px",
                    }}
                  >
                    {clientName ? clientName : "אורח"}
                  </Avatar>
                )}

                {isMobile && (
                  <MenuOutlined
                    style={{ fontSize: "20px", cursor: "pointer", color: "#667eea" }}
                    onClick={handleDrawerToggle}
                  />
                )}
              </Space>
            </Space>
          </Header>


          <Content
            style={{
              margin: "24px 24px 24px 24px",
              padding: 24,
              background: "#fff",
              minHeight: 280,
              direction: "rtl",
              overflow: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<MyHome />} />
              <Route path="/register-user" element={<UserRegister />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/business-files" element={<BusinessFiles />} />
              <Route path="/upload-file" element={<UploadFiles />} />
              <Route path="/view-data" element={<DataViewing />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/production-reports" element={<ProductionReports />} />
              <Route path="/account-transactions" element={<AccountTransactions />} />
              <Route path="/register-admin&business" element={<BusinessAndAdmin />} />
              <Route path="/edit-user/:id" element={<EditUserPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default function App() {
  return (
    <Router>
      <GlobalContext>
        <ResponsiveDrawer />
      </GlobalContext>
    </Router>
  )
}
