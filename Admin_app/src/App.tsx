"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Container,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person,
  AdminPanelSettings,
  Upload,
  Visibility,
  Group,
  Assessment,
  AttachMoney,
  Business,
  BusinessCenter,
  Login,
} from "@mui/icons-material"
import { prefixer } from "stylis"
import rtlPlugin from "stylis-plugin-rtl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"

// Components
import GlobalContext from "./context/GlobalContext"
import axios from "axios"
import UserLogin from "./components/UserLogin"
import AdminLogin from "./components/AdminLogin"
import AdminRoute from "./components/AdminRoute"
import BusinessAndAdmin from "./components/BusinessAndAdmin"
import IncomAndExpennses from "./components/Incom&Expennses"
import ProductionReports from "./components/ProductionReports"
import RegisterBusinessData from "./components/RegisterBusinessData"
import UserManagemet from "./components/UserManagemet"
import UserRegister from "./components/UserRegister"
import Home from "./components/Home"
import UploadFiles from "./components/UploadFiles"
import DataViweing from "./components/DataViweing"

// Create RTL cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
})

// Create a custom theme with RTL support and Hebrew font
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f7ff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 280,
          backgroundColor: "#f8faff",
        },
      },
    },
    // Fix for RTL input fields and icons
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& .MuiInputAdornment-root": {
            marginLeft: 8,
            marginRight: 0,
          },
        },
      },
    },
    // Fix for Grid items in RTL
    MuiGrid: {
      styleOverrides: {
        root: {
          textAlign: "right",
        },
      },
    },
  },
})

const drawerWidth = 280

// Navigation items with icons
const navItems = [
  { text: "בית", path: "/", icon: <HomeIcon /> },
  { text: "רישום משתמש", path: "/register-user", icon: <Person /> },
  { text: "כניסת משתמש", path: "/user-login", icon: <Login /> },
  { text: "כניסת מנהל", path: "/admin-login", icon: <AdminPanelSettings /> },
  { text: "העלאת קבצים", path: "/upload-file", icon: <Upload /> },
  { text: "צפייה בנתונים", path: "/view-data", icon: <Visibility /> },
  { text: "ניהול משתמשים", path: "/user-management", icon: <Group /> },
  { text: 'דו"ח ייצור', path: "/production-reports", icon: <Assessment /> },
  { text: "ניהול הוצאות והכנסות", path: "/incom&Expennses", icon: <AttachMoney /> },
  { text: "רישום עסק חדש", path: "/business-register", icon: <Business /> },
  { text: "רישום עסק ומנהל חדש", path: "/register-admin&business", icon: <BusinessCenter /> },
]

// Responsive drawer component
function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ textAlign: "right" }}>
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          מערכת ניהול עסקים
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, marginLeft: 1, marginRight: 0 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, mr: 0, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            מערכת ניהול עסקים
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.slice(0, 5).map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                sx={{
                  mx: 0.5,
                  py: 1,
                  bgcolor: location.pathname === item.path ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid #e0e0e0" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh", // או 100vh אם רוצים שזה יתפוס את כל הגובה
            pt: 2,
          }}
        >
          <Container maxWidth="xl" sx={{ pt: 2 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register-user" element={<UserRegister />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/upload-file" element={<UploadFiles />} />
              <Route path="/register-admin&business" element={<BusinessAndAdmin />} />

              <Route
                path="/production-reports"
                element={
                  <AdminRoute>
                    <ProductionReports />
                  </AdminRoute>
                }
              />
              <Route
                path="/view-data"
                element={
                  <AdminRoute>
                    <DataViweing />
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
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

function App() {
  axios.defaults.withCredentials = true // הטוקן יישלח בכל קריאת אקסיוס

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalContext>
          <Router>
            <ResponsiveDrawer />
          </Router>
        </GlobalContext>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
