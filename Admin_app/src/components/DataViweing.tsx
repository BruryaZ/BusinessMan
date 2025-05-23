"use client"

import type React from "react"

import { useContext, useState } from "react"
import type { Business } from "../models/Business"
import axios from "axios"
import { globalContext } from "../context/GlobalContext"
import BusinessTable from "./BusinessTable"
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
} from "@mui/material"
import { Visibility, Business as BusinessIcon } from "@mui/icons-material"

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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
  },
})

function DataViweing() {
  const url = import.meta.env.VITE_API_URL
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const globalContextDetails = useContext(globalContext)
  const [business, setBusiness] = useState<Business>({
    id: 0,
    businessId: 0,
    name: "",
    address: "",
    email: "",
    businessType: "",
    income: 0,
    expenses: 0,
    cashFlow: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
  })

  const handleSubmit = () => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      const res = await axios.get<Business>(`${url}/api/Business/${globalContextDetails.user.businessId}`, {
        withCredentials: true,
      })
      if (res.status !== 200) {
        setErrors(["שגיאה בטעינת נתוני העסק"])
        setLoading(false)
        return
      }

      if (!res) {
        setErrors(["לא נמצאו נתונים"])
        setLoading(false)
        return
      }

      setBusiness(res.data)
      setDataLoaded(true)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching business data:", error)
      setErrors(["שגיאה בטעינת נתוני העסק"])
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <BusinessIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              צפייה בנתוני העסק
            </Typography>
            <Typography variant="body1" color="text.secondary">
              לחץ על הכפתור כדי לטעון את נתוני העסק העדכניים
            </Typography>
            <Divider sx={{ mt: 3 }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit()}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              startIcon={<Visibility />}
              disabled={loading}
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
              }}
            >
              {loading ? "טוען נתונים..." : "צפה בנתונים"}
            </Button>

            {loading && <CircularProgress sx={{ mt: 4 }} />}

            {dataLoaded && !loading && (
              <Box sx={{ width: "100%", mt: 4 }}>
                <BusinessTable business={business} />
              </Box>
            )}

            {errors.length > 0 && (
              <Box sx={{ width: "100%", mt: 2 }}>
                {errors.map((error, index) => (
                  <Alert key={index} severity="error" sx={{ mb: 1 }}>
                    {error}
                  </Alert>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default DataViweing
