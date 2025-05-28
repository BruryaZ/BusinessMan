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
  CircularProgress,
} from "@mui/material"
import {
  BarChart,
  PieChart,
  Timeline,
  Assessment,
  TrendingUp,
  TrendingDown,
  QueryStats,
} from "@mui/icons-material"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { globalContext } from "../context/GlobalContext"
import { ProdactionReportData } from "../models/ProdactionReportData"

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
  },
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
    background: { default: "#f5f5f5" },
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
  const [reportData, setReportData] = useState<ProdactionReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const globalContextDetails = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${url}/api/Reports/business-report/${globalContextDetails.business_global.id}`,
          { withCredentials: true }
        )
        setReportData(data)
      } catch (error) {
        console.error("שגיאה בטעינת דוח ייצור:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f5f7ff, #ffffff)", py: 4 }}>
        <Container>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Assessment color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                דוח ייצור - {reportData?.businessName ?? "טוען..."}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                צפה בביצועי הייצור של העסק שלך
              </Typography>
            </Box>

            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 4 }}>
              <Tab icon={<BarChart />} label="סקירה כללית" />
              <Tab icon={<Timeline />} label="מגמות" />
              <Tab icon={<PieChart />} label="התפלגות" />
            </Tabs>

            <Divider sx={{ mb: 4 }} />

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
              </Box>
            ) : reportData && tabValue === 0 ? (
              <Grid container spacing={3}>
                {[
                  {
                    label: "סה״כ הכנסות",
                    value: `₪${reportData.totalIncome.toLocaleString()}`,
                    icon: <TrendingUp color="success" />,
                    color: "success.light",
                  },
                  {
                    label: "סה״כ הוצאות",
                    value: `₪${reportData.totalExpenses.toLocaleString()}`,
                    icon: <TrendingDown color="error" />,
                    color: "error.light",
                  },
                  {
                    label: "רווח נקי",
                    value: `₪${reportData.netProfit.toLocaleString()}`,
                    icon: <QueryStats color="primary" />,
                    color: "primary.light",
                  },
                  {
                    label: "תזרים מזומנים",
                    value: `₪${reportData.cashFlow.toLocaleString()}`,
                    icon: <BarChart color="secondary" />,
                    color: "secondary.light",
                  },
                  {
                    label: "מספר חשבוניות",
                    value: `${reportData.invoiceCount}`,
                    icon: <Assessment color="info" />,
                    color: "info.light",
                  },
                  {
                    label: "סה״כ חיובים",
                    value: `₪${reportData.totalDebit.toLocaleString()}`,
                    icon: <TrendingDown color="warning" />,
                    color: "warning.light",
                  },
                  {
                    label: "סה״כ זיכויים",
                    value: `₪${reportData.totalCredit.toLocaleString()}`,
                    icon: <TrendingUp color="info" />,
                    color: "info.light",
                  },
                  {
                    label: "תאריך הדוח",
                    value: new Date(reportData.reportDate).toLocaleDateString("he-IL"),
                    icon: <Timeline color="disabled" />,
                    color: "grey.300",
                  },
                ].map((item, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index} {...({} as any)}>
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Box sx={{ bgcolor: item.color, borderRadius: "50%", p: 1, mr: 2 }}>{item.icon}</Box>
                          <Typography variant="h6" fontWeight="bold">
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : tabValue === 1 ? (
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
            ) : tabValue === 2 ? (
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
            ) : (
              <Typography color="error">שגיאה בטעינת הנתונים</Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default ProductionReports
