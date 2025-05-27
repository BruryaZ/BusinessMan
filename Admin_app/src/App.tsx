"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import {
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
  AppBar as MuiAppBar,
  styled,
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
  ChevronLeft,
  Dashboard,
} from "@mui/icons-material"
import { prefixer } from "stylis"
import rtlPlugin from "stylis-plugin-rtl"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import './App.css'

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
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: "#2563eb", // Modern blue
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f97316", // Vibrant orange
      light: "#fdba74",
      dark: "#c2410c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          padding: "10px 20px",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        },
        contained: {
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",
          "&.Mui-selected": {
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            color: "#2563eb",
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.15)",
            },
            "& .MuiListItemIcon-root": {
              color: "#2563eb",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "none",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        },
      },
    },
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

// Responsive drawer component
function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box component="img" src="/logo.svg" alt="BusinessMan Logo" sx={{ height: 40, width: 40, mr: 1.5 }} />
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            BusinessMan
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List component="nav" sx={{ flexGrow: 1, px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemText primary={item.text} /> <ListItemIcon sx={{padding:1.2, minWidth: 36, color: location.pathname === item.path ? "primary.main" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 BusinessMan
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          ...(open && !isMobile && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={isMobile ? handleDrawerToggle : handleDrawerOpen}
            sx={{ mr: 2, ...(open && !isMobile && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Dashboard sx={{ display: { xs: "none", sm: "block" }, mr: 1, color: "primary.main" }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              מערכת ניהול עסקים
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.slice(0, 4).map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                color={location.pathname === item.path ? "primary" : "inherit"}
                variant={location.pathname === item.path ? "contained" : "text"}
                startIcon={item.icon}
                sx={{
                  mx: 0.5,
                  py: 1,
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  "& .MuiButton-startIcon": {
                    marginLeft: 1.5,
                    marginRight: -0.5,
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
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
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              borderRight: "1px solid rgba(0, 0, 0, 0.05)",
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              width: open ? drawerWidth : theme.spacing(9), // הגדרת width רק פעם אחת
            },
          }}
          open={open}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", md: `calc(100% - ${open ? drawerWidth : theme.spacing(9)}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
          mt: { xs: 7, sm: 8 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
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
  )
}

function App() {
  // axios.defaults.withCredentials = true // הטוקן יישלח בכל קריאת אקסיוס

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
