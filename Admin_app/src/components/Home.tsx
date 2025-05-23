"use client"

import { useContext } from "react"
import { globalContext } from "../context/GlobalContext"
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  Stack,
  Divider,
} from "@mui/material"
import {
  Dashboard,
  Business,
  AttachMoney,
  BarChart,
  ArrowForward,
  TrendingUp,
  Group,
  Visibility,
  Upload,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const globalContextDetails = useContext(globalContext)
  const navigate = useNavigate()

  const menuItems = [
    {
      title: "לוח בקרה",
      icon: <Dashboard fontSize="large" color="primary" />,
      description: "צפה בנתונים עדכניים של העסק שלך",
      path: "/view-data",
    },
    {
      title: "פרטי העסק",
      icon: <Business fontSize="large" color="primary" />,
      description: "נהל את פרטי העסק שלך",
      path: "/business-register",
    },
    {
      title: "הכנסות והוצאות",
      icon: <AttachMoney fontSize="large" color="primary" />,
      description: "נהל את התקציב והתזרים של העסק",
      path: "/incom&Expennses",
    },
    {
      title: "דוחות",
      icon: <BarChart fontSize="large" color="primary" />,
      description: "צפה בדוחות ביצועים ותחזיות",
      path: "/production-reports",
    },
  ]

  const quickActions = [
    { title: "צפייה בנתונים", icon: <Visibility />, path: "/view-data" },
    { title: "העלאת קבצים", icon: <Upload />, path: "/upload-file" },
    { title: "ניהול משתמשים", icon: <Group />, path: "/user-management" },
  ]

  return (
    <Box sx={{ py: 4, textAlign: "right" }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 5,
          borderRadius: 4,
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          color: "white",
          boxShadow: "0 10px 40px rgba(37, 99, 235, 0.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            backgroundImage: "url('/placeholder.svg?height=500&width=500')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} {...({} as any)}>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                שלום, {globalContextDetails.user?.firstName || "אורח"} {globalContextDetails.user?.lastName || ""}
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                ברוכים הבאים למערכת BusinessMan - הדרך החכמה לנהל את העסק שלך
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                נהל את העסק שלך בקלות ויעילות עם כלים מתקדמים לניהול הכנסות, הוצאות, משתמשים ודוחות.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate("/view-data")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)",
                  }}
                >
                  צפה בנתוני העסק
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/business-register")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  עדכן פרטי עסק
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }} {...({} as any)}>
              <Box
                component="img"
                src="/placeholder.svg?height=300&width=400"
                alt="Business Dashboard"
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                  transform: "perspective(1000px) rotateY(-10deg) rotateX(5deg)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} {...({} as any)}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  borderRadius: "0 0 0 100%",
                  bgcolor: "primary.light",
                  opacity: 0.1,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.main",
                    width: 48,
                    height: 48,
                  }}
                >
                  <AttachMoney />
                </Avatar>
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                ₪10,500
              </Typography>
              <Typography variant="body2" color="text.secondary">
                הכנסות החודש
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
                <TrendingUp sx={{ color: "success.main", fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  +12.5%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  מהחודש הקודם
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3} {...({} as any)}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  borderRadius: "0 0 0 100%",
                  bgcolor: "secondary.light",
                  opacity: 0.1,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    width: 48,
                    height: 48,
                  }}
                >
                  <Group />
                </Avatar>
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                24
              </Typography>
              <Typography variant="body2" color="text.secondary">
                משתמשים פעילים
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
                <TrendingUp sx={{ color: "success.main", fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  +3
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  משתמשים חדשים
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3} {...({} as any)}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  borderRadius: "0 0 0 100%",
                  bgcolor: "success.light",
                  opacity: 0.1,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "success.light",
                    color: "success.main",
                    width: 48,
                    height: 48,
                  }}
                >
                  <Business />
                </Avatar>
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                92%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                יעילות תפעולית
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
                <TrendingUp sx={{ color: "success.main", fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  +5.2%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  שיפור
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3} {...({} as any)}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  borderRadius: "0 0 0 100%",
                  bgcolor: "info.light",
                  opacity: 0.1,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "info.light",
                    color: "info.main",
                    width: 48,
                    height: 48,
                  }}
                >
                  <BarChart />
                </Avatar>
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                18
              </Typography>
              <Typography variant="body2" color="text.secondary">
                פרויקטים פעילים
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
                <TrendingUp sx={{ color: "success.main", fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  +2
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  פרויקטים חדשים
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Quick Actions */}
      <Container maxWidth="lg" sx={{ mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          פעולות מהירות
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={4} key={index} {...({} as any)}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onClick={() => navigate(action.path)}
                sx={{
                  p: 2,
                  justifyContent: "flex-start",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "rgba(37, 99, 235, 0.05)",
                  },
                }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Menu Cards */}
      <Container maxWidth="lg" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ mb: 4 }}>
          <Typography textAlign={"right"} variant="h5" component="h2" fontWeight="bold" gutterBottom>
            ניהול העסק שלך
          </Typography>
          <Typography variant="body1" color="text.secondary">
            כל הכלים שאתה צריך לניהול יעיל ומוצלח של העסק שלך במקום אחד
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ direction: "rtl" }} >
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} {...({} as any)}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "primary.light",
                      color: "primary.main",
                      width: 64,
                      height: 64,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {item.description}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(item.path)}
                    sx={{ mt: "auto", alignSelf: "flex-start" }}
                  >
                    כניסה
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Testimonial */}
        <Paper
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            bgcolor: "rgba(37, 99, 235, 0.03)",
            border: "1px solid rgba(37, 99, 235, 0.1)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8} {...({} as any)}>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.dark">
                ".שינתה את הדרך שבה אני מנהל את העסק שלי. הכל נגיש ויעיל BusinessMan מערכת"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                יוסי כהן, בעלים של "טכנולוגיות מתקדמות" בע״מ
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }} {...({} as any)}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register-user")}
                sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
              >
                הצטרף עכשיו
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                הצטרפו למאות עסקים שכבר משתמשים במערכת
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ mt: 8, py: 4 }}>
        <Divider sx={{ mb: 4 }} />
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item {...({} as any)}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="img" src="/logo.svg" alt="BusinessMan Logo" sx={{ height: 32, width: 32, mr: 1 }} />
                <Typography variant="h6" component="div" fontWeight="bold" color="primary">
                  BusinessMan
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                © 2025 BusinessMan. כל הזכויות שמורות.
              </Typography>
            </Grid>
            <Grid item {...({} as any)}>
              <Stack direction="row" spacing={2}>
                <Button variant="text" size="small">
                  תנאי שימוש
                </Button>
                <Button variant="text" size="small">
                  פרטיות
                </Button>
                <Button variant="text" size="small">
                  צור קשר
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
