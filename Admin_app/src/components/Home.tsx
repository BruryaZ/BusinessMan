"use client"

import { useContext } from "react"
import { globalContext } from "../context/GlobalContext"
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from "@mui/material"
import {
  Dashboard,
  Business,
  AttachMoney,
  BarChart,
  Person,
  ArrowForward,
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f7ff, #ffffff)",
        py: 4,
      }}
    >
      <Container>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
            color: "white",
            boxShadow: "0 8px 32px rgba(63, 81, 181, 0.2)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "white",
                color: "primary.main",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Person fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                שלום, {globalContextDetails.user?.firstName || "אורח"} {globalContextDetails.user?.lastName || ""}
              </Typography>
              <Typography variant="subtitle1">ברוכים הבאים למערכת ניהול העסק שלך</Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={12}
              md={6}
              lg={3}
              {...({} as any)}
            >
              <Card sx={{ height: "100%", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {item.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(item.path)}
                    sx={{ mt: "auto" }}
                  >
                    כניסה
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
