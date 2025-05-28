"use client"

import type React from "react"

import axios from "axios"
import { useState, useContext } from "react"
import { globalContext } from "../context/GlobalContext"
import type { BusinessPostModel } from "../models/BusinessPostModel"
import { convertToBusiness } from "../utils/convertToBusiness"
import { validationSchemaBusinessRegister } from "../utils/validationSchema"
import * as Yup from "yup"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  Alert,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
} from "@mui/material"
import {
  Business,
  LocationOn,
  Email,
  Category,
  AttachMoney,
  MoneyOff,
  AccountBalance,
  Savings,
  CreditCard,
  Calculate,
} from "@mui/icons-material"

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
    MuiTextField: {
      styleOverrides: {
        root: {
          direction: "rtl",
        },
      },
    },
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

const RegisterBusinessData = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const url = import.meta.env.VITE_API_URL
  const [errors, setErrors] = useState<string[]>([])
  const validationSchema = validationSchemaBusinessRegister
  const globalContextDetails = useContext(globalContext)
  const [businessData, setBusinessData] = useState({
    id: 0,
    businessId: 1, // ערך ברירת מחדל
    name: "עסק לדוגמה", // ערך ברירת מחדל
    address: "כתובת לדוגמה", // ערך ברירת מחדל
    email: "example@business.com", // ערך ברירת מחדל
    businessType: "סוג עסק לדוגמה", // ערך ברירת מחדל
    income: 10000, // ערך ברירת מחדל
    expenses: 5000, // ערך ברירת מחדל
    cashFlow: 5000, // ערך ברירת מחדל
    totalAssets: 20000, // ערך ברירת מחדל
    totalLiabilities: 10000, // ערך ברירת מחדל
    netWorth: 10000,
    revenueGrowthRate: undefined,
    profitMargin: undefined,
    currentRatio: undefined,
    quickRatio: undefined,
    createdAt: undefined,
    createdBy: "",
    updatedAt: undefined,
    updatedBy: "",
    users: [],
    invoices: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBusinessData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (businessDetails: BusinessPostModel) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validationSchema
      .isValid(businessDetails)
      .then(async (valid) => {
        setErrors([])
        if (valid) {
          try {
            const { data } = await axios.post<BusinessPostModel>(`${url}/api/Business`, businessDetails, { withCredentials: true })
            console.log("The data", data)
            globalContextDetails.setBusinessGlobal(convertToBusiness(data))
            console.log("globalContextDetails.business_global", globalContextDetails.business_global)
            console.log("convertToBusiness(data)", convertToBusiness(data))

            if (onSubmitSuccess) onSubmitSuccess()
          } catch (e) {
            console.log(e)
            setErrors(["שגיאה בשמירת נתוני העסק"])
          }
        } else {
          setErrors(["נא למלא את כל השדות הנדרשים"])
        }
      })
      .catch((err) => {
        console.log("Validation error:", err.errors)
        if (err instanceof Yup.ValidationError) {
          setErrors(err.errors)
        }
      })
    setErrors([])
  }

  return (
    <ThemeProvider theme={theme}>
            <div style={{marginTop: "50vh"}}></div>

      <CssBaseline />
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Business color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              רישום פרטי העסק
            </Typography>
            <Typography variant="body1" color="text.secondary">
              נא למלא את כל הפרטים הנדרשים לרישום העסק שלך
            </Typography>
            <Divider sx={{ mt: 3 }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(businessData)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              פרטים בסיסיים
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="מזהה ייחודי לעסק"
                  name="businessId"
                  type="number"
                  value={businessData.businessId}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="שם העסק"
                  name="name"
                  value={businessData.name}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="כתובת העסק"
                  name="address"
                  value={businessData.address}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="אימייל של העסק"
                  name="email"
                  type="email"
                  value={businessData.email}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <TextField
                  fullWidth
                  label="סוג העסק"
                  name="businessType"
                  value={businessData.businessType}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Category color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="bold" color="primary">
              נתונים פיננסיים
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4} {...({} as any)}>
                <TextField
                  fullWidth
                  label="הכנסות העסק"
                  name="income"
                  type="number"
                  value={businessData.income}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} {...({} as any)}>
                <TextField
                  fullWidth
                  label="הוצאות העסק"
                  name="expenses"
                  type="number"
                  value={businessData.expenses}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyOff color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} {...({} as any)}>
                <TextField
                  fullWidth
                  label="תזרים מזומנים"
                  name="cashFlow"
                  type="number"
                  value={businessData.cashFlow}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalance color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} {...({} as any)}>
                <TextField
                  fullWidth
                  label="סך הנכסים"
                  name="totalAssets"
                  type="number"
                  value={businessData.totalAssets}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Savings color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} {...({} as any)}>
                <TextField
                  fullWidth
                  label="סך ההתחייבויות"
                  name="totalLiabilities"
                  type="number"
                  value={businessData.totalLiabilities}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} {...({} as any)}>
                <TextField
                  fullWidth
                  label="שווי נקי"
                  name="netWorth"
                  type="number"
                  value={businessData.netWorth}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calculate color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
              }}
            >
              שמור פרטי עסק
            </Button>

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

export default RegisterBusinessData
