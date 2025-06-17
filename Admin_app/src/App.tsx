"use client"

import { useState, useEffect, useContext } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { Layout, Menu, Typography, Avatar, Space, Drawer, ConfigProvider, theme as antTheme, Button } from "antd"
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
  CloseOutlined,
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
import AdminRoute from "./components/AdminRoute"
import RegisterBusinessData from "./components/RegisterBusinessData"
import UserManagemet from "./components/UserManagemet"
import ContactUs from "./components/ContactUs"
import TermsOfService from "./components/TermsOfService"
import PrivacyPolicy from "./components/PrivacyPolicy"

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
  { key: "/account-transactions", label: "תנועות בחשבון", icon: <DollarOutlined />, path: "/account-transactions" },
  {
    key: "/register-admin&business",
    label: "רישום עסק ומנהל חדש",
    icon: <BankOutlined />,
    path: "/register-admin&business",
  },
]

// Global colors:
export const orange = "#fa8c16"
export const blue = "#1677ff"
export const green = "#52c41a"
export const purple = "#722ed1"

function ResponsiveDrawer() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // רספונסיביות מתקדמת
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
  const isDesktop = useMediaQuery({ minWidth: 1024 })
  const isSmallMobile = useMediaQuery({ maxWidth: 479 })
  const isLargeMobile = useMediaQuery({ minWidth: 480, maxWidth: 767 })

  const globalContextDetails = useContext(globalContext)
  const [pageTitle, setPageTitle] = useState("")

  // התאמה דינמית לגודל מסך עם עדיפויות ברורות
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else if (isTablet) {
      setCollapsed(false)
    } else if (isDesktop) {
      setCollapsed(false)
    }
  }, [isMobile, isTablet, isDesktop])

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
      "/concat-us": "צור קשר",
      "/private-policy": "פרטיות",
      "/term-of-service": "תנאי שימוש",
    }

    if (location.pathname.startsWith("/edit-user/")) {
      setPageTitle("עריכת משתמש")
    } else {
      setPageTitle(routeTitles[location.pathname] || "עמוד לא מזוהה")
    }
  }, [location.pathname, globalContextDetails.user.firstName])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
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

  // מחשוב רוחב דינמי מתקדם
  const getSiderWidth = () => {
    if (isMobile) return 0
    if (isTablet) return collapsed ? 60 : 220
    return collapsed ? 80 : 280
  }

  const siderWidth = getSiderWidth()
  const headerHeight = isMobile ? 56 : isTablet ? 60 : 64

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
          padding:
            collapsed || isMobile ? (isSmallMobile ? "8px 4px" : "12px 8px") : isTablet ? "16px 12px" : "24px 16px",
          borderBottom: "1px solid #f0f0f0",
          textAlign: "center",
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: collapsed || isMobile ? (isSmallMobile ? 48 : 56) : isTablet ? 72 : 88,
        }}
      >
        <Avatar
          size={collapsed || isMobile ? (isSmallMobile ? 24 : 28) : isTablet ? 40 : 48}
          className="logo-avatar"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            marginBottom: collapsed || isMobile ? 0 : isTablet ? 6 : 8,
          }}
        >
          <BuildOutlined />
        </Avatar>
        {!collapsed && !isMobile && (
          <Title
            level={isTablet ? 5 : 4}
            className="logo-title"
            style={{
              margin: `${isTablet ? 6 : 8}px 0 0 0`,
              color: blue,
              fontSize: isTablet ? "14px" : "16px",
            }}
          >
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
          padding: isMobile ? "4px" : isTablet ? "6px" : "8px",
          direction: "rtl",
          backgroundColor: "#7354af0f",
          fontSize: isSmallMobile ? "12px" : isMobile ? "13px" : isTablet ? "14px" : "15px",
        }}
        items={menuItems}
        onClick={(e) => {
          e.domEvent.stopPropagation()
          if (isMobile) setMobileOpen(false)
        }}
        inlineCollapsed={collapsed && !isMobile}
      />

      <div
        style={{
          padding: collapsed || isMobile ? (isSmallMobile ? "6px" : "8px") : isTablet ? "12px" : "16px",
          borderTop: "1px solid #f0f0f0",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography.Text
          type="secondary"
          style={{
            fontSize: collapsed || isMobile ? (isSmallMobile ? "8px" : "10px") : isTablet ? "11px" : "12px",
          }}
        >
          © 2025 BusinessMan
        </Typography.Text>
      </div>
    </div>
  )

  const headerWidth = isMobile ? "100%" : `calc(100% - ${siderWidth}px)`
  const contentWidth = isMobile ? "100%" : `calc(100% - ${siderWidth}px)`
  const marginRight = isMobile ? 0 : siderWidth

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        algorithm: antTheme.defaultAlgorithm,
        token: {
          colorPrimary: blue,
          borderRadius: isMobile ? 6 : isTablet ? 8 : 10,
          fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
          fontSize: isSmallMobile ? 12 : isMobile ? 13 : isTablet ? 14 : 16,
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          height: "100vh",
          width: "100%",
          direction: "rtl",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={isTablet ? 220 : 280}
            collapsedWidth={isTablet ? 60 : 80}
            className="desktop-sider"
            style={{
              background: "#ffffff",
              position: "fixed",
              height: "100vh",
              right: 0,
              top: 0,
              zIndex: 1001,
              boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.05)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {siderContent}
          </Sider>
        )}

        {isMobile && (
          <Drawer
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Space style={{ direction: "rtl" }}>
                  <Avatar
                    size={isSmallMobile ? 32 : 36}
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                  >
                    <BuildOutlined />
                  </Avatar>
                  <span style={{ fontSize: isSmallMobile ? "14px" : "16px" }}>BusinessMan</span>
                </Space>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={handleDrawerToggle}
                  size={isSmallMobile ? "small" : "middle"}
                  style={{ marginLeft: "8px" }}
                />
              </div>
            }
            placement="right"
            onClose={handleDrawerToggle}
            open={mobileOpen}
            width={isSmallMobile ? "85%" : isLargeMobile ? "50%" : 280}
            className="mobile-drawer"
            style={{ padding: 0, direction: "rtl" }}
            closable={false}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{
                border: "none",
                direction: "rtl",
                fontSize: isSmallMobile ? "13px" : "14px",
              }}
              items={menuItems}
              onClick={handleDrawerToggle}
            />
          </Drawer>
        )}

        <Layout
          className={`main-layout ${collapsed ? "collapsed" : ""}`}
          style={{
            marginRight,
            width: contentWidth,
            height: "100vh",
            direction: "rtl",
          }}
        >
          <Header
            style={{
              background: "#fff",
              padding: isMobile ? (isSmallMobile ? "0 8px" : "0 12px") : isTablet ? "0 16px" : "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              position: "fixed",
              top: 0,
              zIndex: 1000,
              height: `${headerHeight}px`,
              width: headerWidth,
              right: marginRight,
            }}
          >
            <Space
              size={isMobile ? "small" : "middle"}
              style={{
                alignItems: "center",
                flexDirection: "row-reverse",
                flex: 1,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* כותרת העמוד */}
              <Title
                level={isMobile ? 5 : isTablet ? 5 : 5}
                style={{
                  margin: 0,
                  color: "#444",
                  flex: 1,
                  textAlign: isMobile ? "right" : "center",
                  fontSize: isSmallMobile ? "12px" : isMobile ? "14px" : isTablet ? "16px" : "18px",
                }}
              >
                {isMobile && pageTitle.length > 15 ? `${pageTitle.substring(0, 12)}...` : pageTitle}
              </Title>

              {/* כפתור תפריט */}
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={isMobile ? handleDrawerToggle : () => setCollapsed(!collapsed)}
                style={{
                  fontSize: isSmallMobile ? "14px" : isMobile ? "16px" : "18px",
                  color: blue,
                  padding: isMobile ? "4px" : "8px",
                  height: isSmallMobile ? "32px" : isMobile ? "36px" : "40px",
                  width: isSmallMobile ? "42px" : isMobile ? "36px" : "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Space>
          </Header>

          <Content
            style={{
              margin: 0,
              padding: isMobile
                ? isSmallMobile
                  ? `${headerHeight + 12}px 8px 8px 8px`
                  : `${headerHeight + 16}px 12px 12px 12px`
                : isTablet
                  ? `${headerHeight + 16}px 16px 16px 16px`
                  : `${headerHeight + 24}px 24px 24px 24px`,
              background: "#ffffff",
              minHeight: "100vh",
              direction: "rtl",
              overflowY: "auto",
              overflowX: "hidden",
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
              <Route path="/concat-us" element={<ContactUs />} />
              <Route path="/term-of-service" element={<TermsOfService />} />
              <Route path="/private-policy" element={<PrivacyPolicy />} />

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
                path="/account-transactions"
                element={
                  <AdminRoute>
                    <AccountTransactions />
                  </AdminRoute>
                }
              />
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
