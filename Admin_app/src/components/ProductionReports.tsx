"use client"

import type React from "react"

import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tabs,
  Tab,
  Divider,
} from "@mui/material"
import { BarChart, PieChart, Timeline, Assessment, TrendingUp, TrendingDown, ShowChart } from "@mui/icons-material"
import { useState } from "react"

// Create a custom theme with RTL support and Hebrew font
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
  },
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
})

const ProductionReports = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f7ff, #ffffff)",
          py: 4,
        }}
      >
        <Container>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Assessment color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                דוחות ייצור
              </Typography>
              <Typography variant="body1" color="text.secondary">
                צפה בנתוני הייצור והביצועים של העסק שלך
              </Typography>
            </Box>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 4 }}
              TabIndicatorProps={{
                style: {
                  height: 4,
                  borderRadius: 4,
                },
              }}
            >
              <Tab icon={<BarChart />} label="סקירה כללית" />
              <Tab icon={<Timeline />} label="מגמות" />
              <Tab icon={<PieChart />} label="התפלגות" />
            </Tabs>

            <Divider sx={{ mb: 4 }} />

            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3} {...({} as any)}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            bgcolor: "primary.light",
                            borderRadius: "50%",
                            p: 1,
                            mr: 2,
                            display: "flex",
                          }}
                        >
                          <BarChart color="primary" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          סה"כ ייצור
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        1,245
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        יחידות בחודש האחרון
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3} {...({} as any)}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            bgcolor: "success.light",
                            borderRadius: "50%",
                            p: 1,
                            mr: 2,
                            display: "flex",
                          }}
                        >
                          <TrendingUp color="success" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          יעילות
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        92%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        שיפור של 3% מהחודש הקודם
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3} {...({} as any)}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            bgcolor: "error.light",
                            borderRadius: "50%",
                            p: 1,
                            mr: 2,
                            display: "flex",
                          }}
                        >
                          <TrendingDown color="error" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          פחת
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="error.main">
                        2.4%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ירידה של 0.8% מהחודש הקודם
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3} {...({} as any)}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            bgcolor: "secondary.light",
                            borderRadius: "50%",
                            p: 1,
                            mr: 2,
                            display: "flex",
                          }}
                        >
                          <ShowChart color="secondary" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          עלות ייצור
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="secondary.main">
                        ₪85
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        עלות ממוצעת ליחידה
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} {...({} as any)}>
                  <Card sx={{ mt: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        נתוני ייצור חודשיים
                      </Typography>
                      <Box
                        sx={{
                          height: 300,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "grey.100",
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          כאן יוצג גרף נתוני הייצור החודשיים
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  כאן יוצגו נתוני המגמות
                </Typography>
              </Box>
            )}

            {tabValue === 2 && (
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  כאן תוצג התפלגות הנתונים
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default ProductionReports
