// "use client"

// import { useState, useEffect, useContext } from "react"
// import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
// import {
//   Layout,
//   Menu,
//   Typography,
//   Avatar,
//   Space,
//   Drawer,
//   ConfigProvider,
//   theme as antTheme,
// } from "antd"
// import {
//   MenuOutlined,
//   UserAddOutlined,
//   BuildOutlined,
//   BankOutlined,
//   BarChartOutlined,
//   CrownOutlined,
//   DollarOutlined,
//   EyeOutlined,
//   LoginOutlined,
//   TeamOutlined,
//   UploadOutlined,
//   CloudDownloadOutlined,
// } from "@ant-design/icons"
// import { useMediaQuery } from "react-responsive"
// import "./App.css"

// import AdminLogin from "./components/AdminLogin"
// import BusinessAndAdmin from "./components/BusinessAndAdmin"
// import ProductionReports from "./components/ProductionReports"
// import UploadFiles from "./components/UploadFiles"
// import UserLogin from "./components/UserLogin"
// import UserRegister from "./components/UserRegister"
// import GlobalContext, { globalContext } from "./context/GlobalContext"
// import { Home } from "@mui/icons-material"
// import MyHome from "./components/MyHome"
// import EditUserPage from "./components/EditUserPage"
// import BusinessFiles from "./components/BusinessFiles"
// import AccountTransactions from "./components/AccountTransactions"
// import DataViewing from "./components/DataViweing"
// import UserManagement from "./components/UserManagemet"

// const { Header, Sider, Content } = Layout
// const { Title } = Typography

// const navItems = [
//   { key: "/", label: "בית", icon: <Home />, path: "/" },
//   { key: "/register-user", label: "רישום משתמש", icon: <UserAddOutlined />, path: "/register-user" },
//   { key: "/user-login", label: "כניסת משתמש", icon: <LoginOutlined />, path: "/user-login" },
//   { key: "/admin-login", label: "כניסת מנהל", icon: <CrownOutlined />, path: "/admin-login" },
//   { key: "/business-files", label: "קבצי העסק", icon: <CloudDownloadOutlined />, path: "/business-files" },
//   { key: "/upload-file", label: "העלאת קבצים", icon: <UploadOutlined />, path: "/upload-file" },
//   { key: "/view-data", label: "צפייה בנתונים", icon: <EyeOutlined />, path: "/view-data" },
//   { key: "/user-management", label: "משתמשים", icon: <TeamOutlined />, path: "/user-management" },
//   { key: "/production-reports", label: 'דו"ח ייצור', icon: <BarChartOutlined />, path: "/production-reports" },
//   { key: "/account-transactions", label: "הוספת תנועה בחשבון", icon: <DollarOutlined />, path: "/account-transactions" },
//   {
//     key: "/register-admin&business",
//     label: "רישום עסק ומנהל חדש",
//     icon: <BankOutlined />,
//     path: "/register-admin&business",
//   },
// ]

// function ResponsiveDrawer() {
//   const [collapsed] = useState(false)
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const location = useLocation()
//   const isMobile = useMediaQuery({ maxWidth: 768 })
//   const globalContextDetails = useContext(globalContext)

//   const [pageTitle, setPageTitle] = useState("")
//   const [clientName, setClientName] = useState('אורח')

//   useEffect(() => {
//     const routeTitles: { [key: string]: string } = {
//       "/": "דף הבית",
//       "/register-user": "רישום משתמש",
//       "/user-login": "כניסת משתמש",
//       "/admin-login": "כניסת מנהל",
//       "/business-files": "קבצי העסק",
//       "/upload-file": "העלאת קבצים",
//       "/view-data": "צפייה בנתונים",
//       "/user-management": "ניהול משתמשים",
//       "/production-reports": 'דו"ח ייצור',
//       "/account-transactions": "תנועות חשבון",
//       "/register-admin&business": "רישום עסק ומנהל",
//     }

//     if (location.pathname.startsWith("/edit-user/")) {
//       setPageTitle("עריכת משתמש")
//     } else {
//       setPageTitle(routeTitles[location.pathname] || "עמוד לא מזוהה")
//     }

//     setClientName("שלום, " + globalContextDetails.user.firstName)
//   }, [location.pathname])

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen)
//   }

//   const menuItems = navItems.map((item) => ({
//     key: item.key,
//     icon: item.icon,
//     label: (
//       <Link to={item.path} onClick={(e) => e.stopPropagation()}>
//         {item.label}
//       </Link>
//     ),
//   }))

//   const siderContent = (
//     <div
//       style={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         direction: "rtl",
//         width: "100%",
//       }}
//     >
//       <div
//         className="logo-section"
//         style={{
//           padding: "24px 16px",
//           borderBottom: "1px solid #f0f0f0",
//           textAlign: "center",
//           direction: "rtl",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//         }}
//       >
//         <Avatar
//           size={collapsed ? 32 : 48}
//           className="logo-avatar"
//           style={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             marginBottom: collapsed ? 0 : 8,
//           }}
//         >
//           <BuildOutlined />
//         </Avatar>
//         {!collapsed && (
//           <Title level={4} className="logo-title" style={{ margin: "8px 0 0 0", color: blue }}>
//             BusinessMan
//           </Title>
//         )}
//       </div>

//       <Menu
//         mode="inline"
//         selectedKeys={[location.pathname]}
//         className="sidebar-menu"
//         style={{
//           border: "none",
//           flex: 1,
//           padding: "8px",
//           direction: "rtl",
//           backgroundColor: '#7354af0f'
//         }}
//         items={menuItems}
//         onClick={(e) => {
//           e.domEvent.stopPropagation()
//           if (isMobile) setMobileOpen(false)
//         }}
//       />

//       <div
//         style={{
//           padding: "16px",
//           borderTop: "1px solid #f0f0f0",
//           textAlign: "center",
//           direction: "rtl",
//         }}
//       >
//         <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
//           © 2025 BusinessMan
//         </Typography.Text>
//       </div>
//     </div>
//   )

//   return (
//     <ConfigProvider
//       direction="rtl"
//       theme={{
//         algorithm: antTheme.defaultAlgorithm,
//         token: {
//           colorPrimary: blue,
//           borderRadius: 10,
//           fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
//         },
//       }}
//     >
//       <Layout style={{ minHeight: "100vh", width: "100%", direction: "rtl" }}>
//         {!isMobile && (
//           <Sider
//             trigger={null}
//             collapsible
//             collapsed={collapsed}
//             width={280}
//             collapsedWidth={80}
//             className="desktop-sider"
//             style={{
//               background: "#fff",
//               position: "fixed",
//               height: "100vh",
//               right: 0,
//               top: 0,
//               zIndex: 1001,
//               boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.05)",
//             }}
//           >
//             {siderContent}
//           </Sider>
//         )}

//         {isMobile && (
//           <Drawer
//             title={
//               <Space style={{ direction: "rtl" }}>
//                 <Avatar style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
//                   <BuildOutlined />
//                 </Avatar>
//                 <span>BusinessMan</span>
//               </Space>
//             }
//             placement="right"
//             onClose={handleDrawerToggle}
//             open={mobileOpen}
//             width={280}
//             className="mobile-drawer"
//             style={{ padding: 0, direction: "rtl" }}
//           >
//             <Menu
//               mode="inline"
//               selectedKeys={[location.pathname]}
//               style={{ border: "none", direction: "rtl" }}
//               items={menuItems}
//               onClick={handleDrawerToggle}
//             />
//           </Drawer>
//         )}

//         <Layout
//           className={`main-layout ${collapsed ? "collapsed" : ""}`}
//           style={{
//             marginRight: isMobile ? 0 : collapsed ? 80 : 280,
//             width: isMobile ? "100%" : collapsed ? "calc(100% - 80px)" : "calc(100% - 280px)",
//             minHeight: "100vh",
//             direction: "rtl",
//           }}
//         >
//           <Header
//             style={{
//               background: "#fff",
//               padding: "0 24px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexDirection: "row-reverse",
//               position: "fixed",
//               top: 0,
//               zIndex: 100,
//               height: "64px",
//               width: isMobile ? "100%" : collapsed ? "calc(100% - 80px)" : "calc(100% - 280px)",
//               right: isMobile ? 0 : collapsed ? 80 : 280,
//             }}
//           >

//             <Space
//               size="middle"
//               style={{ alignItems: "center", flexDirection: "row-reverse", flex: 1, justifyContent: "space-between" }}
//             >
//               {/* pageTitle מוצג בצד ימין */}
//               {!isMobile && (
//                 <Title level={5} style={{ margin: 0, color: "#444" }}>
//                   {pageTitle}
//                 </Title>
//               )}

//               <Space size="middle" style={{ alignItems: "center", flexDirection: "row-reverse" }}>
//                 {!isMobile && (
//                   <Avatar
//                     style={{
//                       height: "40px",
//                       width: "100px",
//                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       borderRadius: "10px",
//                       padding: "0 8px",
//                       fontSize: "22px",
//                     }}
//                   >
//                     {clientName ? clientName : "אורח"}
//                   </Avatar>
//                 )}

//                 {isMobile && (
//                   <MenuOutlined
//                     style={{ fontSize: "20px", cursor: "pointer", color: blue }}
//                     onClick={handleDrawerToggle}
//                   />
//                 )}
//               </Space>
//             </Space>
//           </Header>
//           <Content
//             style={{
//               margin: "24px 24px 24px 24px",
//               // padding: 24,
//               paddingTop: 99, // הוספה: גובה ה־Header + מרווח
//               background: "#fff",
//               minHeight: 280,
//               direction: "rtl",
//               overflow: "auto",
//             }}
//           >
//             <Routes>
//               <Route path="/" element={<MyHome />} />
//               <Route path="/register-user" element={<UserRegister />} />
//               <Route path="/user-login" element={<UserLogin />} />
//               <Route path="/admin-login" element={<AdminLogin />} />
//               <Route path="/business-files" element={<BusinessFiles />} />
//               <Route path="/upload-file" element={<UploadFiles />} />
//               <Route path="/view-data" element={<DataViewing />} />
//               <Route path="/user-management" element={<UserManagement />} />
//               <Route path="/production-reports" element={<ProductionReports />} />
//               <Route path="/account-transactions" element={<AccountTransactions />} />
//               <Route path="/register-admin&business" element={<BusinessAndAdmin />} />
//               <Route path="/edit-user/:id" element={<EditUserPage />} />
//             </Routes>
//           </Content>
//         </Layout>
//       </Layout>
//     </ConfigProvider>
//   )
// }

// export default function App() {
//   return (
//     <Router>
//       <GlobalContext>
//         <ResponsiveDrawer />
//       </GlobalContext>
//     </Router>
//   )
// }


//App.tsx - גרסה מתוקנת לרספונסיביות

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
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isTablet = useMediaQuery({ maxWidth: 1024, minWidth: 769 })
  const globalContextDetails = useContext(globalContext)

  const [pageTitle, setPageTitle] = useState("")

  // התאמה דינמית לגודל מסך
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else if (isTablet) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [isMobile, isTablet])

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
      "/term-of-service":"תנאי שימוש"
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
          padding: collapsed ? "16px 8px" : "24px 16px",
          borderBottom: "1px solid #f0f0f0",
          textAlign: "center",
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: collapsed ? 64 : 88,
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
          <Title level={4} className="logo-title" style={{ margin: "8px 0 0 0", color: blue }}>
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
          backgroundColor: '#7354af0f',
          // overflowY: "auto",
        }}
        items={menuItems}
        onClick={(e) => {
          e.domEvent.stopPropagation()
          if (isMobile) setMobileOpen(false)
        }}
      />

      <div
        style={{
          padding: collapsed ? "8px" : "16px",
          borderTop: "1px solid #f0f0f0",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography.Text type="secondary" style={{ fontSize: collapsed ? "10px" : "12px" }}>
          © 2025 BusinessMan
        </Typography.Text>
      </div>
    </div>
  )

  // חישוב רוחב דינמי
  const siderWidth = collapsed ? 80 : 280
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
          borderRadius: 10,
          fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", height: "100vh", width: "100%", direction: "rtl", overflow: "hidden" }}>
        {!isMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={280}
            collapsedWidth={80}
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
            marginRight,
            width: contentWidth,
            height: "100vh",
            direction: "rtl",
            overflow: "hidden",
          }}
        >
          <Header
            style={{
              background: "#fff",
              padding: isMobile ? "0 16px" : "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              position: "fixed",
              top: 0,
              zIndex: 1000,
              height: "64px",
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
              {!isMobile && (
                <Title level={5} style={{ margin: 0, color: "#444", flex: 1, textAlign: "center" }}>
                  {pageTitle}
                </Title>
              )}

              {/* כפתור כניסה/יציאה מהתפריט הצידי */}
              {!isMobile && (
                <MenuOutlined
                  style={{
                    fontSize: "18px",
                    cursor: "pointer",
                    color: blue,
                    marginLeft: "16px",
                  }}
                  onClick={() => setCollapsed(!collapsed)}
                />
              )}

            </Space>
          </Header>

          <Content
            style={{
              margin: 0,
              padding: isMobile ? "80px 16px 16px 16px" : "88px 24px 24px 24px",
              background: "#ffffff",
              height: "100vh",
              direction: "rtl",
              // overflowY: "auto",
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
              <Route path="/term-of-service" element={<TermsOfService/>}/>
              <Route path="/private-policy" element={<PrivacyPolicy/>}/>

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
